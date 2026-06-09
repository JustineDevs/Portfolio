# Cloudflare Migration

This project is prepared for a native Cloudflare Workers deployment using OpenNext and Wrangler.

## Current stack assumptions

- Framework: Next.js App Router
- Runtime target: Cloudflare Workers
- Adapter: `@opennextjs/cloudflare`
- Required local Node version: `22+`

## One-time setup

Initialize Wrangler in the repo:

```bash
npx wrangler@latest init --yes
```

Create the Cloudflare resources referenced by `wrangler.toml`:

```bash
npx wrangler r2 bucket create jstn-site-next-cache
npx wrangler d1 create jstn-site-next-tag-cache
```

After creating the D1 database, copy its `database_id` into `wrangler.toml`.

## Local development

Use the regular Next dev server for day-to-day UI work:

```bash
npm run dev
```

Use the Worker runtime when you need to verify Cloudflare behavior:

```bash
npm run preview:cloudflare
```

Wrangler local secrets live in `.dev.vars` or `.dev.vars.<env>`. Do not commit them.

Example `.dev.vars`:

```dotenv
AUTH_SECRET="replace-me"
AUTH_URL="http://127.0.0.1:8787"
AUTH_GOOGLE_ID="replace-me"
AUTH_GOOGLE_SECRET="replace-me"
ADMIN_EMAIL="you@example.com"
TURSO_DATABASE_URL="libsql://example.turso.io"
TURSO_AUTH_TOKEN="replace-me"
GH_TOKEN="replace-me"
GITHUB_USERNAME="JustineDevs"
NEXT_PUBLIC_PRIVACY_POLICY_URL="/privacy"
NEXT_PUBLIC_TERMS_URL="/terms"
NEXTJS_ENV="development"
```

## Production secrets and vars

Set secrets with Wrangler:

```bash
npx wrangler secret put AUTH_SECRET
npx wrangler secret put AUTH_URL
npx wrangler secret put AUTH_GOOGLE_ID
npx wrangler secret put AUTH_GOOGLE_SECRET
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put TURSO_DATABASE_URL
npx wrangler secret put TURSO_AUTH_TOKEN
npx wrangler secret put GH_TOKEN
```

Set non-secret vars in `wrangler.toml` under `[vars]`, for example:

```toml
[vars]
GITHUB_USERNAME = "JustineDevs"
NEXT_PUBLIC_PRIVACY_POLICY_URL = "https://www.jstn.site/privacy"
NEXT_PUBLIC_TERMS_URL = "https://www.jstn.site/terms"
NEXT_INC_CACHE_R2_PREFIX = "incremental-cache"
```

With `nodejs_compat` enabled, these values are available to the Worker runtime and `process.env`.

## Build and deploy

Build the Worker bundle:

```bash
npm run build:cloudflare
```

Deploy the app:

```bash
npx wrangler deploy
```

Or use the combined script:

```bash
npm run deploy:cloudflare
```

## Notes

- This repo is still on Next.js 14, so OpenNext currently requires `--dangerouslyUseUnsupportedNextVersion`.
- Upgrade to a supported Next.js minor as a follow-up to remove that flag.
- The Worker config enables `nodejs_compat` because this codebase uses Node-oriented packages including Auth.js and the Turso client.
