import { getPublicLegalLinks } from "@/lib/legal-links";
import {
  placementMatches,
  type HighlightType,
} from "@/lib/content/highlight-placement";
import {
  getFeaturedAwardCards,
  getFeaturedCertificateCards,
  getLatestPosts,
  getOtherPublishedProjects,
  getPublishedAwards,
  getPublishedHighlights,
  getPublishedPageSections,
  getPublishedPostBySlug,
  getPublishedPosts,
  getPublishedProjectBySlug,
  getPublishedProjects,
  getPublishedTestimonials,
} from "@/lib/content/public";
import type {
  PublicAwardCard,
  PublicCertificateCard,
  PublicProofOfWork,
  PublicProject,
} from "@/lib/content/types";
import {
  fallbackExperienceProgress,
  type ExperienceProgressEntry,
  type ExperienceProgressMeta,
} from "@/lib/content/experience-progress";
import { getPublishedAssetBySemanticKey, type PublicAsset } from "@/lib/content/assets";

export type AboutRecentPost = {
  slug: string;
  title: string;
  summary: string;
  postType: "native" | "external";
  canonicalUrl?: string | null;
};

export type AboutSidebarPanel = {
  id: string;
  title: string;
  description: string;
  philosophy: string;
  link: string;
  heading: string;
  intro: string;
  points: string[];
  summary: string;
  extended: string;
};

export type AboutPageData = {
  sections: Awaited<ReturnType<typeof getPublishedPageSections>>;
  byKey: Record<string, (Awaited<ReturnType<typeof getPublishedPageSections>>)[number]>;
  heroMeta: { imageUrl?: string };
  sidebarMeta: { panels?: AboutSidebarPanel[] };
  recentPosts: AboutRecentPost[];
  legalLinks: Awaited<ReturnType<typeof getPublicLegalLinks>>;
};

type ProofProjectCard = PublicProject;

type ProofWritingCard = {
  key: string;
  label: string;
  title: string;
  summary: string;
  href: string;
  imageUrl?: string | null;
};

type ProofTestimonialCard = {
  key: string;
  label: string;
  title?: string | null;
  quote: string;
  avatarUrl?: string | null;
  brandLogoUrl?: string | null;
};

export type ExperiencePageData = {
  legalLinks: Awaited<ReturnType<typeof getPublicLegalLinks>>;
  profile: {
    title: string;
    description: string;
    location: string;
    timezone: string;
  };
  progress: ExperienceProgressEntry[];
  assets: {
    hyperkit: PublicAsset | null;
    projectOnePercent: PublicAsset | null;
    jstn: PublicAsset | null;
    universalStudios: PublicAsset | null;
    justine: PublicAsset | null;
    rommel: PublicAsset | null;
    shun: PublicAsset | null;
    justineMini: PublicAsset | null;
    iconPattern: PublicAsset | null;
  };
  proofOfWork: {
    items: PublicProofOfWork[];
    projects: ProofProjectCard[];
    writing: ProofWritingCard[];
    testimonials: ProofTestimonialCard[];
    awards: PublicAwardCard[];
    certificates: PublicCertificateCard[];
  };
};

async function getExperienceProgress(sections: Awaited<ReturnType<typeof getPublishedPageSections>>) {
  const section = sections.find((item) => item.sectionKey === "progress");
  if (!section?.metaJson) return fallbackExperienceProgress;

  try {
    const parsed = JSON.parse(section.metaJson) as Partial<ExperienceProgressMeta>;
    if (!Array.isArray(parsed.entries) || parsed.entries.length === 0) return fallbackExperienceProgress;
    const entries = parsed.entries.filter((entry): entry is ExperienceProgressEntry => (
      typeof entry?.id === "string" &&
      typeof entry.year === "string" &&
      typeof entry.company === "string" &&
      typeof entry.status === "string" &&
      typeof entry.role === "string" &&
      typeof entry.description === "string" &&
      typeof entry.project === "string" &&
      typeof entry.projectDescription === "string" &&
      Array.isArray(entry.icons)
    ));
    const resolved = await Promise.all(entries.map(async (entry) => {
      if (!entry.logoKey) return entry;
      const asset = await getPublishedAssetBySemanticKey(entry.logoKey);
      return { ...entry, logoUrl: asset?.url || null };
    }));
    return resolved.length > 0 ? resolved : fallbackExperienceProgress;
  } catch {
    return fallbackExperienceProgress;
  }
}

type HighlightRow = Awaited<ReturnType<typeof getPublishedHighlights>>[number];

function buildProjectProofCards(
  projects: Awaited<ReturnType<typeof getPublishedProjects>>,
) {
  return projects.slice(0, 4) as ProofProjectCard[];
}

