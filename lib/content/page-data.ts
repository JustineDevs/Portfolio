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
};

export type ExperiencePageData = {
  legalLinks: Awaited<ReturnType<typeof getPublicLegalLinks>>;
  proofOfWork: {
    items: PublicProofOfWork[];
    projects: ProofProjectCard[];
    writing: ProofWritingCard[];
    testimonials: ProofTestimonialCard[];
    awards: PublicAwardCard[];
    certificates: PublicCertificateCard[];
  };
};

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
  if (highlight.highlightType === "testimonial") return true;
  if (highlight.highlightType !== "custom") return false;

  const content = `${highlight.titleOverride || ""} ${highlight.summaryOverride || ""}`.toLowerCase();
  return !/(?:hackathon|hack2build|hyperhack|\b\d+(?:st|nd|rd|th)\s+place\b|\baward\b|event id:|\bcertificate\b)/i.test(
    content,
  );
}

function buildTestimonialCards(
  testimonials: Awaited<ReturnType<typeof getPublishedTestimonials>>,
  highlights: HighlightRow[],
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
    });
  }

  return cards.slice(0, 2);
}

function buildExperienceAwardCards(
  awards: PublicAwardCard[],
) {
  return awards.slice(0, 3);
}

function buildProofOfWorkCards(): PublicProofOfWork[] {
  return [
    {
      slug: "project-one-percent-discord-moderator",
      title: "Discord Moderator: Community",
      summary:
        "Web3 Community Moderator | Project One Percent · Moderated a 30,000+ member Web3 community, handled daily discussions, support requests, and conflict resolution across Discord channels.",
      href: "https://projectonepercent.io/",
      brandName: "Project One Percent",
      brandLogoUrl: "/Logo/one percent/one percent.jpg",
      startedAt: "July 2023",
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
  ] = await Promise.all([
    getPublicLegalLinks(),
    getPublishedProjects(),
    getLatestPosts(3),
    getPublishedTestimonials(),
    getFeaturedAwardCards(3, "experience.awards"),
    getFeaturedCertificateCards(3, "experience.certificates"),
    getPublishedHighlights(),
  ]);

  return {
    legalLinks,
    proofOfWork: {
      items: buildProofOfWorkCards(),
      projects: buildProjectProofCards(projects),
      writing: buildWritingCards(posts),
      testimonials: buildTestimonialCards(testimonials, highlights),
      awards: buildExperienceAwardCards(awards),
      certificates: certificates.slice(0, 3),
    },
  };
}
