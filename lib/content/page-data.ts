import { getPublicLegalLinks } from "@/lib/legal-links";
import { getCollectionIndex } from "@/lib/github/public-collection";
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

export type ProofProjectCard = {
  key: string;
  typeLabel: string;
  title: string;
  summary: string;
  href?: string | null;
  imageUrl?: string | null;
};

export type ProofWritingCard = {
  key: string;
  label: string;
  title: string;
  summary: string;
  href: string;
  imageUrl?: string | null;
};

export type ProofTestimonialCard = {
  key: string;
  label: string;
  title?: string | null;
  quote: string;
};

export type ProofAwardCard = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  href?: string | null;
  logoUrl?: string | null;
  sourceLabel: string;
};

export type ProofCertificateCard = Awaited<ReturnType<typeof getFeaturedCertificateCards>>[number];

export type ExperiencePageData = {
  legalLinks: Awaited<ReturnType<typeof getPublicLegalLinks>>;
  proofOfWork: {
    projects: ProofProjectCard[];
    writing: ProofWritingCard[];
    testimonials: ProofTestimonialCard[];
    awards: ProofAwardCard[];
    certificates: ProofCertificateCard[];
  };
};

type HighlightRow = Awaited<ReturnType<typeof getPublishedHighlights>>[number];

function buildProjectProofCards(
  projects: Awaited<ReturnType<typeof getPublishedProjects>>,
) {
  const cards: ProofProjectCard[] = [];

  for (const project of projects) {
    cards.push({
      key: project.slug,
      typeLabel: project.category || "Project",
      title: project.title,
      summary: project.summary,
      href: `/projects/${project.slug}`,
      imageUrl: project.bannerImageUrl || project.coverImageUrl || null,
    });
  }

  return cards.slice(0, 4);
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

function buildTestimonialCards(
  testimonials: Awaited<ReturnType<typeof getPublishedTestimonials>>,
  highlights: HighlightRow[],
) {
  const testimonialHighlights = highlights.filter(
    (highlight) =>
      (highlight.highlightType === "testimonial" || highlight.highlightType === "custom") &&
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

function toProofAwardCards(awards: Awaited<ReturnType<typeof getFeaturedAwardCards>>) {
  return awards.slice(0, 3).map<ProofAwardCard>((award) => ({
    slug: award.slug,
    title: award.title,
    summary: award.description,
    year: award.year,
    href: award.proofUrl,
    logoUrl: award.logoUrl,
    sourceLabel: award.eventName || award.year || "Award",
  }));
}

function buildExperienceAwardCards(
  awards: Awaited<ReturnType<typeof getFeaturedAwardCards>>,
  highlights: HighlightRow[],
) {
  const cards = toProofAwardCards(awards);
  const seen = new Set(cards.map((award) => `${award.title.toLowerCase()}|${award.href || ""}`));

  for (const highlight of highlights.filter(
    (row) =>
      row.highlightType === "custom" &&
      placementMatches(row.placementKey, row.highlightType as HighlightType, "experience.awards"),
  )) {
    const title = highlight.titleOverride?.trim();
    const href = highlight.linkOverride?.trim() || null;
    if (!title) continue;

    const dedupeKey = `${title.toLowerCase()}|${href || ""}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    cards.push({
      slug: `manual-award-${highlight.id ?? dedupeKey}`,
      title,
      summary: highlight.summaryOverride?.trim() || "Manual card",
      year: "",
      href,
      logoUrl: highlight.imageUrlOverride || null,
      sourceLabel: "Manual card",
    });
  }

  return cards.slice(0, 3);
}

export async function getHomePageData() {
  const [projects, awards, legalLinks] = await Promise.all([
    getPublishedProjects(),
    getPublishedAwards(),
    getPublicLegalLinks(),
  ]);

  return {
    featuredProjects: projects.slice(0, 2),
    featuredAwards: awards.slice(0, 2).map((award) => ({
      slug: award.slug,
      title: award.title,
      eventName: award.eventName,
      description: award.description,
      year: award.year,
      proofUrl: award.proofUrl,
      logoUrl: award.logoUrl,
    })),
    featuredCertificates: [],
    legalLinks,
  };
}

export async function getAboutPageData() {
  const [sections, legalLinks] = await Promise.all([
    getPublishedPageSections("about"),
    getPublicLegalLinks(),
  ]);
  const byKey = Object.fromEntries(sections.map((section) => [section.sectionKey, section]));

  return {
    sections,
    byKey,
    heroMeta: byKey.hero?.metaJson ? JSON.parse(byKey.hero.metaJson) : {},
    sidebarMeta: byKey.reading_map?.metaJson ? JSON.parse(byKey.reading_map.metaJson) : {},
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
    getOtherPublishedProjects(slug, 2),
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
      projects: buildProjectProofCards(projects),
      writing: buildWritingCards(posts),
      testimonials: buildTestimonialCards(testimonials, highlights),
      awards: buildExperienceAwardCards(awards, highlights),
      certificates,
    },
  };
}

export async function getCollectionPageData() {
  const [collectionIndex, legalLinks] = await Promise.all([
    getCollectionIndex(),
    getPublicLegalLinks(),
  ]);

  return { collectionIndex, legalLinks };
}
