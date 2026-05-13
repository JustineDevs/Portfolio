import { asc, count, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db/client";
import { requireAdminSession } from "@/lib/auth";
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

export async function listHighlightsForAdmin() {
  await requireAdminSession();
  return db.select().from(highlights).orderBy(desc(highlights.pinned), asc(highlights.sortOrder));
}

export async function getHighlightForAdmin(id: number) {
  await requireAdminSession();
  const rows = await db.select().from(highlights).where(eq(highlights.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function listPageSectionsForAdmin(pageKey?: string) {
  await requireAdminSession();

  if (!pageKey) {
    return db.select().from(pageSections).orderBy(asc(pageSections.pageKey), asc(pageSections.sortOrder));
  }

  return db
    .select()
    .from(pageSections)
    .where(eq(pageSections.pageKey, pageKey))
    .orderBy(asc(pageSections.sortOrder));
}

export async function getPageSectionForAdmin(id: number) {
  await requireAdminSession();
  const rows = await db.select().from(pageSections).where(eq(pageSections.id, id)).limit(1);
  return rows[0] ?? null;
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
  aboutSections: number;
  activitySnapshots: number;
  siteSettings: number;
};

export async function getAdminDashboardCounts(): Promise<AdminDashboardCounts> {
  await requireAdminSession();

  const [[proj], [pst], [hi], [abt], [snap], [set]] = await Promise.all([
    db.select({ n: count() }).from(projects),
    db.select({ n: count() }).from(posts),
    db.select({ n: count() }).from(highlights),
    db.select({ n: count() }).from(pageSections).where(eq(pageSections.pageKey, "about")),
    db.select({ n: count() }).from(githubActivitySnapshots),
    db.select({ n: count() }).from(siteSettings),
  ]);

  return {
    projects: Number(proj?.n ?? 0),
    posts: Number(pst?.n ?? 0),
    highlights: Number(hi?.n ?? 0),
    aboutSections: Number(abt?.n ?? 0),
    activitySnapshots: Number(snap?.n ?? 0),
    siteSettings: Number(set?.n ?? 0),
  };
}
