import { and, asc, desc, eq, inArray } from "drizzle-orm";

import type { PublicPost, PublicProject } from "@/lib/content/types";
import { db } from "@/db/client";
import {
  normalizeAssetFieldsInObjectAsync,
  normalizeOptionalImageAssetUrl,
} from "@/lib/asset-urls";
import { canonicalizeAboutSectionKey, getAboutSectionSortOrder } from "@/lib/about-section-keys";
import {
  placementMatches,
  type HighlightPlacementKey,
  type HighlightType,
} from "@/lib/content/highlight-placement";
import {
  awards,
  certificates,
  githubActivitySnapshots,
  highlights,
  pageSections,
  posts,
  projectLinks,
  projectNetworks,
  projectResponsibilities,
  projectTags,
  projectTechnologies,
  projects,
  siteSettings,
  testimonials,
} from "@/db/schema";

export type { PublicPost, PublicProject } from "@/lib/content/types";

export type FeaturedAwardCard = {
  id?: number;
  slug: string;
  title: string;
  eventName: string;
  description: string;
  year: string;
  proofUrl?: string | null;
  logoUrl?: string | null;
};

export type FeaturedCertificateCard = {
  id?: number;
  slug: string;
  title: string;
  issuer?: string | null;
  description: string;
  proofUrl?: string | null;
  logoUrl?: string | null;
};

export async function getPublishedProjects() {
  try {
    const projectRows = await db
      .select()
      .from(projects)
      .where(eq(projects.status, "published"))
      .orderBy(desc(projects.featured), asc(projects.sortOrder), desc(projects.publishedAt));

    return hydrateProjects(projectRows);
  } catch {
    return [];
  }
}

export async function getPublishedProjectBySlug(slug: string) {
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(and(eq(projects.slug, slug), eq(projects.status, "published")))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    const hydrated = await hydrateProjects(rows);
    return hydrated[0] ?? null;
  } catch {
    return null;
  }
}

export async function getOtherPublishedProjects(currentSlug: string, limit = 2) {
  const all = await getPublishedProjects();
  return all.filter((project) => project.slug !== currentSlug).slice(0, limit);
}

export async function getFeaturedProjects(limit?: number) {
  const projects = await getPublishedProjects();
  const featured = projects.filter((project) => project.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export async function getPublishedPosts() {
  try {
    const postRows = await db
      .select()
      .from(posts)
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.featured), desc(posts.publishedAt), desc(posts.updatedAt));

    return Promise.all(
      postRows.map(async (post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        summary: post.summary,
        bodyMd: post.bodyMd,
        postType: post.postType,
        sourcePlatform: post.sourcePlatform,
        canonicalUrl: post.canonicalUrl,
        coverImageUrl: await normalizeOptionalImageAssetUrl(post.coverImageUrl),
        featured: post.featured,
        publishedAt: post.publishedAt,
      })),
    );
  } catch {
    return [];
  }
}

export async function getPublishedPostBySlug(slug: string) {
  try {
    const rows = await db
      .select()
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    const post = rows[0];
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      bodyMd: post.bodyMd,
      postType: post.postType,
      sourcePlatform: post.sourcePlatform,
      canonicalUrl: post.canonicalUrl,
      coverImageUrl: await normalizeOptionalImageAssetUrl(post.coverImageUrl),
      featured: post.featured,
      publishedAt: post.publishedAt,
    };
  } catch {
    return null;
  }
}

export async function getFeaturedPosts(limit?: number) {
  const posts = await getPublishedPosts();
  const featured = posts.filter((post) => post.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export async function getLatestPosts(limit?: number) {
  const posts = await getPublishedPosts();
  return typeof limit === "number" ? posts.slice(0, limit) : posts;
}

export async function getPublishedTestimonials() {
  try {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.status, "published"))
      .orderBy(desc(testimonials.featured), asc(testimonials.sortOrder), desc(testimonials.updatedAt));
  } catch {
    return [];
  }
}

