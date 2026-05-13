# Portfolio CMS V1 Implementation Plan

Created: 2026-05-12
Scope: Add a lightweight private CMS, real GitHub-backed activity data, a functional writing system, and replace the low-signal gallery area without turning the portfolio into a heavy back-office app.

## Requirements Summary

- The portfolio currently renders most important content from hardcoded modules and component-local objects instead of a database:
  - Home personal mode stitches together static sections in `app/page.tsx:47-69`.
  - About is composed from fixed sections in `app/about/page.tsx:11-23`.
  - Experience still renders the current gallery/testimonials block from `app/experience/page.tsx:30-42`.
  - Projects list/detail still depend on `lib/projects.ts` via `app/projects/[slug]/page.tsx:7-18`, `components/sections/projects/ProjectsGrid.tsx:7-19`, and `components/sections/project-showcase/HeroProjectHeader.tsx:6-16`.
- The current activity heatmap is not using live GitHub data. It imports bundled JSON from `components/sections/ActivitySection.tsx:7` and still includes synthetic contribution generation logic in `components/sections/ActivitySection.tsx:103-153`.
- The experience gallery area is low-signal and partly hardcoded; `components/sections/experience/GalleryTestimonials.tsx:8-17` contains inline testimonial data and `:24-61` dedicates half the area to a 3D gallery.
- The professional mode duplicates a large amount of static content in one monolithic file, including badges, education, experience, project cards, and a second synthetic activity model in `components/sections/professional/ResumePage.tsx:25-140` and `:155-238`.
- The about sidebar is currently fully component-local content in `components/sections/about/Sidebar.tsx:5-63`.
- Home featured badges/projects are also hardcoded inside `components/sections/BrandBadgeProjectsSection.tsx:19-34`, `:195-247`, and `:255-307`.
- The app already has a working pattern for server-side route handlers and env-based secrets in `app/api/hearts/route.ts:1-143`, but no auth layer or database layer yet.
- Current package state has no ORM/auth/database dependencies yet in `package.json:22-56`.

## V1 Goals

1. Replace hardcoded portfolio content with a structured database-backed content model.
2. Keep GitHub activity read-only and server-fetched with `GH_TOKEN`.
3. Add a private admin area for a single owner.
4. Make writing/blog functional for both native articles and social/external posts.
5. Replace the current gallery area with a higher-signal proof/working/writing surface.
6. Keep the system small enough that updating content feels easier than editing source files manually.

## Out Of Scope For V1

- Multi-user roles
- Scheduled publishing
- Shareable public preview tokens
- Full block-based page builder
- Automatic social platform imports
- Full media library with transformations
- Realtime editing/collaboration

## Stack Decisions

- Database: Turso/libSQL
- ORM/migrations: Drizzle ORM + drizzle-kit
- Admin auth: Auth.js with a single-owner allowlist
- Public caching/revalidation: Next.js tags/path revalidation
- GitHub activity: server-only GraphQL fetch + cache + optional snapshot persistence

## Content Models

### 1. `projects`

Purpose: Replace `lib/projects.ts` and all current project consumers.

Fields:
- `id`
- `slug` unique
- `title`
- `summary`
- `body_md`
- `category`
- `status` (`draft|published|archived`)
- `published_at`
- `updated_at`
- `featured` boolean
- `cover_image_url`
- `banner_image_url`
- `author_name`
- `author_url`
- `website_url`
- `sort_order`

Related tables:
- `project_tags(project_id, tag)`
- `project_technologies(project_id, technology, sort_order)`
- `project_responsibilities(project_id, responsibility, sort_order)`
- `project_networks(project_id, network, sort_order)`
- `project_links(project_id, type, label, url, sort_order)`
- `project_awards(project_id, award_id)`

### 2. `posts`

Purpose: Power `/blog` and the “published on social media” use case.

Fields:
- `id`
- `slug` unique
- `title`
- `summary`
- `body_md` nullable
- `post_type` (`native|external`)
- `source_platform` nullable
- `canonical_url` nullable
- `cover_image_url` nullable
- `status` (`draft|published|archived`)
- `published_at`
- `updated_at`
- `featured` boolean

Rules:
- `native` posts require `body_md`
- `external` posts require `canonical_url`

### 3. `testimonials`

Purpose: Replace inline testimonial arrays in `GalleryTestimonials` and future highlight slots.

Fields:
- `id`
- `name`
- `role`
- `company`
- `quote`
- `avatar_url`
- `status`
- `featured`
- `sort_order`

### 4. `awards`

