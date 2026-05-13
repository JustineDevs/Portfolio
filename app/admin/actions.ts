"use server";

import { redirect } from "next/navigation";

import { db } from "@/db/client";
import { requireAdminSession, signOut } from "@/lib/auth";
import {
  revalidateAbout,
  revalidateExperience,
  revalidateHome,
  revalidatePosts,
  revalidateProjects,
} from "@/lib/content/revalidate";
import {
  awards,
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
import { and, eq, ne } from "drizzle-orm";
import { fetchGithubActivityForYear, saveGithubActivitySnapshot } from "@/lib/github/activity";
import { normalizeAssetFieldsInObjectAsync, normalizeOptionalImageAssetUrl } from "@/lib/asset-urls";
import { canonicalizeAboutSectionKey, getAboutSectionSortOrder } from "@/lib/about-section-keys";

function stringValue(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? "";
}

function optionalString(formData: FormData, key: string) {
  const value = stringValue(formData, key);
  return value.length > 0 ? value : null;
}

function parseBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function parseLines(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseLinks(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [type, label, url] = line.split("|").map((item) => item.trim());
      return {
        type: type || "external",
        label: label || type || "External",
        url: url || label || "",
      };
    })
    .filter((link) => link.url);
}

function redirectWithError(returnTo: string, message: string) {
  const separator = returnTo.includes("?") ? "&" : "?";
  redirect(`${returnTo}${separator}error=${encodeURIComponent(message)}`);
}

function normalizeReturnTo(candidate: string, fallback: string) {
  if (!candidate.startsWith("/admin")) {
    return fallback
  }

  return candidate
}

function validateProjectPayload(payload: {
  slug: string;
  title: string;
  summary: string;
  category: string;
  authorName: string;
  status: "draft" | "published" | "archived";
}) {
  if (!payload.slug) return "Slug is required."
  if (!/^[a-z0-9-]+$/.test(payload.slug)) return "Slug must use lowercase letters, numbers, and hyphens only."
  if (!payload.title) return "Title is required."
  if (!payload.summary) return "Summary is required."
  if (!payload.category) return "Category is required."
  if (!payload.authorName) return "Author name is required."
  if (!payload.status) return "Status is required."
  return null
}

function validatePostPayload(payload: {
  slug: string;
  title: string;
  summary: string;
  postType: "native" | "external";
  bodyMd: string | null;
  canonicalUrl: string | null;
}) {
  if (!payload.slug) return "Slug is required."
  if (!/^[a-z0-9-]+$/.test(payload.slug)) return "Slug must use lowercase letters, numbers, and hyphens only."
  if (!payload.title) return "Title is required."
  if (!payload.summary) return "Summary is required."
  if (payload.postType === "native" && !payload.bodyMd) {
    return "Native posts require body content."
  }
  if (payload.postType === "external" && !payload.canonicalUrl) {
    return "External posts require a canonical URL."
  }
  return null
}

function parseStatus(value: string, returnTo: string) {
  const allowed = new Set(["draft", "published", "archived"])
  if (!allowed.has(value)) {
    redirectWithError(returnTo, "Status must be draft, published, or archived.")
  }
  return value as "draft" | "published" | "archived"
}

function parsePostType(value: string, returnTo: string) {
  const allowed = new Set(["native", "external"])
  if (!allowed.has(value)) {
    redirectWithError(returnTo, "Post type must be native or external.")
  }
  return value as "native" | "external"
}

function parseHighlightType(value: string, returnTo: string) {
  const allowed = new Set(["project", "post", "testimonial", "award", "custom"])
  if (!allowed.has(value)) {
    redirectWithError(returnTo, "Highlight type is invalid.")
  }
  return value as "project" | "post" | "testimonial" | "award" | "custom"
}

function normalizePublishedAt(value: string | null, returnTo: string) {
  if (!value) return null

  const isoLike = /^\d{4}-\d{2}-\d{2}(?:[T ][\d:.+-Z]+)?$/.test(value)
  const usDate = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value)

  if (isoLike) {
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      redirectWithError(returnTo, "Published At must be a valid ISO date/time.")
    }
    const isoDatePart = value.slice(0, 10)
    const [year, month, day] = isoDatePart.split("-").map((part) => Number(part))
    if (
      parsed.getUTCFullYear() !== year ||
      parsed.getUTCMonth() !== month - 1 ||
      parsed.getUTCDate() !== day
    ) {
      redirectWithError(returnTo, "Published At must be a real calendar date.")
    }
    return parsed.toISOString()
  }

  if (usDate) {
    const [, month, day, year] = usDate
    const numericMonth = Number(month)
    const numericDay = Number(day)
    const numericYear = Number(year)
    const parsed = new Date(Date.UTC(numericYear, numericMonth - 1, numericDay))
    if (Number.isNaN(parsed.getTime())) {
      redirectWithError(returnTo, "Published At must be a valid date.")
    }
    if (
      parsed.getUTCFullYear() !== numericYear ||
      parsed.getUTCMonth() !== numericMonth - 1 ||
      parsed.getUTCDate() !== numericDay
    ) {
      redirectWithError(returnTo, "Published At must be a real calendar date.")
    }
    return parsed.toISOString()
  }

  redirectWithError(returnTo, "Published At must be ISO format or MM/DD/YYYY.")
}

function isAbsoluteHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function isSafeCmsUrl(value: string) {
  return (value.startsWith("/") && !value.startsWith("//")) || isAbsoluteHttpUrl(value)
}

function validateOptionalUrl(value: string | null, returnTo: string, label: string, allowRelative = true) {
  if (!value) return value
  const isValid = allowRelative ? isSafeCmsUrl(value) : isAbsoluteHttpUrl(value)
  if (!isValid) {
    redirectWithError(returnTo, `${label} must be a valid ${allowRelative ? "http(s) or root-relative" : "http(s)"} URL.`)
  }
  return value
}

async function validateOptionalImageUrl(value: string | null, returnTo: string, label: string) {
  return normalizeOptionalImageAssetUrl(validateOptionalUrl(value, returnTo, label))
}

export async function signOutAdminAction() {
  await signOut({ redirectTo: "/admin/login" });
}

export async function saveProjectAction(formData: FormData) {
  await requireAdminSession();

  const id = Number.parseInt(stringValue(formData, "id"), 10);
  const fallbackReturnTo = id ? `/admin/projects/${id}` : "/admin/projects/new";
  const returnTo = normalizeReturnTo(stringValue(formData, "returnTo") || fallbackReturnTo, fallbackReturnTo);
  const slug = stringValue(formData, "slug");
  const coverImageUrl = await validateOptionalImageUrl(optionalString(formData, "coverImageUrl"), returnTo, "Cover Image URL");
  const bannerImageUrl = await validateOptionalImageUrl(optionalString(formData, "bannerImageUrl"), returnTo, "Banner Image URL");
  const payload = {
    slug,
    title: stringValue(formData, "title"),
    summary: stringValue(formData, "summary"),
    bodyMd: optionalString(formData, "bodyMd"),
    category: stringValue(formData, "category"),
    status: parseStatus(stringValue(formData, "status") || "draft", returnTo),
    publishedAt: normalizePublishedAt(optionalString(formData, "publishedAt"), returnTo),
    featured: parseBoolean(formData, "featured"),
    coverImageUrl,
    bannerImageUrl,
    authorName: stringValue(formData, "authorName"),
    authorUrl: validateOptionalUrl(optionalString(formData, "authorUrl"), returnTo, "Author URL"),
    websiteUrl: validateOptionalUrl(optionalString(formData, "websiteUrl"), returnTo, "Website URL"),
    sortOrder: Number.parseInt(stringValue(formData, "sortOrder") || "0", 10) || 0,
    updatedAt: new Date().toISOString(),
  };

  const projectError = validateProjectPayload(payload);
  if (projectError) {
    redirectWithError(returnTo, projectError);
  }

  const existingProject = await db
    .select({ id: projects.id })
    .from(projects)
    .where(id ? and(eq(projects.slug, slug), ne(projects.id, id)) : eq(projects.slug, slug))
    .limit(1);

  if (existingProject[0]) {
    redirectWithError(returnTo, "Project slug must be unique.");
  }

  if (payload.status === "published" && !payload.publishedAt) {
    payload.publishedAt = new Date().toISOString();
  }

  let projectId = id;

  if (projectId) {
    await db.update(projects).set(payload).where(eq(projects.id, projectId));
  } else {
    const result = await db.insert(projects).values(payload).returning({ id: projects.id });
    projectId = result[0]?.id ?? 0;
  }

  if (!projectId) {
    redirect("/admin/projects");
  }

  await db.delete(projectTags).where(eq(projectTags.projectId, projectId));
  await db.delete(projectTechnologies).where(eq(projectTechnologies.projectId, projectId));
  await db.delete(projectResponsibilities).where(eq(projectResponsibilities.projectId, projectId));
  await db.delete(projectNetworks).where(eq(projectNetworks.projectId, projectId));
  await db.delete(projectLinks).where(eq(projectLinks.projectId, projectId));

  const tags = parseLines(stringValue(formData, "tags"));
  const technologies = parseLines(stringValue(formData, "technologies"));
  const responsibilities = parseLines(stringValue(formData, "responsibilities"));
  const networks = parseLines(stringValue(formData, "networks"));
  const links = parseLinks(stringValue(formData, "links"));

  for (const link of links) {
    validateOptionalUrl(link.url, returnTo, `Link (${link.type})`)
  }

  if (tags.length) {
    await db.insert(projectTags).values(tags.map((tag, index) => ({ projectId, tag, sortOrder: index })));
  }
  if (technologies.length) {
    await db
      .insert(projectTechnologies)
      .values(technologies.map((technology, index) => ({ projectId, technology, sortOrder: index })));
  }
  if (responsibilities.length) {
    await db
      .insert(projectResponsibilities)
      .values(responsibilities.map((responsibility, index) => ({ projectId, responsibility, sortOrder: index })));
  }
  if (networks.length) {
    await db.insert(projectNetworks).values(networks.map((network, index) => ({ projectId, network, sortOrder: index })));
  }
  if (links.length) {
    await db.insert(projectLinks).values(
      links.map((link, index) => ({
        projectId,
        type: link.type,
        label: link.label,
        url: link.url,
        sortOrder: index,
      }))
    );
  }

  revalidateProjects(slug);
  revalidateHome();
  redirect(`/admin/projects/${projectId}`);
}

