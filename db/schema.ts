import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const contentStatuses = ["draft", "published", "archived"] as const;
export const postTypes = ["native", "external"] as const;
export const highlightTypes = [
  "project",
  "post",
  "testimonial",
  "award",
  "custom",
] as const;
export const adminUserStatuses = ["active", "disabled"] as const;

const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
};

export const projects = sqliteTable(
  "projects",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    bodyMd: text("body_md"),
    category: text("category").notNull(),
    status: text("status", { enum: contentStatuses }).notNull().default("draft"),
    publishedAt: text("published_at"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    coverImageUrl: text("cover_image_url"),
    bannerImageUrl: text("banner_image_url"),
    authorName: text("author_name").notNull(),
    authorUrl: text("author_url"),
    websiteUrl: text("website_url"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => ({
    slugUnique: uniqueIndex("projects_slug_unique").on(table.slug),
    statusIdx: index("projects_status_idx").on(table.status),
    featuredIdx: index("projects_featured_idx").on(table.featured),
  })
);

export const projectTags = sqliteTable(
  "project_tags",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => ({
    projectIdx: index("project_tags_project_idx").on(table.projectId),
  })
);

export const projectTechnologies = sqliteTable(
  "project_technologies",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    technology: text("technology").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => ({
    projectIdx: index("project_technologies_project_idx").on(table.projectId),
  })
);

export const projectResponsibilities = sqliteTable(
  "project_responsibilities",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    responsibility: text("responsibility").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => ({
    projectIdx: index("project_responsibilities_project_idx").on(table.projectId),
  })
);

export const projectNetworks = sqliteTable(
  "project_networks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    network: text("network").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => ({
    projectIdx: index("project_networks_project_idx").on(table.projectId),
  })
);

export const projectLinks = sqliteTable(
  "project_links",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    label: text("label"),
    url: text("url").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => ({
    projectIdx: index("project_links_project_idx").on(table.projectId),
  })
);

export const awards = sqliteTable(
  "awards",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    eventName: text("event_name").notNull(),
    description: text("description").notNull(),
    awardType: text("award_type"),
    year: text("year").notNull(),
    proofUrl: text("proof_url"),
    logoUrl: text("logo_url"),
    status: text("status", { enum: contentStatuses }).notNull().default("draft"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => ({
    slugUnique: uniqueIndex("awards_slug_unique").on(table.slug),
    statusIdx: index("awards_status_idx").on(table.status),
  })
);

export const projectAwards = sqliteTable(
  "project_awards",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    awardId: integer("award_id")
      .notNull()
      .references(() => awards.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => ({
    projectIdx: index("project_awards_project_idx").on(table.projectId),
    awardIdx: index("project_awards_award_idx").on(table.awardId),
  })
);

export const posts = sqliteTable(
  "posts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    bodyMd: text("body_md"),
    postType: text("post_type", { enum: postTypes }).notNull().default("native"),
    sourcePlatform: text("source_platform"),
    canonicalUrl: text("canonical_url"),
    coverImageUrl: text("cover_image_url"),
    status: text("status", { enum: contentStatuses }).notNull().default("draft"),
    publishedAt: text("published_at"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    ...timestamps,
  },
  (table) => ({
    slugUnique: uniqueIndex("posts_slug_unique").on(table.slug),
    statusIdx: index("posts_status_idx").on(table.status),
    typeIdx: index("posts_type_idx").on(table.postType),
  })
);

export const testimonials = sqliteTable(
  "testimonials",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    role: text("role"),
    company: text("company"),
    quote: text("quote").notNull(),
    avatarUrl: text("avatar_url"),
    status: text("status", { enum: contentStatuses }).notNull().default("draft"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => ({
    statusIdx: index("testimonials_status_idx").on(table.status),
  })
);

export const pageSections = sqliteTable(
  "page_sections",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    pageKey: text("page_key").notNull(),
    sectionKey: text("section_key").notNull(),
    title: text("title"),
    subtitle: text("subtitle"),
    bodyMd: text("body_md"),
    metaJson: text("meta_json"),
    status: text("status", { enum: contentStatuses }).notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => ({
    pageSectionUnique: uniqueIndex("page_sections_page_section_unique").on(
      table.pageKey,
      table.sectionKey
    ),
    statusIdx: index("page_sections_status_idx").on(table.status),
  })
);

export const highlights = sqliteTable(
  "highlights",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    highlightType: text("highlight_type", { enum: highlightTypes })
      .notNull()
      .default("custom"),
    targetId: integer("target_id"),
    titleOverride: text("title_override"),
    summaryOverride: text("summary_override"),
    imageUrlOverride: text("image_url_override"),
    linkOverride: text("link_override"),
    pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
    status: text("status", { enum: contentStatuses }).notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => ({
    statusIdx: index("highlights_status_idx").on(table.status),
    pinnedIdx: index("highlights_pinned_idx").on(table.pinned),
  })
);

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  valueJson: text("value_json").notNull(),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const githubActivitySnapshots = sqliteTable(
  "github_activity_snapshots",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    year: integer("year").notNull(),
    payloadJson: text("payload_json").notNull(),
    sourceHash: text("source_hash"),
    fetchedAt: text("fetched_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    yearIdx: index("github_activity_snapshots_year_idx").on(table.year),
  })
);

export const adminUsers = sqliteTable(
  "admin_users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    emailHash: text("email_hash").notNull(),
    emailEncrypted: text("email_encrypted").notNull(),
    providerSubject: text("provider_subject"),
    role: text("role").notNull().default("admin"),
    status: text("status", { enum: adminUserStatuses })
      .notNull()
      .default("active"),
    lastLoginAt: text("last_login_at"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    emailHashUnique: uniqueIndex("admin_users_email_hash_unique").on(
      table.emailHash,
    ),
    providerSubjectUnique: uniqueIndex(
      "admin_users_provider_subject_unique",
    ).on(table.providerSubject),
    statusIdx: index("admin_users_status_idx").on(table.status),
  }),
);

/** Singleton row id=1: cumulative site page views (client sends one record per session). */
export const portfolioSiteStats = sqliteTable("portfolio_site_stats", {
  id: integer("id").primaryKey(),
  totalViews: integer("total_views").notNull().default(0),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/** One row per visitor who liked the portfolio (heart). */
export const portfolioHeartVisitors = sqliteTable(
  "portfolio_heart_visitors",
  {
    visitorId: text("visitor_id").primaryKey(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  }
);

export type ContentStatus = (typeof contentStatuses)[number];
export type PostType = (typeof postTypes)[number];
export type HighlightType = (typeof highlightTypes)[number];
export type AdminUserStatus = (typeof adminUserStatuses)[number];
