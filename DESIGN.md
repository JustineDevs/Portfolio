---
name: JSTN Portfolio / work.jstn.site
version: 1.0.0
description: A restrained editorial portfolio system for technical product work, influenced by Otter's product-led hierarchy and progressive storytelling.
colors:
  background: "#F8F8F8"
  surface: "#FFFFFF"
  surfaceMuted: "#FBFBFA"
  surfaceAlt: "#F2F4F7"
  ink: "#383838"
  inkMuted: "#666666"
  inkFooter: "#2A2A2A"
  border: "#D5D5D5"
  accent: "#1342FF"
  action: "#424242"
  control: "#A8CEFF"
typography:
  family: "Geist Sans"
  mono: "Geist Mono"
  displayWeight: 900
  headingWeight: 700
  bodyWeight: 400
  labelWeight: 700
  labelTracking: "0.14em"
rounded:
  control: "8px"
  card: "12px"
  pill: "999px"
spacing:
  pageGutter: "16px–64px"
  sectionGap: "32px–64px"
  contentMax: "1280px"
components:
  motion:
    pageTransition: "Framer Motion opacity and vertical settle"
    smoothScroll: "Lenis-style eased scroll"
    hover: "200ms–300ms color, opacity, border, or small translate change"
    reducedMotion: "Remove nonessential transforms and continuous animation"
---

# Design System: JSTN Portfolio / work.jstn.site

## 1. Visual Theme & Atmosphere

The interface is an editorial technical portfolio: quiet, monochrome, structured, and highly legible. It uses a pale neutral canvas, thin rules, compact utility labels, and a small electric-blue accent to make the work feel considered without looking like a dashboard.

The page should feel like a sequence of product chapters rather than a collection of decorative cards. Otter is a useful reference for the information architecture: a clear product promise, proof immediately after the promise, progressive feature sections, comparison/content blocks, and repeated calls to action. The portfolio should borrow that pacing—not the restaurant-specific visual identity or copy.

## 2. Color Palette & Roles

