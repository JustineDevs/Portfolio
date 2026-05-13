import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { redirect } from "next/navigation";
import { readEnvString } from "@/lib/env";
import {
  authorizeGoogleAdminSignIn,
  findActiveAdminForSession,
  findAdminUserByProviderSubject,
} from "@/lib/admin-users";

type AdminToken = {
  role?: string;
  email?: string;
  adminUserId?: string;
};

type AdminSessionUser = {
  id?: string;
  email?: string | null;
  role?: string;
  adminUserId?: string;
};

/**
 * Google `sub` is often a long digit string (> Number.MAX_SAFE_INTEGER). Prefer OIDC
 * `profile.sub` so we always bind TEXT in SQL. Using `account.providerAccountId` first
 * can yield a JS number (precision loss / i64 overflow in LibSQL) and trigger SQL_INPUT_ERROR.
 */
/** Admin table PKs are small; never treat a 64+ bit OAuth `sub` as a DB id. */
function parseAdminDatabaseId(raw: string | undefined | null): number | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!/^\d+$/.test(s)) return null;
  if (s.length > 15) return null;
  const n = Number.parseInt(s, 10);
  if (!Number.isSafeInteger(n) || n < 1) return null;
  return n;
}

function getGoogleProviderSubject(
  account: { provider?: string; providerAccountId?: string | number | bigint | null } | null | undefined,
  profile: unknown,
): string {
  const subFromProfile = (profile as { sub?: unknown } | undefined)?.sub;
  if (typeof subFromProfile === "string") {
    const trimmed = subFromProfile.trim();
    if (trimmed) return trimmed;
  }
  const id = account?.providerAccountId;
  if (typeof id === "string") {
    const trimmed = id.trim();
    if (trimmed) return trimmed;
  }
  if (typeof id === "bigint") {
    return id.toString();
  }
  if (typeof id === "number" && Number.isInteger(id) && Number.isSafeInteger(id)) {
    return String(id);
  }
  return "";
}

function getGoogleAuthConfigStatus() {
  const clientId = readEnvString("AUTH_GOOGLE_ID");
  const clientSecret = readEnvString("AUTH_GOOGLE_SECRET");
  const adminEmail = readEnvString("ADMIN_EMAIL");

  return {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    hasAdminEmail: !!adminEmail,
    isConfigured: !!clientId && !!clientSecret && !!adminEmail,
  } as const;
}

async function resolveCurrentAdminSession() {
  const session = await auth();
  const user = session?.user as AdminSessionUser | undefined;
  const adminUserId = parseAdminDatabaseId(user?.adminUserId ?? user?.id);

  if (!user || user.role !== "admin") {
    return null;
  }

  const admin = await findActiveAdminForSession({
    adminUserId: adminUserId,
    email: user.email ?? null,
  });

  if (!admin) {
    return null;
  }

  user.id = String(admin.id);
  user.adminUserId = String(admin.id);
  user.role = admin.role;
  user.email = user.email ?? session?.user?.email ?? null;

  return { admin, session };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Google({
      profile(profile) {
        const sub =
          typeof profile.sub === "string"
            ? profile.sub.trim()
            : profile.sub != null
              ? String(profile.sub).trim()
              : "";
        return {
          id: sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") {
        return true;
      }

      const email =
        typeof user.email === "string"
          ? user.email
          : typeof (profile as { email?: unknown } | undefined)?.email === "string"
            ? String((profile as { email: string }).email)
            : "";
      const providerSubject = getGoogleProviderSubject(account, profile);
      const emailVerified = Boolean(
        (profile as { email_verified?: boolean } | undefined)?.email_verified,
      );

      if (!email || !providerSubject || !emailVerified) {
        return false;
      }

      const admin = await authorizeGoogleAdminSignIn({
        email,
        providerSubject,
      });

      if (!admin && process.env.NODE_ENV === "development") {
        console.warn(
          "[auth] Google admin sign-in rejected. Typical causes: ADMIN_EMAIL does not match the Google account; AUTH_SECRET no longer matches the secret used when admin_users.email_hash was created (run: pnpm db:repair-email-hash); or admin status is not active.",
        );
      }

      return !!admin;
    },
    async authorized({ auth: currentAuth, request }) {
      const pathname = request.nextUrl.pathname;

      if (!pathname.startsWith("/admin")) {
        return true;
      }

      if (pathname === "/admin/login") {
        return true;
      }

      const user = currentAuth?.user as AdminSessionUser | undefined;
      const adminUserId = parseAdminDatabaseId(user?.adminUserId ?? user?.id);
      const admin = await findActiveAdminForSession({
        adminUserId,
        email: user?.email ?? null,
      });

      return !!admin;
    },
    async jwt({ token, user, account }) {
      const adminToken = token as AdminToken;

      if (account?.provider === "google") {
        const rawAccountId = account.providerAccountId as
          | string
          | number
          | bigint
          | null
          | undefined;
        const providerSubject =
          typeof user?.id === "string" && user.id.trim()
            ? user.id.trim()
            : typeof rawAccountId === "string" && rawAccountId.trim()
              ? rawAccountId.trim()
              : typeof rawAccountId === "bigint"
                ? rawAccountId.toString()
                : typeof rawAccountId === "number" &&
                    Number.isInteger(rawAccountId) &&
                    Number.isSafeInteger(rawAccountId)
                  ? String(rawAccountId)
                  : "";
        const email =
          typeof user?.email === "string" && user.email ? user.email : adminToken.email;

        if (providerSubject) {
          const admin = await findAdminUserByProviderSubject(providerSubject);
          if (admin && admin.status === "active") {
            adminToken.adminUserId = String(admin.id);
            adminToken.role = admin.role;
            adminToken.email = email ?? adminToken.email;
            return token;
          }
        }
      }

      if (user) {
        const u = user as {
          role?: string;
          email?: string | null;
          adminUserId?: string;
          id?: string;
        };
        adminToken.role = u.role ?? "admin";
        if (u.email) {
          adminToken.email = u.email;
        }
        // Never promote NextAuth `user.id` (Google `sub` can be 21 digits) into adminUserId.
        adminToken.adminUserId = u.adminUserId ?? adminToken.adminUserId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const t = token as AdminToken;
        const sessionUser = session.user as AdminSessionUser;
        sessionUser.role = t.role ?? "admin";
        if (t.email) {
          session.user.email = t.email;
        }
        if (t.adminUserId) {
          sessionUser.id = t.adminUserId;
          sessionUser.adminUserId = t.adminUserId;
        }
      }
      return session;
    },
  },
});

export async function requireAdminSession({
  redirectToLogin = true,
}: {
  redirectToLogin?: boolean;
} = {}) {
  const current = await resolveCurrentAdminSession();

  if (!current) {
    if (redirectToLogin) {
      redirect("/admin/login");
    }
    throw new Error("Unauthorized");
  }

  return current.session;
}

export async function isAuthenticatedAdmin() {
  const current = await resolveCurrentAdminSession();
  return !!current;
}

export function getAdminAuthConfigStatus() {
  return getGoogleAuthConfigStatus();
}