export async function getFeaturedTestimonials(limit?: number) {
  const testimonials = await getPublishedTestimonials();
  const featured = testimonials.filter((testimonial) => testimonial.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export async function getPublishedAwards() {
  try {
    const rows = await db
      .select()
      .from(awards)
      .where(eq(awards.status, "published"))
      .orderBy(desc(awards.featured), asc(awards.sortOrder), desc(awards.updatedAt));

    return Promise.all(
      rows.map(async (award) => ({
        ...award,
        logoUrl: await normalizeOptionalImageAssetUrl(award.logoUrl),
      })),
    );
  } catch {
    return [];
  }
}

export async function getPublishedCertificates() {
  try {
    const rows = await db
      .select()
      .from(certificates)
      .where(eq(certificates.status, "published"))
      .orderBy(desc(certificates.featured), asc(certificates.sortOrder), desc(certificates.updatedAt));

    return Promise.all(
      rows.map(async (certificate) => ({
        ...certificate,
        logoUrl: await normalizeOptionalImageAssetUrl(certificate.logoUrl),
      })),
    );
  } catch {
    return [];
  }
}

export async function getFeaturedAwardCards(
  limit?: number,
  placementKey?: HighlightPlacementKey,
): Promise<FeaturedAwardCard[]> {
  const [awardRows, highlightRows] = await Promise.all([
    getPublishedAwards(),
    getPublishedHighlights(),
  ]);

  const featuredAwardRows = awardRows.filter((award) => award.featured);
  const awardById = new Map(awardRows.map((award) => [award.id, award]));
  const prioritizedAwardRows = [...featuredAwardRows, ...awardRows.filter((award) => !award.featured)];
  const cards: FeaturedAwardCard[] = [];
  const seen = new Set<string>();

  for (const highlight of highlightRows.filter(
    (row) =>
      row.highlightType === "award" &&
      (!placementKey || placementMatches(row.placementKey, row.highlightType as HighlightType, placementKey)),
  )) {
    const targetAward = highlight.targetId ? awardById.get(highlight.targetId) : null;
    if (!targetAward) continue;
    const title = highlight.titleOverride?.trim() || targetAward?.title || "Award";
    const proofUrl = highlight.linkOverride?.trim() || targetAward?.proofUrl || null;
    const dedupeKey = `${title.toLowerCase()}|${proofUrl || ""}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    cards.push({
      id: highlight.id,
      slug: targetAward?.slug || `highlight-award-${highlight.id ?? dedupeKey}`,
      title,
      eventName: targetAward?.eventName || "Featured Award",
      description: highlight.summaryOverride?.trim() || targetAward?.description || "Award highlight",
      year: targetAward?.year || "",
      proofUrl,
      logoUrl: highlight.imageUrlOverride?.trim() || targetAward?.logoUrl || null,
    });
  }

  for (const award of prioritizedAwardRows) {
    const dedupeKey = `${award.title.toLowerCase()}|${award.proofUrl || ""}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    cards.push({
      id: award.id,
      slug: award.slug,
      title: award.title,
      eventName: award.eventName,
      description: award.description,
      year: award.year,
      proofUrl: award.proofUrl,
      logoUrl: award.logoUrl,
    });
  }

  return typeof limit === "number" ? cards.slice(0, limit) : cards;
}

export async function getFeaturedCertificateCards(
  limit?: number,
  placementKey?: HighlightPlacementKey,
): Promise<FeaturedCertificateCard[]> {
  const [certificateRows, highlightRows] = await Promise.all([
    getPublishedCertificates(),
    getPublishedHighlights(),
  ]);

  const highlightedCertificates = highlightRows.filter(
    (row) =>
      row.highlightType === "certificate" &&
      (!placementKey || placementMatches(row.placementKey, row.highlightType as HighlightType, placementKey)),
  );
  const certificateById = new Map(certificateRows.map((certificate) => [certificate.id, certificate]));
  const cards: FeaturedCertificateCard[] = [];
  const seen = new Set<string>();

  for (const highlight of highlightedCertificates) {
    const targetCertificate = highlight.targetId ? certificateById.get(highlight.targetId) : null;
    const title = highlight.titleOverride?.trim() || targetCertificate?.title || "Certificate";
    const proofUrl = highlight.linkOverride?.trim() || targetCertificate?.proofUrl || null;
    const dedupeKey = `${title.toLowerCase()}|${proofUrl || ""}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    cards.push({
      id: highlight.id,
      slug: targetCertificate?.slug || `highlight-certificate-${highlight.id ?? dedupeKey}`,
      title,
      issuer: targetCertificate?.issuer || null,
      description: highlight.summaryOverride?.trim() || targetCertificate?.description || "Certificate highlight",
      proofUrl,
      logoUrl: highlight.imageUrlOverride?.trim() || targetCertificate?.logoUrl || null,
    });
  }

  for (const certificate of certificateRows) {
    const dedupeKey = `${certificate.title.toLowerCase()}|${certificate.proofUrl || ""}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    cards.push({
      id: certificate.id,
      slug: certificate.slug,
      title: certificate.title,
      issuer: certificate.issuer,
      description: certificate.description,
      proofUrl: certificate.proofUrl,
      logoUrl: certificate.logoUrl,
    });
  }

  for (const highlight of highlightRows.filter(
    (row) =>
      row.highlightType === "custom" &&
      row.pinned &&
      (!placementKey || placementMatches(row.placementKey, row.highlightType as HighlightType, placementKey)),
  )) {
    const title = highlight.titleOverride?.trim() || "Certificate";
    const proofUrl = highlight.linkOverride?.trim() || null;
    const dedupeKey = `${title.toLowerCase()}|${proofUrl || ""}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    cards.push({
      id: highlight.id,
      slug: `legacy-certificate-${highlight.id ?? highlight.sortOrder}`,
      title,
      issuer: null,
      description: highlight.summaryOverride?.trim() || "Legacy certificate highlight",
      proofUrl,
      logoUrl: highlight.imageUrlOverride?.trim() || null,
    });
  }

  return typeof limit === "number" ? cards.slice(0, limit) : cards;
}

export async function getPublishedPageSections(pageKey: string) {
  try {
    const rows = await db
      .select()
      .from(pageSections)
      .where(and(eq(pageSections.pageKey, pageKey), eq(pageSections.status, "published")))
      .orderBy(asc(pageSections.sortOrder), asc(pageSections.sectionKey));

    const normalizedRows = await Promise.all(rows.map(async (section) => {
      const normalized = {
        ...section,
        sectionKey:
          pageKey === "about" ? canonicalizeAboutSectionKey(section.sectionKey) : section.sectionKey,
        sortOrder:
          pageKey === "about"
            ? getAboutSectionSortOrder(section.sectionKey, section.sortOrder)
            : section.sortOrder,
      };
      if (!section.metaJson) return normalized;
      try {
        const parsed = JSON.parse(section.metaJson);
        return {
          ...normalized,
          metaJson: JSON.stringify(await normalizeAssetFieldsInObjectAsync(parsed)),
        };
      } catch {
        return normalized;
      }
    }));

    return pageKey === "about"
      ? normalizedRows.sort((a, b) => a.sortOrder - b.sortOrder)
      : normalizedRows;
  } catch {
    return [];
  }
}

export async function getPublishedHighlights() {
  try {
    const rows = await db
      .select()
      .from(highlights)
      .where(eq(highlights.status, "published"))
      .orderBy(desc(highlights.pinned), asc(highlights.sortOrder), desc(highlights.updatedAt));

    return Promise.all(
      rows.map(async (highlight) => ({
        ...highlight,
        imageUrlOverride: await normalizeOptionalImageAssetUrl(highlight.imageUrlOverride),
      })),
    );
  } catch {
    return [];
  }
}

export async function getLatestGithubActivitySnapshot(year: number) {
  try {
    const rows = await db
      .select()
      .from(githubActivitySnapshots)
      .where(eq(githubActivitySnapshots.year, year))
      .orderBy(desc(githubActivitySnapshots.fetchedAt))
      .limit(1);

    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function getSiteSetting<T>(key: string, fallback?: T): Promise<T | null> {
  try {
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);

    if (!rows[0]) {
      return fallback ?? null;
    }

    return JSON.parse(rows[0].valueJson) as T;
  } catch {
    return fallback ?? null;
  }
}

async function hydrateProjects(
  projectRows: {
    id: number;
    slug: string;
    title: string;
    summary: string;
    bodyMd: string | null;
    category: string;
    publishedAt: string | null;
    featured: boolean;
    coverImageUrl: string | null;
    bannerImageUrl: string | null;
    authorName: string;
    authorUrl: string | null;
    websiteUrl: string | null;
    sortOrder: number;
    status: "draft" | "published" | "archived";
    createdAt: string;
    updatedAt: string;
  }[]
) {
  const ids = projectRows.map((project) => project.id);

  if (ids.length === 0) return [];

  const [tagRows, technologyRows, responsibilityRows, networkRows, linkRows] =
    await Promise.all([
      db.select().from(projectTags).where(inArray(projectTags.projectId, ids)).orderBy(asc(projectTags.sortOrder)),
      db
        .select()
        .from(projectTechnologies)
        .where(inArray(projectTechnologies.projectId, ids))
        .orderBy(asc(projectTechnologies.sortOrder)),
      db
        .select()
        .from(projectResponsibilities)
        .where(inArray(projectResponsibilities.projectId, ids))
        .orderBy(asc(projectResponsibilities.sortOrder)),
      db
        .select()
        .from(projectNetworks)
        .where(inArray(projectNetworks.projectId, ids))
        .orderBy(asc(projectNetworks.sortOrder)),
      db
        .select()
        .from(projectLinks)
        .where(inArray(projectLinks.projectId, ids))
        .orderBy(asc(projectLinks.sortOrder)),
    ]);

  const projects = await Promise.all(
    projectRows.map(async (project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      bodyMd: project.bodyMd,
      category: project.category,
      publishedAt: project.publishedAt,
      featured: project.featured,
      coverImageUrl: await normalizeOptionalImageAssetUrl(project.coverImageUrl),
      bannerImageUrl: await normalizeOptionalImageAssetUrl(project.bannerImageUrl),
      authorName: project.authorName,
      authorUrl: project.authorUrl,
      websiteUrl: project.websiteUrl,
      sortOrder: project.sortOrder,
      tags: tagRows.filter((row) => row.projectId === project.id).map((row) => row.tag),
      technologies: technologyRows
        .filter((row) => row.projectId === project.id)
        .map((row) => row.technology),
      responsibilities: responsibilityRows
        .filter((row) => row.projectId === project.id)
        .map((row) => row.responsibility),
      networks: networkRows.filter((row) => row.projectId === project.id).map((row) => row.network),
      links: linkRows
        .filter((row) => row.projectId === project.id)
        .map((row) => ({ type: row.type, label: row.label, url: row.url })),
    })),
  );

  return projects satisfies PublicProject[];
}
