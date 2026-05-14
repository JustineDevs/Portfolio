# Integration Guide

This document explains how the integrated resources are used in the JSTN portfolio project.

## Installed Resources

### 1. React Best Practices (Vercel)
**Location**: `docs/performance/react-best-practices.mdx`

**Usage**:
- Performance checklist before shipping
- Guidelines for component optimization
- Reference for code reviews

**Integration**:
- Documented 8 performance categories
- Created pre-ship checklist
- Applied to current optimizations

### 2. UI UX Pro Max - Design Intelligence
**Location**: `docs/design-system/ui-ux-pro-max-notes.mdx`

**Usage**:
- Design system reference
- Color palette documentation
- Typography and layout patterns

**Integration**:
- Documented selected style (Minimalistic + Clean + ASCII)
- Recorded color palette choices
- Defined component patterns

### 3. Anthropics Skills Pattern
**Location**: `skills/jstn-portfolio/SKILL.md`

**Usage**:
- Agent guidelines for working with codebase
- Code style rules
- File structure conventions

**Integration**:
- Created JSTN Portfolio skill
- Defined DO/DON'T rules
- Documented component patterns

### 4. 33 JavaScript Concepts
**Location**: `docs/fundamentals/README.md`

**Usage**:
- Learning roadmap
- Content series foundation
- Knowledge base

**Integration**:
- Created fundamentals section
- Set up roadmap structure
- Ready for content creation

### 5. Planning-with-Files Workflow
**Location**: `planning/portfolio-v2/`

**Usage**:
- Task planning and tracking
- Research documentation
- Progress logging

**Integration**:
- Implemented 3-file pattern
- Created Portfolio V2 planning files
- Documented workflow in architecture docs

## How to Use

### For Development
1. Check `planning/portfolio-v2/task_plan.md` for current tasks
2. Reference `skills/jstn-portfolio/SKILL.md` for conventions
3. Follow `docs/performance/react-best-practices.mdx` for optimization
4. Use `docs/design-system/ui-ux-pro-max-notes.mdx` for styling

### For AI Agents
1. Read `.cursorrules` for project context
2. Follow `skills/jstn-portfolio/SKILL.md` guidelines
3. Update planning files as work progresses
4. Reference findings to avoid mistakes

### For Content Creation
1. Use `docs/fundamentals/` for JS concepts content
2. Reference design system for styling
3. Follow planning workflow for new features

## File Structure

```
portfolio/
├── docs/
│   ├── performance/
│   │   └── react-best-practices.mdx
│   ├── design-system/
│   │   └── ui-ux-pro-max-notes.mdx
│   ├── fundamentals/
│   │   └── README.md
│   └── architecture/
│       └── planning-workflow.mdx
├── skills/
│   └── jstn-portfolio/
│       └── SKILL.md
├── planning/
│   └── portfolio-v2/
│       ├── task_plan.md
│       ├── findings.md
│       └── progress.md
└── .cursorrules
```

## Next Steps

1. **Content Creation**: Start adding 33 JS Concepts content
2. **Performance Audit**: Run React Best Practices checklist
3. **Design Refinement**: Use UI UX Pro Max for new sections
4. **Planning Updates**: Keep planning files current

## Resources

- [React Best Practices](https://vercel.com/blog/introducing-react-best-practices)
- [UI UX Pro Max](https://ui-ux-pro-max-skill.nextlevelbuilder.io/)
- [Anthropics Skills](https://github.com/anthropics/skills)
- [33 JS Concepts](https://github.com/leonardomso/33-js-concepts)
- [Planning with Files](https://github.com/OthmanAdi/planning-with-files)

