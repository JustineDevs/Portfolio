# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-05-13

### Added

- CMS admin console improvements (semantic chrome, shared form tokens, live Markdown preview, save-button pending states, dashboard counts).
- Public Privacy Policy and Terms URLs (environment variables and `site_settings`) wired into the footer via `lib/legal-links.ts`.
- Google Search Console HTML verification on the root layout (`metadata.verification.google`).
- Database operator docs (`docs/DATABASE.md`) and consolidated scripts under `scripts/db/`.

### Changed

- Google admin OAuth and admin user lookup behavior; Drizzle config loads `.env` then `.env.local`.
- About, projects, experience, resume/professional sections; GitHub activity, hearts, and engagement-related APIs and UI.
- Navbar, footer, social bar, project showcase, and related components.

### Removed

- Legacy static JSON dumps under `public` where content is now database-backed.
- Deprecated experience / gallery / timeline pieces (see `git log v0.1.0..v0.1.1` for file-level detail).

[0.1.1]: https://github.com/JustineDevs/Portfolio/releases/tag/v0.1.1
