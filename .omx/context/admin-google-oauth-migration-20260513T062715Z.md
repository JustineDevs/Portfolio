Task statement: Replace admin email/password login with Google OAuth 2.0 in the existing Auth.js-backed admin flow, implementing all discussed phases safely.

Desired outcome:
- Admin login uses Google OAuth instead of manual credential entry.
- Local database remains the authorization source for admin access.
- Existing admin records can migrate via first-login binding.
- Protected admin routes re-check current admin status, not only JWT role.
- Temporary migration fallback remains until Google binding is verified.

Known facts/evidence:
- The repo already uses NextAuth/Auth.js v5 beta with JWT sessions in `lib/auth.ts`.
- Current admin auth uses a credentials provider and a custom login page under `app/admin/login`.
- Admin authorization currently trusts `session.user.role === "admin"` for `/admin/*`.
- Admin records live in `admin_users` with encrypted email and password hash columns in `db/schema.ts`.
- Auth-related env currently includes `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_PASSWORD`, and `ADMIN_DATA_ENCRYPTION_KEY`.
- Prior review concluded the durable Google identity key should be `sub`, stored as a bound provider subject.

Constraints:
- Must preserve existing non-related user changes in a dirty worktree.
- No new dependencies unless required by the existing `next-auth` Google provider path.
- Ralph planning gate requires PRD and test-spec artifacts before implementation.
- Need concise but complete implementation with verification, architect review, and post-cleanup regression.

Unknowns/open questions:
- Whether current installed `next-auth` beta exposes the exact Google provider API expected.
- Whether local test infrastructure already covers auth/server actions.
- Whether database migration snapshots need manual meta updates beyond SQL + schema changes.

Likely codebase touchpoints:
- `lib/auth.ts`
- `lib/admin-users.ts`
- `db/schema.ts`
- `db/migrations/*`
- `app/admin/login/page.tsx`
- `app/admin/login/actions.ts`
- `app/admin/register/*`
- `.env.example`
