export type ChangelogEntry = {
  version: string
  date: string
  title: string
  description: string
  highlights: string[]
  changed?: string[]
  verification?: string[]
}

export const changelogEntries: ChangelogEntry[] = [
  {
    version: 'v0.1.4',
    date: 'September 9, 2026',
    title: 'The V2 portfolio becomes the source of truth',
    description: 'The portfolio now carries the public site and work portfolio as one maintained application, with a sharper editorial system and a more dependable release path.',
    highlights: [
      'Established the V2 application as the source for both portfolio surfaces.',
      'Refined the work portfolio with current projects, experience, awards, pricing, and contact flows.',
      'Added a continuous payment-method carousel and restored the Magic UI-style pointer.',
    ],
    changed: [
      'Added host-aware routing for the main and work portfolio surfaces.',
      'Reworked pricing and payment methods to match the current rate card.',
      'Updated work portfolio content, technology logos, social links, and contact interactions.',
      'Mounted Vercel Analytics once in the shared root layout when explicitly enabled.',
    ],
    verification: ['pnpm exec tsc --noEmit', 'pnpm run build', 'git diff --check'],
  },
  {
    version: 'v0.1.3',
    date: 'June 9, 2026',
    title: 'A safer deployment lane',
    description: 'The deployment path was tightened for Cloudflare while keeping the portfolio resilient when remote content or heavier visual layers fail.',
    highlights: [
      'Hardened the Cloudflare migration path with Wrangler and OpenNext guidance.',
      'Removed Vercel-specific deployment assumptions from the application.',
      'Improved WebGL avatar visibility, framing, and hover performance.',
    ],
    changed: [
      'Added Cloudflare deployment files and local preview documentation.',
      'Added softer fallbacks for remote images and public content.',
      'Added regression coverage for database configuration and public-content fallback behavior.',
    ],
    verification: ['npm run lint'],
  },
  {
    version: 'v0.1.2',
    date: 'May 14, 2026',
    title: 'A live collection for useful things',
    description: 'The collection route became a live, category-aware catalog backed by curated GitHub content rather than a static showcase.',
    highlights: [
      'Added the first-class collection route to the portfolio navigation.',
      'Turned the public GitHub repository into a marketplace-style catalog.',
      'Added category-scoped inspection for markdown, images, JSON, text, and PDFs.',
    ],
    changed: [
      'Added live GitHub parsing and filtering for curated resource tables.',
      'Added category-specific markdown rendering for collection panels.',
      'Separated curated resource links from category file inspection.',
    ],
    verification: ['pnpm run build'],
  },
  {
    version: 'v0.1.1',
    date: 'May 13, 2026',
    title: 'Content, authentication, and asset reliability',
    description: 'The first CMS and content-hardening release gave the portfolio a more durable editorial foundation and safer public rendering behavior.',
    highlights: [
      'Hardened Google OAuth configuration and redirect handling.',
      'Normalized image URLs across local paths, GitHub, Google Drive, and Dropbox.',
      'Added real GitHub-flavored markdown rendering with tables, code blocks, and alerts.',
    ],
    changed: [
      'Introduced the About CMS editorial surface.',
      'Added shared markdown rendering across projects, About, and writing.',
      'Limited analytics and Speed Insights to explicit environment flags.',
    ],
    verification: ['npm run lint'],
  },
  {
    version: 'v0.1.0',
    date: 'January 29, 2026',
    title: 'The V2 foundation',
    description: 'The baseline release established the portfolio application, its public routes, and the tooling that supports the work ahead.',
    highlights: [
      'Introduced the Next.js 14 application shell and core portfolio routes.',
      'Established the landing, About, Projects, Experience, and writing foundations.',
      'Aligned repository layout, environment examples, and project documentation.',
    ],
  },
]
