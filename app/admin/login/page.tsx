import { redirect } from "next/navigation";

import { getAdminAuthConfigStatus, isAuthenticatedAdmin } from "@/lib/auth";
import { hasRegisteredAdminUser } from "@/lib/admin-users";
import { adminButtonPrimaryClass } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";
import { signInAsAdminWithGoogle } from "./actions";

type Props = {
  searchParams?: { error?: string };
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const isAdmin = await isAuthenticatedAdmin();
  const config = getAdminAuthConfigStatus();
  const hasAdminUser = await hasRegisteredAdminUser();

  if (isAdmin) {
    redirect("/admin");
  }

  const showAuthError = typeof searchParams?.error === "string";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center">
      <div className="w-full rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#666666]">
          Private Admin
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#424242]">
          Sign in
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#555555]">
          Use the authorized Google account for this site.
        </p>

        {!config.isConfigured ? (
          <p
            className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="alert"
          >
            Google admin sign-in is not fully configured. Set `AUTH_GOOGLE_ID`,
            `AUTH_GOOGLE_SECRET`, and `ADMIN_EMAIL` in `.env`.
          </p>
        ) : null}

        {config.authUrlLooksInvalid ? (
          <p
            className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="alert"
          >
            `AUTH_URL` looks invalid for Auth.js. Set it to the site origin
            only, such as `https://jstn.site`, or remove it and let Auth.js
            infer the host. Do not use `/api/auth/callback/google` or a
            comma-separated list there.
          </p>
        ) : null}

        {!hasAdminUser ? (
          <p
            className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900"
            role="status"
          >
            No admin record exists in the database yet. Seed the admin row in the
            database first, then sign in with the authorized Google account.
          </p>
        ) : null}

        {showAuthError ? (
          <p
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            This Google account could not access admin.
          </p>
        ) : null}

        <form className="mt-6" action={signInAsAdminWithGoogle}>
          <button
            type="submit"
            className={cn(adminButtonPrimaryClass, "w-full rounded-xl px-4 py-3 text-sm font-semibold")}
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </main>
  );
}