function buildWritingCards(
  posts: Awaited<ReturnType<typeof getLatestPosts>>,
) {
  const cards: ProofWritingCard[] = [];

  for (const post of posts) {
    const href = post.postType === "external" && post.canonicalUrl ? post.canonicalUrl : `/blog/${post.slug}`;
    cards.push({
      key: post.slug,
      label: post.postType === "native" ? "Article" : post.sourcePlatform || "External",
      title: post.title,
      summary: post.summary,
      href,
      imageUrl: post.coverImageUrl || null,
    });
  }

  return cards.slice(0, 3);
}

function isTestimonialHighlight(highlight: HighlightRow) {
  return highlight.highlightType === "testimonial" || (
    highlight.highlightType === "custom" &&
    highlight.placementKey === "experience.testimonials"
  );
}

function buildTestimonialCards(
  testimonials: Awaited<ReturnType<typeof getPublishedTestimonials>>,
  highlights: HighlightRow[],
  brandLogoUrl: string | null,
  testimonialAssets: Map<string, PublicAsset>,
) {
  const testimonialHighlights = highlights.filter(
    (highlight) =>
      isTestimonialHighlight(highlight) &&
      placementMatches(
        highlight.placementKey,
        highlight.highlightType as HighlightType,
        "experience.testimonials",
      ),
  );
  const testimonialById = new Map(testimonials.map((testimonial) => [testimonial.id, testimonial]));
  const seen = new Set<string>();
  const cards: ProofTestimonialCard[] = [];

  for (const highlight of testimonialHighlights) {
    const target = highlight.highlightType === "testimonial" && highlight.targetId
      ? testimonialById.get(highlight.targetId)
      : null;
    const title = highlight.titleOverride?.trim() || target?.name || "Manual testimonial";
    const quote = highlight.summaryOverride?.trim() || target?.quote || "Testimonial highlight";
    const label = target?.role || (highlight.highlightType === "custom" ? "Manual card" : "Highlight");
    const dedupeKey = `${title.toLowerCase()}|${quote.toLowerCase()}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    cards.push({
      key: `highlight-testimonial-${highlight.id ?? dedupeKey}`,
      label,
      title,
      quote,
      avatarUrl: (target?.avatarAssetKey ? testimonialAssets.get(target.avatarAssetKey)?.url : null) || target?.avatarUrl || null,
      brandLogoUrl,
    });
  }

  for (const testimonial of testimonials) {
    const dedupeKey = `${testimonial.name.toLowerCase()}|${testimonial.quote.toLowerCase()}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    cards.push({
      key: `${testimonial.name}-${testimonial.id ?? testimonial.name}`,
      label: testimonial.role || "Testimonial",
      title: testimonial.name,
      quote: testimonial.quote,
      avatarUrl: (testimonial.avatarAssetKey ? testimonialAssets.get(testimonial.avatarAssetKey)?.url : null) || testimonial.avatarUrl || null,
      brandLogoUrl,
    });
  }

  return cards.slice(0, 2);
}

function buildExperienceAwardCards(
  awards: PublicAwardCard[],
) {
  return awards.slice(0, 3);
}

function buildProofOfWorkCards(section: Awaited<ReturnType<typeof getPublishedPageSections>>[number] | undefined, fallbackLogoUrl: string | null): PublicProofOfWork[] {
  let title = "Discord Moderator: Community";
  let summary = "Web3 Community Moderator | Project One Percent · Moderated a 30,000+ member Web3 community, handled daily discussions, support requests, and conflict resolution across Discord channels.";
  let brandName = "Project One Percent";
  let href = "https://projectonepercent.io/";
  let startedAt = "2023";
  let brandLogoUrl = fallbackLogoUrl;
  if (section) {
    title = section.title || title;
    summary = section.bodyMd || summary;
    const [sectionBrand, sectionStarted, sectionHref] = (section.subtitle || "").split("|").map((value) => value.trim());
    try {
      const meta = section.metaJson ? JSON.parse(section.metaJson) as { brandName?: string; href?: string; startedAt?: string; assetKey?: string } : {};
      brandName = meta.brandName || sectionBrand || brandName;
      href = meta.href || sectionHref || href;
      startedAt = meta.startedAt || sectionStarted || startedAt;
      if (meta.assetKey === "brand.project-one-percent") brandLogoUrl = fallbackLogoUrl;
    } catch {
      brandName = sectionBrand || brandName;
      href = sectionHref || href;
      startedAt = sectionStarted || startedAt;
    }
  }
  return [
    {
      slug: "project-one-percent-discord-moderator",
      title,
      summary,
      href,
      brandName,
      brandLogoUrl,
      startedAt,
    },
  ];
}

export async function getAboutPageData(): Promise<AboutPageData> {
  const [sections, recentPosts, legalLinks] = await Promise.all([
    getPublishedPageSections("about"),
    getLatestPosts(3),
    getPublicLegalLinks(),
  ]);
  const byKey = Object.fromEntries(sections.map((section) => [section.sectionKey, section]));

  return {
    sections,
    byKey,
    heroMeta: byKey.hero?.metaJson ? (JSON.parse(byKey.hero.metaJson) as { imageUrl?: string }) : {},
    sidebarMeta: byKey.reading_map?.metaJson ? (JSON.parse(byKey.reading_map.metaJson) as { panels?: AboutSidebarPanel[] }) : {},
    recentPosts: recentPosts.map((post) => ({
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      postType: post.postType,
      canonicalUrl: post.canonicalUrl,
    })),
    legalLinks,
  };
}