Purpose: Replace hardcoded badge/award objects in `BrandBadgeProjectsSection` and `ResumePage`.

Fields:
- `id`
- `slug`
- `title`
- `event_name`
- `description`
- `award_type`
- `year`
- `proof_url`
- `logo_url`
- `status`
- `featured`
- `sort_order`

### 5. `page_sections`

Purpose: Keep About and selected homepage copy editable without a page builder.

Fields:
- `id`
- `page_key` (`home|about|experience|projects`)
- `section_key`
- `title`
- `subtitle`
- `body_md`
- `meta_json`
- `status`
- `sort_order`

Use for:
- about hero/story/principles/writing intro
- home “now”, “availability”, or small intro blocks

### 6. `highlights`

Purpose: Drive the replacement for the gallery area and homepage proof blocks.

Fields:
- `id`
- `highlight_type` (`project|post|testimonial|award|custom`)
- `target_id` nullable
- `title_override` nullable
- `summary_override` nullable
- `image_url_override` nullable
- `link_override` nullable
- `pinned` boolean
- `status`
- `sort_order`

Rule:
- pinned items render first
- remaining empty slots auto-fill from latest eligible published items

### 7. `site_settings`

Purpose: Small config surface without hardcoding constants.

Fields:
- `key`
- `value_json`

Use for:
- home availability text
- GitHub username
- GitHub activity cache timestamp
- contact links

### 8. `github_activity_snapshots` (optional but recommended)

Purpose: Preserve last-known-good activity state and avoid blank UI on fetch failures.

Fields:
- `id`
- `year`
- `payload_json`
- `fetched_at`
- `source_hash`

## Admin Route Plan

Create a private admin area under `app/admin`.

Required routes:
- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `app/admin/projects/page.tsx`
- `app/admin/projects/new/page.tsx`
- `app/admin/projects/[id]/page.tsx`
- `app/admin/writing/page.tsx`
- `app/admin/writing/new/page.tsx`
- `app/admin/writing/[id]/page.tsx`
- `app/admin/highlights/page.tsx`
- `app/admin/about/page.tsx`
- `app/admin/settings/page.tsx`
- `app/admin/activity/page.tsx`

Support routes/actions:
- `app/api/admin/activity/refresh/route.ts` or a server action entrypoint
- `app/api/revalidate/route.ts` only if a shared webhook/secret path is truly needed

Recommended admin navigation:
- Dashboard
- Projects
- Writing
- Highlights
- About
- Activity
- Settings

## Public Route Additions

- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`

Public data loaders should be server-only helpers, not client-side fetches:
- `lib/db/*`
- `lib/content/public.ts`
- `lib/content/admin.ts`
- `lib/github/activity.ts`

## File And Module Plan

### New foundation

- `drizzle.config.ts`
- `db/schema.ts`
- `db/client.ts`
- `db/seed.ts`
- `db/migrations/*`
- `lib/auth.ts`
- `middleware.ts` if needed for admin route protection
- `lib/content/public.ts`
- `lib/content/admin.ts`
- `lib/content/revalidate.ts`
- `lib/github/activity.ts`
- `lib/github/normalize-activity.ts`

### Refactor targets first

1. `lib/projects.ts:1-433`
   - first data source to migrate because it fans out into `/projects`, project detail, and featured project cards.

2. `components/sections/projects/ProjectsGrid.tsx:7-19`
   - convert from `getAllProjects()` to server-supplied DB content.

3. `app/projects/[slug]/page.tsx:7-18`
   - replace `getProjectBySlug()` and static params source.

4. `components/sections/project-showcase/HeroProjectHeader.tsx:6-16`
   - remove direct import of `projects` fallback and consume DB model.

5. `components/sections/ActivitySection.tsx:7-30` and `:57-159`
   - replace bundled JSON and synthetic calculations with GitHub-backed normalized payloads.

6. `components/sections/experience/GalleryTestimonials.tsx:8-17` and `:24-61`
   - replace current gallery/testimonial block with the new proof-of-work surface.

7. `components/sections/BrandBadgeProjectsSection.tsx:19-34`, `:195-247`, and `:255-307`
   - move hardcoded awards and featured cards into DB-backed content.

8. `components/sections/about/Sidebar.tsx:5-63`
   - convert to `page_sections`-backed about content and add a real writing entrypoint.

9. `components/sections/professional/ResumePage.tsx:25-140` and `:155-238`
   - deduplicate static content into shared loaders after the public models exist.

## Migration Order

### Phase 1. Data Foundation

Goal: establish DB, auth shell, and typed content access.

Tasks:
1. Add dependencies:
   - `drizzle-orm`
   - `drizzle-kit`
   - `@libsql/client`
   - `next-auth` / `auth.js` compatible package choice
   - markdown/sanitization packages if native articles will render markdown
2. Add Turso env wiring and DB client.
3. Define schema for:
   - `projects`
   - `posts`
   - `testimonials`
   - `awards`
   - `page_sections`
   - `highlights`
   - `site_settings`
   - optional `github_activity_snapshots`
4. Add migration scripts to `package.json`.
5. Add auth guard primitives for admin-only reads/writes.

Acceptance criteria:
- `npm run db:generate` produces migration files
- `npm run db:migrate` can create a fresh local schema
- server-only DB client exists and is importable from routes/actions
- admin guard helper exists and rejects anonymous access

### Phase 2. Seed And Backfill

Goal: preserve current site content while refactoring.

Tasks:
1. Write a one-time seed/import script from:
   - `lib/projects.ts:35-433`
   - `components/sections/about/Sidebar.tsx:5-63`
   - `components/sections/BrandBadgeProjectsSection.tsx:19-34`
   - `components/sections/experience/GalleryTestimonials.tsx:8-17`
   - selected static copy from `ResumePage`
2. Store GitHub username and activity settings in `site_settings`.
3. Seed a few starter `posts`:
   - at least one `native`
   - at least one `external`

Acceptance criteria:
- a fresh DB can be populated from current repo content
- seeded projects match current slugs
- seeded awards/testimonials renderable data exists
- at least one blog post appears in the DB

### Phase 3. Public Read Layer

Goal: create a clean server-side content API before editing components.

Tasks:
1. Add `getPublishedProjects`, `getProjectBySlug`, `getFeaturedProjects`.
2. Add `getPublishedPosts`, `getPostBySlug`, `getFeaturedHighlights`.
3. Add `getPageSections(pageKey)`.
4. Add `getTestimonials`, `getAwards`.
5. Add `getGithubActivitySummary(year)` with cache and snapshot fallback.

Acceptance criteria:
- public loaders never return drafts
- loaders are server-only
- content loaders return stable typed shapes for the UI

### Phase 4. Refactor Projects Surface First

Goal: move the highest-value public content off hardcoded files.

Tasks:
1. Refactor `app/projects/[slug]/page.tsx:10-18` to load DB project records.
2. Refactor `components/sections/projects/ProjectsGrid.tsx:9-19` to render server-fed projects.
3. Refactor `components/sections/project-showcase/HeroProjectHeader.tsx:15-18` and downstream project showcase components to accept DB project data.
4. Refactor featured project usage in `BrandBadgeProjectsSection`.
5. Remove project reads from `lib/projects.ts` consumers.

Acceptance criteria:
- `/projects` and `/projects/[slug]` render from DB
- seeded project slugs still resolve
- `lib/projects.ts` is no longer in the public read path

### Phase 5. Build Writing And About Content

Goal: make blog/social writing real and stop hardcoding the about index.

Tasks:
1. Add `app/blog/page.tsx` and `app/blog/[slug]/page.tsx`.
2. Add rendering rules for `native` vs `external` posts.
3. Refactor `components/sections/about/Sidebar.tsx:5-63` to pull `page_sections`/writing metadata instead of inline constants.
4. Refactor the about route from `app/about/page.tsx:11-23` to pass data-driven section content to child components.

Acceptance criteria:
- `/blog` exists and lists published posts
- external/social posts have canonical outbound links
- about route can change sidebar/principles/blog intro without code edits

### Phase 6. Replace Activity And Gallery

Goal: ship the highest-signal experience-page improvement.

Tasks:
1. Replace `components/sections/ActivitySection.tsx:7-159` synthetic logic with normalized GitHub data.
2. Add a refresh path for admin-triggered activity sync.
3. Replace `components/sections/experience/GalleryTestimonials.tsx:20-64` with a `ProofOfWorkSection`.
4. `ProofOfWorkSection` should combine:
   - pinned highlights
   - recent published posts
   - awards
   - testimonials
   - optional GitHub activity summary

Acceptance criteria:
- activity section no longer depends on bundled `JustineDevs_Activity_History.json`
- activity can tolerate GitHub fetch failure via last-known-good data
- gallery area is removed
- experience page shows proof/work/writing signals instead

### Phase 7. Admin UI

Goal: give the owner a low-friction editing workflow.

Tasks:
1. Build admin dashboard with summary counts and recent drafts.
2. Build `Projects` CRUD.
3. Build `Writing` CRUD with `native|external` field switching.
4. Build `Highlights` curation/reordering.
5. Build grouped `About` section editing.
6. Build `Activity` settings/refresh panel.
7. Revalidate content tags/paths after successful mutations.

Acceptance criteria:
- admin can create/edit/publish/archive a project
- admin can create/edit/publish/archive a native article
- admin can create/publish an external/social post
- admin can pin/unpin highlights
- admin can refresh GitHub activity manually

### Phase 8. Professional Mode Cleanup

Goal: stop maintaining a second static data island.

Tasks:
1. Refactor `components/sections/professional/ResumePage.tsx:25-140` to load awards, highlights, projects, experience, and section content from the same DB.
2. Remove the second synthetic activity implementation from `ResumePage.tsx:155-238`.
3. Keep the professional presentation, but reuse public data loaders.

Acceptance criteria:
- professional mode uses the same source-of-truth content as personal mode
- no synthetic activity remains in `ResumePage`

## Suggested Schema/File Creation Order

1. `drizzle.config.ts`
2. `db/schema.ts`
3. `db/client.ts`
4. `db/migrations/*`
5. `lib/auth.ts`
6. `lib/content/public.ts`
7. `lib/content/admin.ts`
8. `db/seed.ts`
9. `lib/github/activity.ts`
10. public route refactors
11. admin routes

## Acceptance Criteria

- Projects content is editable without touching `lib/projects.ts`.
- Blog/writing exists with both `native` and `external` post support.
- About page sidebar/principles/blog intro are editable without code changes.
- Experience page no longer contains the current 3D gallery block from `components/sections/experience/GalleryTestimonials.tsx:24-41`.
- Activity no longer depends on bundled JSON or synthetic contribution generation from `components/sections/ActivitySection.tsx:103-153`.
- Admin can manage projects, writing, highlights, about sections, and activity refresh from `/admin`.
- Public routes only render `published` content.
- Publish/unpublish actions invalidate the correct route tags/paths.
- Professional mode consumes shared data rather than a second hardcoded content island.

## Risks And Mitigations

- Risk: scope explosion from too many content types.
  - Mitigation: keep v1 to `projects`, `posts`, `testimonials`, `awards`, `page_sections`, `highlights`, `site_settings`.

- Risk: duplicated content survives in `ResumePage`.
  - Mitigation: defer visual cleanup, but force all data reads through shared loaders in Phase 8.

- Risk: activity fetch failures produce broken UI.
  - Mitigation: cache + optional snapshot fallback + admin refresh control.

- Risk: blog becomes too heavy to use.
  - Mitigation: only two post types; no scheduler; no page builder.

- Risk: project migration breaks slugs or static paths.
  - Mitigation: seed from existing `lib/projects.ts` slugs and verify each current slug before removing the old loader.

- Risk: gallery replacement becomes manual curation overhead.
  - Mitigation: mixed mode where pinned highlights override and remaining slots auto-fill.

## Verification Steps

1. Schema and migrations
   - run `db:generate`
   - run `db:migrate`
   - verify all planned tables exist

2. Seed/backfill
   - run the seed/import script
   - verify seeded projects match current route slugs

3. Public routes
   - verify `/projects`
   - verify 3 existing project detail slugs
   - verify `/blog`
   - verify `/about`
   - verify `/experience`

4. Admin flows
   - create draft project
   - publish project
   - edit published project and republish
   - create native post
   - create external post
   - pin a highlight
   - edit an about section
   - trigger GitHub activity refresh

5. State/content safety
   - confirm draft content is not visible publicly
   - confirm archived content disappears from public lists
   - confirm activity fetch failure still renders last-known-good state

6. Cleanup proof
   - confirm `lib/projects.ts` is no longer used by public project routes
   - confirm `GalleryTestimonials` is removed or replaced
   - confirm no synthetic contribution generation remains in the active activity path

## First Components To Refactor

Priority order:
1. `lib/projects.ts`
2. `app/projects/[slug]/page.tsx`
3. `components/sections/projects/ProjectsGrid.tsx`
4. `components/sections/project-showcase/HeroProjectHeader.tsx`
5. `components/sections/ActivitySection.tsx`
6. `components/sections/experience/GalleryTestimonials.tsx`
7. `components/sections/BrandBadgeProjectsSection.tsx`
8. `components/sections/about/Sidebar.tsx`
9. `components/sections/professional/ResumePage.tsx`

Reason:
- this order removes the highest-content-debt areas first while preserving your current design system and layout structure.
