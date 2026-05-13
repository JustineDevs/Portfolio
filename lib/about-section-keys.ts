export const ABOUT_SECTION_KEY_ALIASES = {
  hero: "hero",
  sidebar_intro: "reading_map",
  reading_map: "reading_map",
  story: "narrative",
  narrative: "narrative",
  responsibilities: "principles",
  principles: "principles",
  strengths: "learning",
  learning: "learning",
  thinking: "under_the_hood",
  under_the_hood: "under_the_hood",
  vision: "north_star",
  north_star: "north_star",
} as const;

export type AboutSectionKey = (typeof ABOUT_SECTION_KEY_ALIASES)[keyof typeof ABOUT_SECTION_KEY_ALIASES];

export const ABOUT_SECTION_ORDER: AboutSectionKey[] = [
  "hero",
  "reading_map",
  "narrative",
  "principles",
  "learning",
  "under_the_hood",
  "north_star",
];

export function canonicalizeAboutSectionKey(sectionKey: string): string {
  return ABOUT_SECTION_KEY_ALIASES[sectionKey as keyof typeof ABOUT_SECTION_KEY_ALIASES] ?? sectionKey;
}

export function getAboutSectionSortOrder(sectionKey: string, fallback: number): number {
  const canonical = canonicalizeAboutSectionKey(sectionKey) as AboutSectionKey;
  const index = ABOUT_SECTION_ORDER.indexOf(canonical);
  return index === -1 ? fallback : index;
}
