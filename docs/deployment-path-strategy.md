# Deployment path strategy

This repository contains the personal portfolio and the work-site experience in one Next.js application. The change classifier is deliberately conservative so shared routing, layout, styling, data, dependency, and configuration changes update both surfaces.

## Change classes

- **Personal-only:** personal pages, portfolio sections, navigation, footer, and onboarding.
- **Work-only:** `components/HorizontalScrollPage.tsx` and `components/UnderConstructionPage.tsx`.
- **Shared:** everything else that can affect the runtime, including `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `lib/`, `db/`, `public/`, package files, and unknown source files.
- **CI-only:** tests, GitHub workflow files, scripts, versioning helpers, and local tooling. These can validate CI but never request a host deployment.
- **Documentation-only:** documentation, release notes, `.internal/`, and repository metadata. These skip installation, tests, the production build, and deployment.

## CI behavior

`.github/workflows/ci.yml` always creates a successful change-classification check. The quality job runs for runtime and CI-only changes, but is skipped safely for documentation-only changes. This avoids duplicate personal/work builds while ensuring shared changes are never missed.

## Hosting-provider behavior

The hosting projects must use the same classifier in their provider-level ignored-build setting. Non-app changes—including `.md`, tests, workflow files, scripts, and local tooling—return exit `0` and therefore skip deployment:

```text
Personal Vercel project: node scripts/ignore-deploy.mjs personal
Work Vercel project:     node scripts/ignore-deploy.mjs work
```

The command exits `0` when that surface can safely skip deployment and `1` when the provider should build. Configure the work deployment’s build-watch paths or equivalent ignore-build command with the same shared paths described above. GitHub Actions cannot change an already-configured Vercel or Cloudflare project setting from this repository.

## Safety rule

When adding a new runtime file, it is treated as shared until it is explicitly classified as personal-only or work-only. This favors a redundant deployment over a stale production surface.
