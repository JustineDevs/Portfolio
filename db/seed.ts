import { eq } from "drizzle-orm";

import { db } from "./client";
import {
  awards,
  highlights,
  pageSections,
  posts,
  projectAwards,
  projectLinks,
  projectNetworks,
  projectResponsibilities,
  projectTags,
  projectTechnologies,
  projects as projectsTable,
  siteSettings,
  testimonials,
} from "./schema";
import {
  legacyAboutSections,
  legacyAwards,
  legacyHighlights,
  legacyPosts,
  legacyProjects,
  legacySiteSettings,
  legacyTestimonials,
} from "../lib/legacy-content";

function normalizeLegacyDate(value: string) {
  const usDate = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
  if (!usDate) return value;

  const [, month, day, year] = usDate;
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))).toISOString();
}

async function seedProjects() {
  for (let index = 0; index < legacyProjects.length; index += 1) {
    const project = legacyProjects[index];
    await db
      .insert(projectsTable)
      .values({
        slug: project.slug,
        title: project.title,
        summary: project.description,
        bodyMd: project.longDescription?.join("\n\n") ?? null,
        category: project.category,
        status: "published",
        publishedAt: normalizeLegacyDate(project.date),
        featured: index < 4,
        coverImageUrl: project.coverImage,
        bannerImageUrl: project.bannerImage ?? project.coverImage,
        authorName: project.author,
        authorUrl: project.authorWebsite,
        websiteUrl: project.websiteUrl ?? null,
        sortOrder: index,
      })
      .onConflictDoUpdate({
        target: projectsTable.slug,
        set: {
          title: project.title,
          summary: project.description,
          bodyMd: project.longDescription?.join("\n\n") ?? null,
          category: project.category,
          publishedAt: normalizeLegacyDate(project.date),
          featured: index < 4,
          coverImageUrl: project.coverImage,
          bannerImageUrl: project.bannerImage ?? project.coverImage,
          authorName: project.author,
          authorUrl: project.authorWebsite,
          websiteUrl: project.websiteUrl ?? null,
          sortOrder: index,
        },
      });

    const [projectRow] = await db
      .select({ id: projectsTable.id })
      .from(projectsTable)
      .where(eq(projectsTable.slug, project.slug))
      .limit(1);

    if (!projectRow) continue;

    await db.delete(projectTags).where(eq(projectTags.projectId, projectRow.id));
    await db.delete(projectTechnologies).where(eq(projectTechnologies.projectId, projectRow.id));
    await db
      .delete(projectResponsibilities)
      .where(eq(projectResponsibilities.projectId, projectRow.id));
    await db.delete(projectNetworks).where(eq(projectNetworks.projectId, projectRow.id));
    await db.delete(projectLinks).where(eq(projectLinks.projectId, projectRow.id));

    if (project.tags?.length) {
      await db.insert(projectTags).values(
        project.tags.map((tag, tagIndex) => ({
          projectId: projectRow.id,
          tag,
          sortOrder: tagIndex,
        }))
      );
    }

    if (project.technologies?.length) {
      await db.insert(projectTechnologies).values(
        project.technologies.map((technology, techIndex) => ({
          projectId: projectRow.id,
          technology,
          sortOrder: techIndex,
        }))
      );
    }

    if (project.responsibilities?.length) {
      await db.insert(projectResponsibilities).values(
        project.responsibilities.map((responsibility, responsibilityIndex) => ({
          projectId: projectRow.id,
          responsibility,
          sortOrder: responsibilityIndex,
        }))
      );
    }

    if (project.networks?.length) {
      await db.insert(projectNetworks).values(
        project.networks.map((network, networkIndex) => ({
          projectId: projectRow.id,
          network,
          sortOrder: networkIndex,
        }))
      );
    }

    const links = [
      project.websiteUrl ? { type: "website", label: "Website", url: project.websiteUrl } : null,
      project.socialLinks?.github
        ? { type: "github", label: "GitHub", url: project.socialLinks.github }
        : null,
      project.socialLinks?.twitter
        ? { type: "twitter", label: "Twitter", url: project.socialLinks.twitter }
        : null,
      project.socialLinks?.linkedin
        ? { type: "linkedin", label: "LinkedIn", url: project.socialLinks.linkedin }
        : null,
      project.socialLinks?.hackquest
        ? { type: "hackquest", label: "Hackquest", url: project.socialLinks.hackquest }
        : null,
      project.socialLinks?.website
        ? { type: "external", label: "External", url: project.socialLinks.website }
        : null,
    ].filter(Boolean) as { type: string; label: string; url: string }[];

    if (links.length) {
      await db.insert(projectLinks).values(
        links.map((link, linkIndex) => ({
          projectId: projectRow.id,
          type: link.type,
          label: link.label,
          url: link.url,
          sortOrder: linkIndex,
        }))
      );
    }
  }
}

async function seedAwards() {
  for (let index = 0; index < legacyAwards.length; index += 1) {
    const award = legacyAwards[index];
    await db
      .insert(awards)
      .values({
        slug: award.slug,
        title: award.title,
        eventName: award.eventName,
        description: award.description,
        awardType: award.awardType,
        year: award.year,
        proofUrl: award.proofUrl,
        logoUrl: award.logoUrl,
        status: "published",
        featured: award.featured,
        sortOrder: award.sortOrder ?? index,
      })
      .onConflictDoUpdate({
        target: awards.slug,
        set: {
          title: award.title,
          eventName: award.eventName,
          description: award.description,
          awardType: award.awardType,
          year: award.year,
          proofUrl: award.proofUrl,
          logoUrl: award.logoUrl,
          featured: award.featured,
          sortOrder: award.sortOrder ?? index,
        },
      });
    }
}

