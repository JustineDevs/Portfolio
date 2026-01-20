# JSTN Portfolio Skill

This skill defines how AI agents should work with the JSTN portfolio codebase.

## Overview

The JSTN portfolio is a Next.js 14 application built with TypeScript, Tailwind CSS, and Framer Motion. This skill provides guidelines for maintaining consistency, following conventions, and understanding the project structure.

## Project Structure

```
portfolio/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── about/             # About page
│   ├── experience/        # Experience page
│   └── projects/          # Projects pages
├── components/            # React components
│   ├── sections/         # Page sections
│   ├── Navbar.tsx        # Navigation
│   └── Footer.tsx        # Footer
├── lib/                  # Utilities
├── docs/                 # Documentation (MDX)
├── public/               # Static assets
└── skills/              # Agent skills
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `Hero.tsx`, `TechStackDescription.tsx`)
- **Pages**: lowercase with hyphens (e.g., `page.tsx`, `about/page.tsx`)
- **Utilities**: camelCase (e.g., `colors.ts`, `utils.ts`)
- **Documentation**: kebab-case (e.g., `react-best-practices.mdx`)

## Code Style Rules

### DO

- ✅ Use TypeScript for all new files
- ✅ Use functional components with hooks
- ✅ Use Tailwind CSS for styling
- ✅ Place long-form content in MDX files under `docs/`
- ✅ Use Next.js Image component for images
- ✅ Follow React Best Practices (see `docs/performance/`)
- ✅ Use semantic HTML elements
- ✅ Implement proper loading and error states
- ✅ Use Server Components by default, Client Components when needed

### DON'T

- ❌ Don't put long-form copy directly in React components
- ❌ Don't use inline styles (use Tailwind classes)
- ❌ Don't create unnecessary Client Components
- ❌ Don't ignore accessibility (use proper ARIA labels)
- ❌ Don't commit large binary files to git
- ❌ Don't use `any` type in TypeScript (use proper types)

## Component Patterns

### Page Sections
All page sections should be in `components/sections/{page-name}/`:
- Landing page sections: `components/sections/landing/`
- About page sections: `components/sections/about/`
- Experience sections: `components/sections/experience/`

### Component Structure
```tsx
'use client' // Only if needed

import { ... } from '...'

export default function ComponentName() {
  // Component logic
  
  return (
    <section className="...">
      {/* Content */}
    </section>
  )
}
```

## Styling Guidelines

### Color Usage
Use the design system colors from `lib/colors.ts`:
- Theme: `#F8F8F8`
- Background Dark: `#424242`
- Background Accent: `#1342FF`
- Button: `#A8CEFF`
- Icons: `#484848`
- Font: `#383838`

### Tailwind Classes
- Use Tailwind utility classes
- Create custom utilities in `tailwind.config.js` if needed
- Use CSS variables for dynamic colors

## Content Management

### Documentation
- Long-form content → `docs/*.mdx`
- Short descriptions → Component props or constants
- Blog posts → `docs/blog/` (future)

### Images
- Store in `public/` directory
- Use Next.js Image component
- Optimize images before adding
- Use descriptive filenames

## Performance Rules

Follow React Best Practices (see `docs/performance/react-best-practices.mdx`):

1. Eliminate waterfalls (parallel data fetching)
2. Reduce bundle size (code splitting, lazy loading)
3. Optimize server performance (Server Components)
4. Minimize re-renders (memoization)
5. Use proper loading states

## Design System

Follow the design system defined in:
- `docs/design-system/ui-ux-pro-max-notes.mdx`
- Color palette from `lib/colors.ts`
- Typography: Inter font family

## Git Workflow

- Use conventional commit messages
- Create feature branches for new work
- Keep commits focused and atomic
- Use the commit scripts in `package.json`

## Testing Checklist

Before submitting changes:
- [ ] TypeScript compiles without errors
- [ ] No console errors in browser
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Images load correctly
- [ ] Links work properly
- [ ] Accessibility basics (keyboard navigation, screen readers)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Questions?

If unsure about a pattern or convention, check:
1. Existing similar components
2. Documentation in `docs/`
3. React Best Practices guide

