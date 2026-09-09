import { redirect } from "next/navigation";

import { getAdminAuthConfigStatus, isAuthenticatedAdmin } from "@/lib/auth";
import { hasRegisteredAdminUser } from "@/lib/admin-users";
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
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-[#e5e5e5] bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">Portfolio Admin</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#171717]">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-[#737373]">Sign in with the authorized Google account to manage your portfolio.</p>
        </div>

        {!config.isConfigured ? (
          <p
            className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="alert"
          >
            Google admin sign-in is not fully configured. Set `AUTH_GOOGLE_ID`,
            `AUTH_GOOGLE_SECRET`, and `ADMIN_EMAIL` in `.env`.
          </p>
        ) : null}

        {config.authUrlLooksInvalid ? (
          <p
            className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
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
            className="mt-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900"
            role="status"
          >
            No admin record exists in the database yet. Seed the admin row in the
            database first, then sign in with the authorized Google account.
          </p>
        ) : null}

        {showAuthError ? (
          <p
            className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            This Google account could not access admin.
          </p>
        ) : null}

        <form className="mt-6" action={signInAsAdminWithGoogle}>
          <button
            type="submit"
            className="w-full rounded-md bg-[#171717] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </main>
  );
}