export async function savePostAction(formData: FormData) {
  await requireAdminSession();

  const id = Number.parseInt(stringValue(formData, "id"), 10);
  const fallbackReturnTo = id ? `/admin/writing/${id}` : "/admin/writing/new";
  const returnTo = normalizeReturnTo(stringValue(formData, "returnTo") || fallbackReturnTo, fallbackReturnTo);
  const slug = stringValue(formData, "slug");
  const coverImageUrl = await validateOptionalImageUrl(optionalString(formData, "coverImageUrl"), returnTo, "Cover Image URL");
  const payload = {
    slug,
    title: stringValue(formData, "title"),
    summary: stringValue(formData, "summary"),
    bodyMd: optionalString(formData, "bodyMd"),
    postType: parsePostType(stringValue(formData, "postType") || "native", returnTo),
    sourcePlatform: optionalString(formData, "sourcePlatform"),
    canonicalUrl: validateOptionalUrl(optionalString(formData, "canonicalUrl"), returnTo, "Canonical URL", false),
    coverImageUrl,
    status: parseStatus(stringValue(formData, "status") || "draft", returnTo),
    publishedAt: normalizePublishedAt(optionalString(formData, "publishedAt"), returnTo),
    featured: parseBoolean(formData, "featured"),
    updatedAt: new Date().toISOString(),
  };

  const postError = validatePostPayload(payload);
  if (postError) {
    redirectWithError(returnTo, postError);
  }

  const existingPost = await db
    .select({ id: posts.id })
    .from(posts)
    .where(id ? and(eq(posts.slug, slug), ne(posts.id, id)) : eq(posts.slug, slug))
    .limit(1);

  if (existingPost[0]) {
    redirectWithError(returnTo, "Post slug must be unique.");
  }

  if (payload.status === "published" && !payload.publishedAt) {
    payload.publishedAt = new Date().toISOString();
  }

  let postId = id;
  if (postId) {
    await db.update(posts).set(payload).where(eq(posts.id, postId));
  } else {
    const result = await db.insert(posts).values(payload).returning({ id: posts.id });
    postId = result[0]?.id ?? 0;
  }

  revalidatePosts(slug);
  revalidateHome();
  revalidateExperience();
  redirect(`/admin/writing/${postId}`);
}

export async function savePageSectionAction(formData: FormData) {
  await requireAdminSession();
  const id = Number.parseInt(stringValue(formData, "id"), 10);
  const returnTo = normalizeReturnTo(stringValue(formData, "returnTo") || "/admin/about", "/admin/about");
  let metaJson = optionalString(formData, "metaJson");
  if (metaJson) {
    try {
      const parsed = JSON.parse(metaJson);
      metaJson = JSON.stringify(await normalizeAssetFieldsInObjectAsync(parsed));
    } catch {
      redirectWithError(returnTo, "Meta JSON must be valid JSON.");
    }
  }
  const pageKey = stringValue(formData, "pageKey");
  const rawSectionKey = stringValue(formData, "sectionKey");
  const sectionKey = pageKey === "about" ? canonicalizeAboutSectionKey(rawSectionKey) : rawSectionKey;
  const sortOrder = Number.parseInt(stringValue(formData, "sortOrder") || "0", 10) || 0
  const payload = {
    pageKey,
    sectionKey,
    title: optionalString(formData, "title"),
    subtitle: optionalString(formData, "subtitle"),
    bodyMd: optionalString(formData, "bodyMd"),
    metaJson,
    status: parseStatus(stringValue(formData, "status") || "draft", returnTo),
    sortOrder:
      pageKey === "about"
        ? getAboutSectionSortOrder(sectionKey, sortOrder)
        : sortOrder,
    updatedAt: new Date().toISOString(),
  };

  const existingSection = await db
    .select({ id: pageSections.id })
    .from(pageSections)
    .where(and(eq(pageSections.pageKey, payload.pageKey), eq(pageSections.sectionKey, payload.sectionKey)))
    .limit(1);

  if (existingSection[0] && existingSection[0].id !== id) {
    redirectWithError(returnTo, "That About section slot already exists.");
  }

  if (id) {
    await db.update(pageSections).set(payload).where(eq(pageSections.id, id));
  } else {
    const created = await db.insert(pageSections).values(payload).returning({ id: pageSections.id });

    if (payload.pageKey === "about") {
      revalidateAbout();
    }
    revalidateHome();
    redirect(`/admin/about/${created[0]?.id ?? ""}`);
  }

  if (payload.pageKey === "about") {
    revalidateAbout();
  }
  revalidateHome();
  redirect(returnTo);
}

