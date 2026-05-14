export const HIGHLIGHT_PLACEMENT_KEYS = [
  "experience.testimonials",
  "experience.awards",
  "experience.certificates",
] as const;

export type HighlightPlacementKey = (typeof HIGHLIGHT_PLACEMENT_KEYS)[number];

export const HIGHLIGHT_PLACEMENT_OPTIONS = [
  { value: "experience.testimonials", label: "Experience / Testimonials" },
  { value: "experience.awards", label: "Experience / Awards" },
  { value: "experience.certificates", label: "Experience / Certificates" },
] as const;

export type HighlightType = "project" | "post" | "testimonial" | "award" | "certificate" | "custom";

const PLACEMENTS_BY_TYPE: Record<HighlightType, HighlightPlacementKey[]> = {
  testimonial: ["experience.testimonials"],
  award: ["experience.awards"],
  project: ["experience.testimonials"],
  post: ["experience.testimonials"],
  certificate: ["experience.certificates"],
  custom: ["experience.testimonials", "experience.awards"],
};

export function getPlacementOptionsForType(highlightType: HighlightType) {
  const allowed = new Set(PLACEMENTS_BY_TYPE[highlightType]);
  return HIGHLIGHT_PLACEMENT_OPTIONS.filter((option) => allowed.has(option.value));
}

export function getDefaultPlacementKeyForType(highlightType: HighlightType): HighlightPlacementKey {
  return PLACEMENTS_BY_TYPE[highlightType][0];
}

export function isPlacementCompatibleWithType(
  placementKey: string | null | undefined,
  highlightType: HighlightType,
): placementKey is HighlightPlacementKey {
  if (!placementKey) return false;
  return PLACEMENTS_BY_TYPE[highlightType].includes(placementKey as HighlightPlacementKey);
}

export function inferLegacyPlacementKey(highlightType: HighlightType): HighlightPlacementKey {
  return getDefaultPlacementKeyForType(highlightType);
}

export function placementMatches(
  placementKey: string | null | undefined,
  highlightType: HighlightType,
  requestedPlacement: HighlightPlacementKey,
) {
  const effectivePlacement = isPlacementCompatibleWithType(placementKey, highlightType)
    ? placementKey
    : inferLegacyPlacementKey(highlightType);

  if (effectivePlacement === requestedPlacement) return true;

  return false;
}
