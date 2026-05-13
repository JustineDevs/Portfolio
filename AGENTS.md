## Learned User Preferences

- When the user talks about restructuring the projects page around "contract" versus "canonical" (or similar), confirm whether they mean legal contract-design framing or technical blockchain wording before adding sections, labels, or data fields; a misread led to reverting the projects page to the prior layout.
- Prefers the custom pixel cursor to feel fast and line up accurately with the pointer, with the cursor using charcoal (#424242) while hovering the hero avatar.
- When tuning performance from Lighthouse-style audits, treat dev-bundle warnings (for example "not minified") as lower signal than production (`next build` / deployed) measurements.

## Learned Workspace Facts

- The projects listing uses a single bordered grid in `ProjectsGrid` (lane-based sections and `portfolioLane`-style splits were removed after the revert).
- Custom webpack `splitChunks` in `next.config.js` applies only to production client bundles (`!dev && !isServer`); running it during `next dev` can break Next's dev chunk manifest and cause 404s for `/_next/static/chunks/*.js`, then cascading 404s for pages and API routes until `.next` is cleared and the dev server is restarted.
- Dev Container (`.devcontainer/devcontainer.json`): TypeScript Node 22 Bookworm image, Corepack `pnpm@9`, `postCreateCommand` runs `pnpm install`, forwards port 3000.
- GitHub Actions: CI workflow runs on push and pull request to `main` or `master` (pnpm 9, Node 22, lint, test, build with a non-secret placeholder `AUTH_SECRET`); `NODE_ENV=production` is only set for the build step. After `pnpm run git:hooks`, `git push` runs `pnpm run ci:check` via `githooks/pre-push` (skipped when `GIT_PUSH_BYPASS_HOOK` is set, e.g. after `pnpm run ci:push` already ran checks). Pushing a `v*` tag runs the Release workflow: **required** curated notes at `docs/releases/<tag>.md` become the release body; GitHub auto-generated notes are appended. See `docs/releases/README.md`; `pnpm run release:git-tag` fails if that file is missing.
- Google OAuth (Auth.js / NextAuth) redirect URIs follow `{origin}/api/auth/callback/google`; local and production examples are documented in `.env.example`.
- Production database is Turso (libSQL) with Drizzle; day-to-day commands and env load order (`.env` then `.env.local`) are documented in `docs/DATABASE.md`, with helpers under `scripts/db/` wired as `pnpm db:status`, `pnpm db:apply-google-schema`, and `pnpm db:repair-email-hash`.
- Local dev uses plain `next dev` without `--turbo` when relying on custom webpack in `next.config`; shared CMS/public content shapes that must stay client-importable live in `lib/content/types.ts` so admin UI does not pull `@libsql/client` into the bundler.