export async function getProjectsPageData() {
  const [projects, legalLinks] = await Promise.all([
    getPublishedProjects(),
    getPublicLegalLinks(),
  ]);

  return { projects, legalLinks };
}

export async function getProjectDetailPageData(slug: string) {
  const [project, otherProjects, legalLinks] = await Promise.all([
    getPublishedProjectBySlug(slug),
    getOtherPublishedProjects(slug, 6),
    getPublicLegalLinks(),
  ]);

  return { project, otherProjects, legalLinks };
}

export async function getBlogIndexPageData() {
  const [posts, legalLinks] = await Promise.all([
    getPublishedPosts(),
    getPublicLegalLinks(),
  ]);

  return { posts, legalLinks };
}

export async function getBlogPostPageData(slug: string) {
  const [post, legalLinks] = await Promise.all([
    getPublishedPostBySlug(slug),
    getPublicLegalLinks(),
  ]);

  return { post, legalLinks };
}

export async function getExperiencePageData(): Promise<ExperiencePageData> {
  const [
    legalLinks,
    projects,
    posts,
    testimonials,
    awards,
    certificates,
    highlights,
    experienceSections,
    hyperkitAsset,
    projectOnePercentAsset,
    jstnAsset,
    universalStudiosAsset,
    justineAsset,
    rommelAsset,
    shunAsset,
    justineMiniAsset,
    iconPatternAsset,
  ] = await Promise.all([
    getPublicLegalLinks(),
    getPublishedProjects(),
    getLatestPosts(3),
    getPublishedTestimonials(),
    getFeaturedAwardCards(5, "experience.awards"),
    getFeaturedCertificateCards(3, "experience.certificates"),
    getPublishedHighlights(),
    getPublishedPageSections("experience"),
    getPublishedAssetBySemanticKey("brand.hyperkit"),
    getPublishedAssetBySemanticKey("brand.project-one-percent"),
    getPublishedAssetBySemanticKey("brand.jstn"),
    getPublishedAssetBySemanticKey("brand.universal-studios"),
    getPublishedAssetBySemanticKey("avatar.justine-lupasi"),
    getPublishedAssetBySemanticKey("avatar.rommel-celestino"),
    getPublishedAssetBySemanticKey("avatar.shun"),
    getPublishedAssetBySemanticKey("avatar.justine-mini"),
    getPublishedAssetBySemanticKey("decorative.icon-pattern"),
  ]);

  const profileSection = experienceSections.find((section) => section.sectionKey === "profile");
  let profile = {
    title: "Software Developer",
    description: "Building useful products with an engineering mindset, obsessing over the details and the why behind complex systems.",
    location: "Metro Manila, Philippines",
    timezone: "GMT 8+ PHT",
  };
  if (profileSection) {
    try {
      const meta = profileSection.metaJson ? JSON.parse(profileSection.metaJson) as Partial<typeof profile> : {};
      const [location, timezone] = (profileSection.subtitle || "").split("|").map((value) => value.trim());
      profile = {
        title: profileSection.title || profile.title,
        description: profileSection.bodyMd || profile.description,
        location: meta.location || location || profile.location,
        timezone: meta.timezone || timezone || profile.timezone,
      };
    } catch {
      // Keep the stable presentation fallback when an editor has malformed metadata.
    }
  }

  return {
    legalLinks,
    profile,
    progress: await getExperienceProgress(experienceSections),
    assets: {
      hyperkit: hyperkitAsset,
      projectOnePercent: projectOnePercentAsset,
      jstn: jstnAsset,
      universalStudios: universalStudiosAsset,
      justine: justineAsset,
      rommel: rommelAsset,
      shun: shunAsset,
      justineMini: justineMiniAsset,
      iconPattern: iconPatternAsset,
    },
    proofOfWork: {
      items: buildProofOfWorkCards(experienceSections.find((section) => section.sectionKey === "proof_of_work"), projectOnePercentAsset?.url || null),
      projects: buildProjectProofCards(projects),
      writing: buildWritingCards(posts),
      testimonials: buildTestimonialCards(
        testimonials,
        highlights,
        projectOnePercentAsset?.url || null,
        new Map<string, PublicAsset>([
          ...(rommelAsset ? [["avatar.rommel-celestino", rommelAsset] as [string, PublicAsset]] : []),
          ...(shunAsset ? [["avatar.shun", shunAsset] as [string, PublicAsset]] : []),
          ...(justineMiniAsset ? [["avatar.justine-mini", justineMiniAsset] as [string, PublicAsset]] : []),
        ]),
      ),
      awards: buildExperienceAwardCards(awards),
      certificates: certificates.slice(0, 3),
    },
  };
}
