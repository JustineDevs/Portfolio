# Test Spec: GitHub Collection Marketplace

## Verification Targets
1. Navbar exposes `/collection` without breaking existing routes.
2. Server-side collection index generation compiles and handles live GitHub tree data.
3. Client-side filtering and file-detail loading compile cleanly.
4. Supported file kinds render through the expected UI paths.
5. Collection-specific surfaces remain square-edged and bordered.

## Planned Checks
- `npm run lint`
- `npm run build`

## Manual Assertions
- `/collection` page title and intro copy describe the curated repository correctly.
- Search filters the file list by category, path, and filename.
- Selecting a markdown file renders formatted markdown.
- Selecting an image shows the inline image renderer.
- Selecting JSON/text shows preformatted content.
- Unsupported kinds show GitHub/raw links with fallback messaging.

## Risks To Watch
- GitHub API rate limiting without `GH_TOKEN`
- Remote asset rendering for raw images
- Markdown renderer styles leaking rounded corners into collection surfaces