export async function saveHighlightAction(formData: FormData) {
  await requireAdminSession();
  const id = Number.parseInt(stringValue(formData, "id"), 10);
  const imageUrlOverride = await validateOptionalImageUrl(optionalString(formData, "imageUrlOverride"), "/admin/highlights", "Image Override");
  const highlightType = parseHighlightType(stringValue(formData, "highlightType") || "custom", "/admin/highlights");
  const rawTargetId = Number.parseInt(stringValue(formData, "targetId"), 10);
  const targetId = Number.isFinite(rawTargetId) && rawTargetId > 0 ? rawTargetId : null;
  const payload = {
    highlightType,
    targetId,
    titleOverride: optionalString(formData, "titleOverride"),
    summaryOverride: optionalString(formData, "summaryOverride"),
    imageUrlOverride,
    linkOverride: validateOptionalUrl(optionalString(formData, "linkOverride"), "/admin/highlights", "Link Override"),
    pinned: parseBoolean(formData, "pinned"),
    status: parseStatus(stringValue(formData, "status") || "draft", "/admin/highlights"),
    sortOrder: Number.parseInt(stringValue(formData, "sortOrder") || "0", 10) || 0,
    updatedAt: new Date().toISOString(),
  };

  if (payload.highlightType === "custom") {
    if (!payload.titleOverride && !payload.summaryOverride && !payload.imageUrlOverride && !payload.linkOverride) {
      redirectWithError("/admin/highlights", "Custom highlights need at least one override field.");
    }
  } else if (!payload.targetId) {
    redirectWithError("/admin/highlights", `${payload.highlightType} highlights require a target.`);
  } else {
    const targetLookup =
      payload.highlightType === "project"
        ? await db.select({ id: projects.id }).from(projects).where(and(eq(projects.id, payload.targetId), eq(projects.status, "published"))).limit(1)
        : payload.highlightType === "post"
          ? await db.select({ id: posts.id }).from(posts).where(and(eq(posts.id, payload.targetId), eq(posts.status, "published"))).limit(1)
          : payload.highlightType === "testimonial"
            ? await db.select({ id: testimonials.id }).from(testimonials).where(and(eq(testimonials.id, payload.targetId), eq(testimonials.status, "published"))).limit(1)
            : await db.select({ id: awards.id }).from(awards).where(and(eq(awards.id, payload.targetId), eq(awards.status, "published"))).limit(1);

    if (!targetLookup[0]) {
      redirectWithError("/admin/highlights", `Selected target is not a published ${payload.highlightType}.`);
    }
  }

  if (id) {
    await db.update(highlights).set(payload).where(eq(highlights.id, id));
  } else {
    await db.insert(highlights).values(payload);
  }

  revalidateHome();
  revalidateExperience();
}

export async function saveSiteSettingAction(formData: FormData) {
  await requireAdminSession();
  const key = stringValue(formData, "key");
  const valueJson = stringValue(formData, "valueJson");
  try {
    JSON.parse(valueJson);
  } catch {
    redirectWithError("/admin/settings", `${key} must be valid JSON.`);
  }
  await db
    .insert(siteSettings)
    .values({ key, valueJson })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: {
        valueJson,
        updatedAt: new Date().toISOString(),
      },
    });

  revalidateHome();
  revalidateAbout();
  revalidateExperience();
}

export async function refreshGithubActivityAction(formData?: FormData) {
  await requireAdminSession();
  const currentYear = new Date().getFullYear();
  const years = formData
    ? parseLines(stringValue(formData, "years")).map((value) => Number.parseInt(value, 10)).filter(Number.isFinite)
    : [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  for (const year of years) {
    const summary = await fetchGithubActivityForYear(year);
    if (summary) {
      await saveGithubActivitySnapshot(summary);
    }
  }

  revalidateHome();
  revalidateExperience();
}
