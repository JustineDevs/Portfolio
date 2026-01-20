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

## Development Notes

- Uses Next.js 14 App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations (where needed)
- Responsive design with mobile-first approach

## Next Steps

1. Replace placeholder content with actual data
2. Integrate Framer components as specified
3. Add API routes if needed for dynamic content
4. Set up environment variables for external services
5. Configure image optimization
6. Add analytics and tracking
7. Deploy to Vercel or preferred hosting

