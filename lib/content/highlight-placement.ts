export const HIGHLIGHT_PLACEMENT_KEYS = [
  "experience.projects",
  "experience.writing",
  "experience.testimonials",
  "shared.awards",
  "home.awards",
  "experience.awards",
  "shared.certificates",
  "home.certificates",
  "experience.certificates",
] as const;

export type HighlightPlacementKey = (typeof HIGHLIGHT_PLACEMENT_KEYS)[number];

export const HIGHLIGHT_PLACEMENT_OPTIONS = [
  { value: "experience.projects", label: "Experience / Proof of Work" },
  { value: "experience.writing", label: "Experience / Writing" },
  { value: "experience.testimonials", label: "Experience / Testimonials" },
  { value: "shared.awards", label: "Shared / Awards (Home + Experience)" },
  { value: "home.awards", label: "Home / Awards" },
  { value: "experience.awards", label: "Experience / Awards" },
  { value: "shared.certificates", label: "Shared / Certificates (Home + Experience)" },
  { value: "home.certificates", label: "Home / Certificates" },
  { value: "experience.certificates", label: "Experience / Certificates" },
] as const;

export type HighlightType = "project" | "post" | "testimonial" | "award" | "certificate" | "custom";

const PLACEMENTS_BY_TYPE: Record<HighlightType, HighlightPlacementKey[]> = {
  project: ["experience.projects"],
  post: ["experience.writing"],
  testimonial: ["experience.testimonials"],
  award: ["shared.awards", "home.awards", "experience.awards"],
  certificate: ["shared.certificates", "home.certificates", "experience.certificates"],
  custom: ["shared.certificates", "home.certificates", "experience.certificates"],
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

  if (effectivePlacement === "shared.awards") {
    return requestedPlacement === "home.awards" || requestedPlacement === "experience.awards";
  }

  if (effectivePlacement === "shared.certificates") {
    return requestedPlacement === "home.certificates" || requestedPlacement === "experience.certificates";
  }

  return false;
}
