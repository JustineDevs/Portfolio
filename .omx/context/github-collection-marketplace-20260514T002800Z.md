## Task Statement
Add `/collection` to the navbar as a first-class page that presents a curated, marketplace-style collection of developer resources sourced live from `https://github.com/JustineDevs/Public-Github-Repo`.

## Desired Outcome
- `/collection` is reachable from the navbar.
- The page fetches the GitHub repository tree in real time.
- Content is categorized from the repository structure.
- Users can search and browse items like a marketplace.
- File content renders accurately by type/component.
- Collection UI surfaces use bordered, square-edged boxes with no radius.

## Known Facts / Evidence
- `components/Navbar.tsx` already includes `/collection`.
- `app/collection/page.tsx`, `components/collection/CollectionPageClient.tsx`, `app/api/collection/file/route.ts`, and `lib/github/public-collection.ts` already exist in the worktree but are untracked.
- The current collection implementation already fetches GitHub data with `cache: "no-store"` and loads file details through `/api/collection/file`.
- `MarkdownContent` currently uses rounded styles in several renderers, which conflicts with the collection requirement for bordered boxes with no radius.
- The repo uses Next.js App Router and existing bordered editorial layouts.

## Constraints
- No new dependencies.
- Preserve existing user edits in the dirty worktree.
- Fetch repository content from GitHub in real time.
- Keep the diff small and aligned with existing site patterns.
- Ralph planning artifacts must exist before implementation proceeds.

## Unknowns / Open Questions
- Exact top-level directory mix inside `Public-Github-Repo` may evolve over time.
- Some file types may not support safe inline preview and will need fallbacks.
- GitHub unauthenticated rate limits may affect runtime unless `GH_TOKEN` is present.

## Likely Codebase Touchpoints
- `components/Navbar.tsx`
- `app/collection/page.tsx`
- `components/collection/CollectionPageClient.tsx`
- `lib/github/public-collection.ts`
- `app/api/collection/file/route.ts`
- `components/content/MarkdownContent.tsx`
