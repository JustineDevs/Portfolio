import { ABOUT_SECTION_ORDER, type AboutSectionKey } from "@/lib/about-section-keys";

export type AboutSectionConfig = {
  label: string;
  description: string;
  titleLabel?: string;
  subtitleLabel?: string;
  bodyLabel?: string;
  metaLabel?: string;
  metaHint?: string;
};

export const ABOUT_SECTION_CONFIG: Record<AboutSectionKey, AboutSectionConfig> = {
  hero: {
    label: "Hero",
    description: "Personal opener. Use this for who you are, the page framing, and the image that sets the tone.",
    titleLabel: "Headline",
    subtitleLabel: "Subheadline",
    bodyLabel: "Body (Markdown)",
    metaLabel: "Meta JSON",
    metaHint: `Example: { "imageUrl": "/Justinedevs_Banner.png" }`,
  },
  reading_map: {
    label: "Left Rail / Reading Map",
    description:
      "Personal navigation context. Good for a date, short intro, and panels that map your principles, methodology, learning, or under-the-hood themes.",
    titleLabel: "Sidebar heading",
    subtitleLabel: "Sidebar subheading",
    bodyLabel: "Top meta line (Markdown)",
    metaLabel: "Panels JSON",
    metaHint:
      'Example: { "panels": [{ "id": "principles", "title": "/Principles", "description": "How I think", "heading": "How I think", "intro": "Short intro...", "points": ["Point one"] }] }',
  },
  narrative: {
    label: "Primary Narrative",
    description:
      "Main personal content area. Use it for your story, learning path, experience arcs, or what shaped how you work.",
    titleLabel: "Section title",
    bodyLabel: "Content (Markdown)",
  },
  principles: {
    label: "Principles / Methodology",
    description:
      "Secondary narrative area. Use it for principles, methodologies, operating rules, under-the-hood process, or how you approach work.",
    titleLabel: "Section title",
    bodyLabel: "Content (Markdown)",
  },
  learning: {
    label: "Column One",
    description:
      "Flexible personal column. Good for strengths, lessons learned, things you are exploring, or what you are optimizing for.",
    titleLabel: "Column title",
    bodyLabel: "Content (Markdown)",
  },
  under_the_hood: {
    label: "Column Two",
    description:
      "Flexible personal column. Good for mental models, philosophy, technical taste, or how you reason under the hood.",
    titleLabel: "Column title",
    bodyLabel: "Content (Markdown)",
  },
  north_star: {
    label: "Column Three",
    description:
      "Flexible personal column. Good for vision, what you care about, long-term direction, or the future you want to build toward.",
    titleLabel: "Column title",
    bodyLabel: "Content (Markdown)",
  },
};

export function getAboutSectionConfig(sectionKey: string): AboutSectionConfig {
  return (
    ABOUT_SECTION_CONFIG[sectionKey as AboutSectionKey] ?? {
      label: sectionKey,
      description: "Flexible About page slot.",
      titleLabel: "Title",
      subtitleLabel: "Subtitle",
      bodyLabel: "Content (Markdown)",
      metaLabel: "Meta JSON",
    }
  );
}

export function getAboutSectionOptions(sectionKeys: string[]) {
  return sectionKeys.map((sectionKey) => ({
    value: sectionKey,
    label: getAboutSectionConfig(sectionKey).label,
  }));
}

export const ABOUT_SECTION_KEYS = [...ABOUT_SECTION_ORDER];
