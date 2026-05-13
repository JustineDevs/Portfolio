import { and, asc, desc, eq, inArray } from "drizzle-orm";

import type { PublicPost, PublicProject } from "@/lib/content/types";
import { db } from "@/db/client";
import {
  normalizeAssetFieldsInObjectAsync,
  normalizeOptionalImageAssetUrl,
} from "@/lib/asset-urls";
import { canonicalizeAboutSectionKey, getAboutSectionSortOrder } from "@/lib/about-section-keys";
import {
  awards,
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
