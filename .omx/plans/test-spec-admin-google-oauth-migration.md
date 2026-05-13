# Test Spec: Admin Google OAuth Migration

Created: 2026-05-13

## Verification Scope

- Auth.js Google provider path
- Admin DB lookup/binding logic
- Protected-route authorization checks
- Admin login UX and env documentation changes

## Required Checks

1. Static validation
- `npm run build`
- `npm run lint`

2. Targeted behavioral verification
- First approved Google login binds the unbound admin row.
- Repeated Google login with the same `providerSubject` is accepted.
- Google login for an email not in `admin_users` is rejected.
- Google login for a disabled admin is rejected.
- Protected admin session is rejected once admin status becomes disabled.

3. Regression expectations
- Existing credentials fallback remains functional during migration.
- Admin pages still redirect unauthenticated users to `/admin/login`.
- No new TypeScript or auth-route errors are introduced.

## Evidence Notes

- Prefer repository tests if a suitable test harness exists.
- If the repo lacks auth unit tests, add the smallest focused coverage possible around the new admin-user helpers and route/session checks.
- If some runtime OAuth behavior cannot be fully automated locally, document the exact manual verification steps and keep automated coverage on the authorization logic.
