# Database (Turso + Drizzle)

## Environment

Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in `.env` or `.env.local` (local overrides). `drizzle.config.ts` loads `.env` first, then `.env.local`.

Admin sign-in also needs `AUTH_SECRET`, `ADMIN_EMAIL`, and Google OAuth vars as in `.env.example`.

## Day-to-day

| Command | Purpose |
| --- | --- |
| `pnpm db:migrate` | Run `drizzle-kit migrate` against the URL in env. |
| `pnpm db:status` | Show `__drizzle_migrations` and `admin_users` columns (sanity check). |
| `pnpm db:generate` | Generate SQL from schema changes (`drizzle-kit generate`). |
| `pnpm db:studio` | Open Drizzle Studio. |

Scripts live under `scripts/db/` and share `scripts/db/env.cjs` for loading `.env` / `.env.local`.

## Admin Google migrations (`0003` / `0004`)

There is a known gap: `db/migrations/meta/_journal.json` lists migrations through `0004`, but only `0000_snapshot.json` and `0001_snapshot.json` exist under `meta/`. In that state, `drizzle-kit migrate` may not apply `0003_admin_google_oauth.sql` and `0004_admin_google_only.sql` on Turso even though they appear in the journal.

If `pnpm db:status` shows old `admin_users` columns (e.g. `password_hash` but no `provider_subject`), run once:

```bash
pnpm db:apply-google-schema
pnpm db:status
```

That script is idempotent: it applies the SQL files and inserts the correct `__drizzle_migrations` hashes when needed.

## `email_hash` / `AUTH_SECRET`

`admin_users.email_hash` is derived from `ADMIN_EMAIL` and `AUTH_SECRET`. If you rotate `AUTH_SECRET` or get admin `AccessDenied` while Google and schema look correct, recompute hashes:

```bash
pnpm db:repair-email-hash
```

## Long-term cleanup

Regenerating the Drizzle snapshot chain so `0003`/`0004` are fully tracked would remove the need for `db:apply-google-schema`; that is a separate migration-maintenance task.
