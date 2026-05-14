import { asc, count, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db/client";
import { requireAdminSession } from "@/lib/auth";
import { ABOUT_SECTION_KEYS } from "@/lib/about-section-config";
import { canonicalizeAboutSectionKey, getAboutSectionSortOrder } from "@/lib/about-section-keys";
import type { SelectOption } from "@/components/admin/FormPrimitives";
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

export async function listProjectsForAdmin() {
  await requireAdminSession();
  return db.select().from(projects).orderBy(desc(projects.updatedAt), asc(projects.sortOrder));
}

export async function getProjectForAdmin(id: number) {
  await requireAdminSession();

  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  const project = rows[0];
  if (!project) return null;

  const [tags, technologies, responsibilities, networks, links] = await Promise.all([
    db.select().from(projectTags).where(eq(projectTags.projectId, id)).orderBy(asc(projectTags.sortOrder)),
    db
      .select()
      .from(projectTechnologies)
      .where(eq(projectTechnologies.projectId, id))
      .orderBy(asc(projectTechnologies.sortOrder)),
    db
      .select()
      .from(projectResponsibilities)
      .where(eq(projectResponsibilities.projectId, id))
      .orderBy(asc(projectResponsibilities.sortOrder)),
    db
      .select()
      .from(projectNetworks)
      .where(eq(projectNetworks.projectId, id))
      .orderBy(asc(projectNetworks.sortOrder)),
    db.select().from(projectLinks).where(eq(projectLinks.projectId, id)).orderBy(asc(projectLinks.sortOrder)),
  ]);

  return {
    ...project,
    tags: tags.map((row) => row.tag),
    technologies: technologies.map((row) => row.technology),
    responsibilities: responsibilities.map((row) => row.responsibility),
    networks: networks.map((row) => row.network),
    links: links.map((row) => ({
      type: row.type,
      label: row.label ?? "",
      url: row.url,
    })),
  };
}

export async function listPostsForAdmin() {
  await requireAdminSession();
  return db.select().from(posts).orderBy(desc(posts.updatedAt), desc(posts.publishedAt));
}

export async function getPostForAdmin(id: number) {
  await requireAdminSession();
  const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function listTestimonialsForAdmin() {
  await requireAdminSession();
  return db.select().from(testimonials).orderBy(desc(testimonials.updatedAt));
}

export async function listAwardsForAdmin() {
  await requireAdminSession();
  return db.select().from(awards).orderBy(desc(awards.updatedAt), asc(awards.sortOrder));
}

export async function listCertificatesForAdmin() {
  await requireAdminSession();
  return db.select().from(certificates).orderBy(desc(certificates.updatedAt), asc(certificates.sortOrder));
}

export async function listHighlightsForAdmin() {
  await requireAdminSession();
  return db
    .select()
    .from(highlights)
    .orderBy(asc(highlights.placementKey), desc(highlights.pinned), asc(highlights.sortOrder));
}

export async function listHighlightTargetOptionsForAdmin(): Promise<{
  project: SelectOption[];
  post: SelectOption[];
  testimonial: SelectOption[];
  award: SelectOption[];
  certificate: SelectOption[];
}> {
  await requireAdminSession();

  const [projectRows, postRows, testimonialRows, awardRows, certificateRows] = await Promise.all([
    db
      .select({ id: projects.id, title: projects.title, slug: projects.slug })
      .from(projects)
      .where(eq(projects.status, "published"))
      .orderBy(asc(projects.sortOrder), asc(projects.title)),
    db
      .select({ id: posts.id, title: posts.title, slug: posts.slug })
      .from(posts)
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.publishedAt), asc(posts.title)),
    db
      .select({ id: testimonials.id, name: testimonials.name, role: testimonials.role })
      .from(testimonials)
      .where(eq(testimonials.status, "published"))
      .orderBy(desc(testimonials.featured), asc(testimonials.sortOrder), asc(testimonials.name)),
    db
      .select({ id: awards.id, title: awards.title, year: awards.year })
      .from(awards)
      .where(eq(awards.status, "published"))
      .orderBy(desc(awards.featured), asc(awards.sortOrder), asc(awards.title)),
    db
      .select({ id: certificates.id, title: certificates.title, issuer: certificates.issuer })
      .from(certificates)
      .where(eq(certificates.status, "published"))
      .orderBy(desc(certificates.featured), asc(certificates.sortOrder), asc(certificates.title)),
  ]);

  return {
    project: projectRows.map((row) => ({ value: String(row.id), label: `${row.title} (${row.slug})` })),
    post: postRows.map((row) => ({ value: String(row.id), label: `${row.title} (${row.slug})` })),
    testimonial: testimonialRows.map((row) => ({
      value: String(row.id),
      label: row.role ? `${row.name} (${row.role})` : row.name,
    })),
    award: awardRows.map((row) => ({ value: String(row.id), label: `${row.title} (${row.year})` })),
    certificate: certificateRows.map((row) => ({
      value: String(row.id),
      label: row.issuer ? `${row.title} (${row.issuer})` : row.title,
    })),
  };
}

