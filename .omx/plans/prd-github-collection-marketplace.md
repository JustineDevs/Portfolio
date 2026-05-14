# PRD: GitHub Collection Marketplace

## Summary
Create a public `/collection` page that turns `JustineDevs/Public-Github-Repo` into a live, searchable developer-resource marketplace inside the portfolio site.

## Problem
The portfolio needs a dedicated destination for curated developer resources that feels intentional, searchable, and trustworthy instead of a static link or generic file list.

## Users
- Developers browsing curated AI, LLM, tooling, and workflow resources
- Recruiters or collaborators evaluating the breadth of the collection
- The site owner, who wants the page to reflect GitHub changes without manual content sync

## User Stories
### US-001 Navigation and Entry
As a site visitor, I want a visible `Collection` navbar route so I can discover the resource hub from anywhere on the site.

Acceptance criteria:
- Navbar includes `/collection`.
- Active-state behavior matches the rest of the site.

### US-002 Live Collection Index
As a visitor, I want the collection index to be generated from the live GitHub repository tree so the page reflects the current repo contents.

Acceptance criteria:
- Repository tree is fetched at request time.
- Top-level folders map to categories.
- Items include path, kind, source links, and category metadata.

### US-003 Marketplace Browsing
As a visitor, I want to search and filter the collection by category and filename so I can find relevant resources quickly.

Acceptance criteria:
- Search works across file names, paths, and category labels.
- Category browsing updates the visible item list.
- Empty states are handled clearly.

### US-004 Accurate File Rendering
As a visitor, I want each supported file type to render in an appropriate component so I can inspect the resource without leaving the site.

Acceptance criteria:
- Markdown renders as formatted content.
- Images render inline.
- Text and JSON render in preformatted views.
- Unsupported files keep external GitHub/raw escape hatches.

### US-005 Square Bordered Visual System
As a visitor, I want collection panels and content blocks to use square bordered boxes so the page feels consistent with the requested visual direction.

Acceptance criteria:
- Collection cards and detail surfaces use borders with no border radius.
- Collection markdown renderers avoid rounded corners.

## Non-Goals
- Editing GitHub repo contents from the site
- Full GitHub auth flow for browsing public content
- Advanced faceted search or local indexing beyond runtime fetch

## Constraints
- No new packages
- Reuse existing layout primitives where practical
- Keep public content safe to render

## Validation
- `npm run lint`
- `npm run build`
- Manual architectural review of the changed collection flow
