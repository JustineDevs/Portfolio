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
  highlights: HighlightRow[],
) {
  const projectHighlights = highlights.filter(
    (highlight) =>
      highlight.highlightType === "project" &&
      placementMatches(highlight.placementKey, highlight.highlightType as HighlightType, "experience.projects"),
  );
  const seen = new Set<string>();
  const cards: ProofProjectCard[] = [];

  for (const highlight of projectHighlights) {
    const title = highlight.titleOverride?.trim();
    const href = highlight.linkOverride?.trim() || "#";
    const summary = highlight.summaryOverride?.trim() || "Project highlight";
    const typeLabel = "Highlight";
    if (!title) continue;

    const dedupeKey = `${title.toLowerCase()}|${href}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    cards.push({
      key: `highlight-project-${highlight.id ?? dedupeKey}`,
      typeLabel,
      title,
      summary,
      href,
      imageUrl: highlight.imageUrlOverride || null,
    });
  }

  for (const project of projects) {
    const href = `/projects/${project.slug}`;
    const dedupeKey = `${project.title.toLowerCase()}|${href}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    cards.push({
      key: project.slug,
      typeLabel: project.category || "Project",
      title: project.title,
      summary: project.summary,
      href,
      imageUrl: project.bannerImageUrl || project.coverImageUrl || null,
    });
  }

  return cards.slice(0, 4);
}

function buildWritingCards(
  posts: Awaited<ReturnType<typeof getLatestPosts>>,
  highlights: HighlightRow[],
) {
  const postHighlights = highlights.filter(
    (highlight) =>
      highlight.highlightType === "post" &&
      placementMatches(highlight.placementKey, highlight.highlightType as HighlightType, "experience.writing"),
  );
  const seen = new Set<string>();
  const cards: ProofWritingCard[] = [];

  for (const highlight of postHighlights) {
    const title = highlight.titleOverride?.trim();
    const href = highlight.linkOverride?.trim() || "#";
    if (!title) continue;

    const dedupeKey = `${title.toLowerCase()}|${href}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    cards.push({
      key: `highlight-post-${highlight.id ?? dedupeKey}`,
      label: "Highlight",
      title,
      summary: highlight.summaryOverride?.trim() || "Writing highlight",
      href,
      imageUrl: highlight.imageUrlOverride || null,
    });
  }

  for (const post of posts) {
    const href = post.postType === "external" && post.canonicalUrl ? post.canonicalUrl : `/blog/${post.slug}`;
    const dedupeKey = `${post.title.toLowerCase()}|${href}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

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
      highlight.highlightType === "testimonial" &&
      placementMatches(highlight.placementKey, highlight.highlightType as HighlightType, "experience.testimonials"),
  );
  const testimonialById = new Map(testimonials.map((testimonial) => [testimonial.id, testimonial]));
  const seen = new Set<string>();
  const cards: ProofTestimonialCard[] = [];

  for (const highlight of testimonialHighlights) {
    const target = highlight.targetId ? testimonialById.get(highlight.targetId) : null;
    const title = highlight.titleOverride?.trim() || target?.name || "Testimonial";
    const quote = highlight.summaryOverride?.trim() || target?.quote || "Testimonial highlight";
    const label = target?.role || "Highlight";
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

function buildAwardCards(awards: Awaited<ReturnType<typeof getFeaturedAwardCards>>) {
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

export async function getHomePageData() {
  const [projects, awards, certificates, legalLinks] = await Promise.all([
    getPublishedProjects(),
    getFeaturedAwardCards(2, "home.awards"),
    getFeaturedCertificateCards(3, "home.certificates"),
    getPublicLegalLinks(),
  ]);

  return {
    featuredProjects: projects.slice(0, 2),
    featuredAwards: awards.slice(0, 2),
    featuredCertificates: certificates,
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
      projects: buildProjectProofCards(projects, highlights),
      writing: buildWritingCards(posts, highlights),
      testimonials: buildTestimonialCards(testimonials, highlights),
      awards: buildAwardCards(awards),
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