export async function getHighlightForAdmin(id: number) {
  await requireAdminSession();
  const rows = await db.select().from(highlights).where(eq(highlights.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getCertificateForAdmin(id: number) {
  await requireAdminSession();
  const rows = await db.select().from(certificates).where(eq(certificates.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function listPageSectionsForAdmin(pageKey?: string) {
  await requireAdminSession();

  if (!pageKey) {
    const rows = await db.select().from(pageSections).orderBy(asc(pageSections.pageKey), asc(pageSections.sortOrder));
    return rows.map((section) =>
      section.pageKey === "about"
        ? {
            ...section,
            sectionKey: canonicalizeAboutSectionKey(section.sectionKey),
            sortOrder: getAboutSectionSortOrder(section.sectionKey, section.sortOrder),
          }
        : section,
    );
  }

  const rows = await db
    .select()
    .from(pageSections)
    .where(eq(pageSections.pageKey, pageKey))
    .orderBy(asc(pageSections.sortOrder));

  if (pageKey !== "about") {
    return rows;
  }

  return rows
    .map((section) => ({
      ...section,
      sectionKey: canonicalizeAboutSectionKey(section.sectionKey),
      sortOrder: getAboutSectionSortOrder(section.sectionKey, section.sortOrder),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getPageSectionForAdmin(id: number) {
  await requireAdminSession();
  const rows = await db.select().from(pageSections).where(eq(pageSections.id, id)).limit(1);
  const section = rows[0] ?? null;
  if (!section) return null;
  if (section.pageKey !== "about") return section;

  return {
    ...section,
    sectionKey: canonicalizeAboutSectionKey(section.sectionKey),
    sortOrder: getAboutSectionSortOrder(section.sectionKey, section.sortOrder),
  };
}

export async function listAvailableAboutSectionKeysForAdmin() {
  await requireAdminSession();

  const rows = await db
    .select({ sectionKey: pageSections.sectionKey })
    .from(pageSections)
    .where(eq(pageSections.pageKey, "about"));

  const usedKeys = new Set(rows.map((row) => canonicalizeAboutSectionKey(row.sectionKey)));
  return ABOUT_SECTION_KEYS.filter((sectionKey) => !usedKeys.has(sectionKey));
}

export async function listSiteSettingsForAdmin() {
  await requireAdminSession();
  return db.select().from(siteSettings).orderBy(asc(siteSettings.key));
}

export async function listGithubActivitySnapshotsForAdmin() {
  await requireAdminSession();
  return db
    .select()
    .from(githubActivitySnapshots)
    .orderBy(desc(githubActivitySnapshots.fetchedAt))
    .limit(20);
}

export type AdminDashboardCounts = {
  projects: number;
  posts: number;
  highlights: number;
  certificates: number;
  aboutSections: number;
  activitySnapshots: number;
  siteSettings: number;
};

export async function getAdminDashboardCounts(): Promise<AdminDashboardCounts> {
  await requireAdminSession();

  const [[proj], [pst], [hi], [cert], [abt], [snap], [set]] = await Promise.all([
    db.select({ n: count() }).from(projects),
    db.select({ n: count() }).from(posts),
    db.select({ n: count() }).from(highlights),
    db.select({ n: count() }).from(certificates),
    db.select({ n: count() }).from(pageSections).where(eq(pageSections.pageKey, "about")),
    db.select({ n: count() }).from(githubActivitySnapshots),
    db.select({ n: count() }).from(siteSettings),
  ]);

  return {
    projects: Number(proj?.n ?? 0),
    posts: Number(pst?.n ?? 0),
    highlights: Number(hi?.n ?? 0),
    certificates: Number(cert?.n ?? 0),
    aboutSections: Number(abt?.n ?? 0),
    activitySnapshots: Number(snap?.n ?? 0),
    siteSettings: Number(set?.n ?? 0),
  };
}