async function seedPosts() {
  for (let index = 0; index < legacyPosts.length; index += 1) {
    const post = legacyPosts[index];
    await db
      .insert(posts)
      .values({
        slug: post.slug,
        title: post.title,
        summary: post.summary,
        bodyMd: post.bodyMd,
        postType: post.postType,
        sourcePlatform: post.sourcePlatform,
        canonicalUrl: post.canonicalUrl,
        coverImageUrl: post.coverImageUrl,
        status: "published",
        publishedAt: new Date().toISOString(),
        featured: post.featured,
      })
      .onConflictDoUpdate({
        target: posts.slug,
        set: {
          title: post.title,
          summary: post.summary,
          bodyMd: post.bodyMd,
          postType: post.postType,
          sourcePlatform: post.sourcePlatform,
          canonicalUrl: post.canonicalUrl,
          coverImageUrl: post.coverImageUrl,
          featured: post.featured,
          updatedAt: new Date().toISOString(),
        },
      });
  }
}

async function seedTestimonials() {
  for (const testimonial of legacyTestimonials) {
    await db
      .insert(testimonials)
      .values({
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        quote: testimonial.quote,
        avatarUrl: testimonial.avatarUrl,
        status: "published",
        featured: testimonial.featured,
        sortOrder: testimonial.sortOrder,
      })
      .onConflictDoNothing();
  }
}

async function seedPageSections() {
  const sections = [
    {
      pageKey: "about",
      sectionKey: "hero",
      title: legacyAboutSections.hero.title,
      subtitle: legacyAboutSections.hero.subtitle,
      bodyMd: "",
      metaJson: JSON.stringify({ imageUrl: legacyAboutSections.hero.imageUrl }),
      sortOrder: 0,
    },
    {
      pageKey: "about",
      sectionKey: "sidebar_intro",
      title: legacyAboutSections.sidebarIntro.heading,
      subtitle: legacyAboutSections.sidebarIntro.subheading,
      bodyMd: legacyAboutSections.sidebarIntro.dateLabel,
      metaJson: JSON.stringify({ panels: legacyAboutSections.sidebarIntro.panels }),
      sortOrder: 1,
    },
    {
      pageKey: "about",
      sectionKey: "story",
      title: legacyAboutSections.story.title,
      subtitle: null,
      bodyMd: legacyAboutSections.story.body,
      metaJson: null,
      sortOrder: 2,
    },
    {
      pageKey: "about",
      sectionKey: "responsibilities",
      title: legacyAboutSections.responsibilities.title,
      subtitle: null,
      bodyMd: legacyAboutSections.responsibilities.body,
      metaJson: null,
      sortOrder: 3,
    },
    {
      pageKey: "about",
      sectionKey: "strengths",
      title: legacyAboutSections.strengths.title,
      subtitle: null,
      bodyMd: legacyAboutSections.strengths.body,
      metaJson: null,
      sortOrder: 4,
    },
    {
      pageKey: "about",
      sectionKey: "thinking",
      title: legacyAboutSections.thinking.title,
      subtitle: null,
      bodyMd: legacyAboutSections.thinking.body,
      metaJson: null,
      sortOrder: 5,
    },
    {
      pageKey: "about",
      sectionKey: "vision",
      title: legacyAboutSections.vision.title,
      subtitle: null,
      bodyMd: legacyAboutSections.vision.body,
      metaJson: null,
      sortOrder: 6,
    },
  ];

  for (const section of sections) {
    await db
      .insert(pageSections)
      .values({
        ...section,
        status: "published",
      })
      .onConflictDoUpdate({
        target: [pageSections.pageKey, pageSections.sectionKey],
        set: {
          title: section.title,
          subtitle: section.subtitle,
          bodyMd: section.bodyMd,
          metaJson: section.metaJson,
          sortOrder: section.sortOrder,
          updatedAt: new Date().toISOString(),
        },
      });
  }
}

async function seedHighlights() {
  for (const highlight of legacyHighlights) {
    await db.insert(highlights).values({
      highlightType: highlight.highlightType,
      titleOverride: highlight.titleOverride,
      summaryOverride: highlight.summaryOverride,
      imageUrlOverride: highlight.imageUrlOverride,
      linkOverride: highlight.linkOverride,
      pinned: highlight.pinned,
      status: "published",
      sortOrder: highlight.sortOrder,
    }).onConflictDoNothing();
  }
}

async function seedSiteSettings() {
  const entries = Object.entries(legacySiteSettings) as [string, unknown][];

  for (const [key, value] of entries) {
    await db
      .insert(siteSettings)
      .values({
        key,
        valueJson: JSON.stringify(value),
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          valueJson: JSON.stringify(value),
          updatedAt: new Date().toISOString(),
        },
      });
  }
}

export async function seedInitialContent() {
  await seedProjects();
  await seedAwards();
  await seedPosts();
  await seedTestimonials();
  await seedPageSections();
  await seedHighlights();
  await seedSiteSettings();
}