- **Paper background (#F8F8F8):** The global page canvas. It keeps large sections calm and lets white content surfaces read as intentional panels.
- **Clean surface (#FFFFFF):** Navigation, hero text panels, forms, and content blocks.
- **Soft panel (#FBFBFA):** Secondary content that needs separation without a strong border.
- **Cool alternate panel (#F2F4F7):** Dense utility or supporting regions.
- **Graphite ink (#383838):** Primary body copy and display text.
- **Muted graphite (#666666):** Supporting copy, descriptions, metadata, and inactive controls.
- **Footer charcoal (#2A2A2A):** High-contrast footer text and attribution.
- **Rule gray (#D5D5D5):** Structural dividers and panel boundaries. Rules should remain thin and quiet.
- **Electric blue (#1342FF):** Active navigation, focus indication, links, selected states, and the single high-energy accent.
- **Action graphite (#424242):** Primary filled buttons and strong navigation actions.
- **Soft blue (#A8CEFF):** Secondary control emphasis where a lighter action cue is needed.

## 3. Typography Rules

Use Geist Sans for all interface text and Geist Mono for compact technical metadata when it improves scanning. Display headings are heavy and tightly tracked; section headings are bold but restrained; body copy is regular with generous line height.

- Hero display: 72–86px at desktop, weight 900, very tight tracking, reduced responsively.
- Section headings: 18–20px, weight 700, slight negative tracking.
- Body copy: 14–16px, muted graphite, approximately 1.6 line height.
- Eyebrows and utility labels: 10–11px, weight 700, uppercase, wide tracking around `0.14em`.
- Navigation: 12–14px, medium weight, modest tracking.
- Never use oversized headings without a nearby explanation or action; preserve a readable text measure.

## 4. Component Stylings

* **Buttons:** Use squared-to-subtly-rounded controls around 8px rather than playful pills, except for the Personal/Professional switch and compact status controls. Primary actions use graphite with white text; secondary actions use white with a gray rule; links use electric blue. Hover changes color or border before adding movement.
* **Cards and containers:** Prefer open editorial panels, thin borders, and shared grid rules. Use 12px corners only where a card needs grouping. Avoid nesting many rounded cards inside rounded cards. Elevation is whisper-soft or absent; structure comes from spacing and dividers.
* **Navigation:** Keep the utility strip visually distinct from the main navigation. The main navigation is sticky, white, and rule-separated. Active links use a small blue indicator or underline. The mobile navigation must preserve the same order and action hierarchy.
* **Hero:** Use a two-column split on desktop: visual system or image on the left, concise identity and promise on the right. On small screens stack the visual above the text. Avoid letting the visual consume the entire first viewport before the title becomes visible.
* **Capability grids:** Group technical skills by meaningful category. Icons should be monochrome, aligned, and captioned; hover may raise contrast but should not cause layout shift.
* **Platform logo rail:** Present platform logos as a clean, border-led strip below the explanatory title and description. Remove decorative hover transformations unless they communicate an actionable link.
* **Project proof:** Use repeated, predictable blocks with a strong title, short evidence line, and one clear action. Proof should follow the hero like Otter's trust and feature sections follow its product promise.
* **Inputs and forms:** White backgrounds, thin gray rules, 8px corners, visible labels, blue focus rings, and explicit success/error feedback. Destructive controls require confirmation and must be visually secondary to save actions.

## 5. Layout Principles

The primary frame is centered with a maximum width near 1280px. Use one shared vertical rule system so adjacent sections align exactly. Desktop layouts commonly use a 42/58 split or an equal two-column grid; mobile layouts collapse to one column with consistent horizontal gutters.

Structure the landing page as a narrative:

1. Utility identity and external signals.
2. Sticky primary navigation.
3. Hero promise and visual proof.
4. Capabilities and working method.
5. Platform development stack.
6. Brand assets and featured projects.
7. Proof of work and activity.
8. Resources, social links, and footer.

Keep major sections separated by rules and intentional whitespace, not arbitrary gaps. A section should either introduce an idea, provide proof, or offer a next action. Remove empty regions that do none of those things.

## 6. Motion & Interaction Contract

Motion should make the page feel responsive and continuous while preserving editorial calm.

- **Page transitions:** Use a short opacity/vertical settle transition when navigating between routes. Do not replay global entrance animation on every nested render.
- **Smooth scroll:** Preserve eased scrolling, but never hijack native scrolling or prevent keyboard/page navigation. Respect `prefers-reduced-motion`.
- **Hover:** Use 200–300ms transitions for color, opacity, borders, and a maximum translate of roughly 2px. Avoid hover effects on noninteractive platform logos.
- **Mode switching:** Personal/Professional content can crossfade and settle in place; the container height must remain stable enough to prevent jumps.
- **Scroll reveal:** Reveal only meaningful content groups once, with low-distance movement and opacity. Keep text readable while it enters.
- **Focus and active states:** Keyboard focus remains visible with the blue accent even when visual selection borders are removed.
- **Feedback:** Save, delete, loading, empty, and error states must be explicit. Deletion always requires confirmation; cancellation leaves the current form unchanged.

## 7. Responsive & Accessibility Guardrails

- Preserve the content hierarchy at mobile widths; do not simply shrink the desktop grid.
- Keep interactive targets at least 44px high where practical.
- Maintain visible focus indicators and accessible names for icon-only controls.
- Ensure tables and comparison rows scroll horizontally rather than compressing into unreadable text.
- Use semantic headings in order and keep body measures around 60–78 characters where possible.
- Disable nonessential animation for reduced-motion users and avoid motion that changes reading position unexpectedly.

## 8. Do's and Don'ts

### Do

- Use the shared neutral palette and one blue accent.
- Let borders, alignment, and spacing carry the visual system.
- Build sections as reusable content primitives.
- Make the next action obvious after each proof section.
- Validate visual states at desktop, tablet, and mobile widths.

### Don't

- Add gradients, glowing effects, or decorative animation without a content purpose.
- Mix several card radii or shadow styles in the same section.
- Repeat utility bars or global UI on route transitions.
- Hide important content behind hover-only behavior.
- Introduce a custom component when an existing shared primitive already expresses the behavior.
