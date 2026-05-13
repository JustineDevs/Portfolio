# PRD: Admin Google OAuth Migration

Created: 2026-05-13
Owner: Ralph

## Problem

The admin surface currently relies on email/password credentials and bootstrap registration. That creates password-management overhead and leaves admin authorization too dependent on a JWT role claim after sign-in.

## Goal

Replace primary admin authentication with Google OAuth while keeping local database-backed authorization and a safe migration path for existing admin records.

## In Scope

- Add Google OAuth provider support to Auth.js.
- Bind approved admin accounts to Google `sub`.
- Preserve local `admin_users` as the allowlist and status source.
- Re-check current admin status on protected requests.
- Update admin login UX to Google-first messaging.
- Keep a temporary migration fallback until binding is complete.

## Out of Scope

- Multi-provider login
- Self-service admin invites
- Full Auth.js adapter/database session migration
- Admin account-management UI

## User Stories

### US-001 Google sign-in for approved admins
As the site owner, I want to sign into `/admin` with Google so that I do not manage a local password for daily access.

Acceptance criteria:
- Clicking the login action starts Google OAuth.
- Only active admins present in the local DB can complete sign-in.
- Successful sign-in reaches `/admin`.

### US-002 Safe first-login binding
As the site owner, I want my existing admin record to bind to my Google account on first approved login so that subsequent logins use a stable provider identity.

Acceptance criteria:
- First approved Google login binds `providerSubject` only when it is currently empty.
- Subsequent login requires the same bound `providerSubject`.
- A different Google account cannot overwrite an existing binding.

### US-003 Protected-route revalidation
As the system, I want every protected admin request to confirm current DB authorization so that disabled admins lose access promptly.

Acceptance criteria:
- Protected admin helpers re-check DB admin status.
- Disabled admins are rejected on the next protected request even if they still hold a JWT.

### US-004 Migration-safe operator flow
As the operator, I want a temporary fallback path and updated docs so that rollout and recovery are manageable.

Acceptance criteria:
- The credentials path remains available during migration.
- Login UX explains Google as the preferred route.
- `.env.example` documents Google OAuth configuration.

## Risks

- Misbinding a Google account during first login.
- Leaving protected routes dependent on stale JWT role data.
- Breaking current admin access before Google binding is complete.

## Verification Targets

- Focused auth tests for first bind, repeat login, unauthorized login, and disabled-admin rejection.
- Fresh lint/build/test evidence after implementation.
