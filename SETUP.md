# Portfolio Setup Guide

This document provides detailed setup instructions for the Next.js portfolio implementation.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Design System

The portfolio follows the design specifications from `JSON.md`:

### Color Palette
- **Theme**: `#F8F8F8`
- **Backgrounds**: `#424242` (dark), `#FFFFFF` (light), `#1342FF` (accent)
- **Button**: `#A8CEFF`
- **Icons**: `#484848`
- **Font**: `#383838`
- **Footer Font**: `#2A2A2A`

### Typography
- **Primary Font**: Inter (from Vercel Font)
- **Logo Font**: Inter Bold + Custom

### Style
- Minimalistic + Clean + Threejs aesthetic
- Chromatic theme with `#F8F8F8` and `#424242`

## Component Libraries

The design specifications reference several Framer components. These can be integrated as needed:

- FrameTransitioner - Frame carousel
- HoverTextHighlight - Text hover effects
- LiquidImage - Image effects
- SocmedCardButton - Social media buttons
- ASCIIFlowTrail - Background effects
- PixeledCursorTrail - Cursor effects
- And more...

## Pages Implementation

### Landing Page
- ✅ Navbar with logo, navigation, mode switcher
- ✅ Hero section with avatar and social links
- ✅ Tech Stack & Description
- ✅ Brand Assets & Featured Badge
- ✅ Featured Projects
- ✅ Activity Heatmap
- ✅ Footer

### About Page
- ✅ Sidebar navigation
- ✅ Hero banner
- ✅ Story & Responsibilities
- ✅ Strengths, How, Vision sections
- ✅ Footer

### Experience Page
- ✅ Hero title with decorative elements
- ✅ Timeline navigation
- ✅ Activity heatmap
- ✅ Gallery & Testimonials
- ✅ Footer

### Projects Page
- ✅ Projects hero
- ✅ Projects grid
- ✅ Footer

### Project Showcase
- ✅ Hero project header
- ✅ Responsibilities & Networks
- ✅ Description & Other Projects
- ✅ Brand Assets & Featured Badge
- ✅ Activity heatmap
- ✅ Footer

## Customization

### Updating Content

1. **Project Data**: Edit component files in `components/sections/`
2. **Images**: Replace files in `public/` directory
3. **Colors**: Update `tailwind.config.js` and `app/globals.css`
4. **Typography**: Modify `app/layout.tsx` for font changes

### Adding New Pages

1. Create new directory in `app/`
2. Add `page.tsx` file
3. Import and use existing components
4. Update navigation in `components/Navbar.tsx`

## Dev Container (VS Code / GitHub Codespaces)

The repo includes [`.devcontainer/devcontainer.json`](.devcontainer/devcontainer.json): **Node 22**, **pnpm 9** (via Corepack, matching CI), `pnpm install` on create, port **3000** forwarded for `pnpm dev`.

1. Install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension (VS Code) or open the repo in **GitHub Codespaces**.
2. **Reopen in Container** / create a codespace from this repository.
3. Copy secrets from [`.env.example`](.env.example) into `.env` / `.env.local` as needed (see [`docs/DATABASE.md`](docs/DATABASE.md) for Turso).

### GitHub Releases (tags)

Releases are **standardized** on curated markdown: for every `v*` tag you must add **`docs/releases/<tag>.md`** before tagging (see [`docs/releases/README.md`](docs/releases/README.md)). The workflow loads that file as the release body and appends GitHub’s auto-generated notes. Use `pnpm run release:git-tag` after bumping `package.json` `version`, then push the tag.

## Development Notes

- Uses Next.js 14 App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations (where needed)
- Responsive design with mobile-first approach

## Before you push (CI checks locally)

One-time setup so Git runs the hook from `githooks/`:

```bash
pnpm run git:hooks
```

After that, **`git push`** runs **`pnpm run ci:check`** automatically: `lint` → `test` → production **`build`** (same order as `.github/workflows/ci.yml`, including `AUTH_SECRET` / `CI` placeholders for the build).

**Recommended:** run checks once, then push (same checks, no duplicate run from the hook):

```bash
pnpm run ci:push
```

Optional git arguments after `--`, for example `pnpm run ci:push -- origin main`.

Run the checks manually anytime (without pushing):

```bash
pnpm run ci:check
```

To push without the hook (emergency only): `git push --no-verify`.

## Run GitHub Actions locally ([nektos/act](https://github.com/nektos/act))

Docker is required. Install [act](https://github.com/nektos/act), then from the repo root:

```bash
pnpm run act:ci
```

This runs the `quality` job from `.github/workflows/ci.yml` (lint, unit tests, production build) inside a container close to `ubuntu-latest`. The repo includes a `.actrc` that pins a compatible runner image (`catthehacker/ubuntu:act-latest`).

**Tips**

- First run may pull a large image; use `act pull` to prefetch.
- If `actions/setup-node` cache errors appear under act, they are harmless locally; GitHub-hosted runners still use cache normally.
- On Apple Silicon, try: `act --container-architecture linux/amd64 -W .github/workflows/ci.yml -j quality`
- For full log parity with CI when lint fails, run `pnpm run lint` on the host as well; `verifyTypeScriptSetup` issues are often missing devDependencies or a corrupted install—use `pnpm install --frozen-lockfile` and ensure `typescript`, `@types/node`, and `@types/react` resolve (they are listed in `package.json` devDependencies).

## Next Steps

1. Replace placeholder content with actual data
2. Integrate Framer components as specified
3. Add API routes if needed for dynamic content
4. Set up environment variables for external services
5. Configure image optimization
6. Add analytics and tracking
7. Deploy to Vercel or preferred hosting

