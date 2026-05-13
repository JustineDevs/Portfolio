import { revalidatePath, revalidateTag } from "next/cache";

export const CONTENT_TAGS = {
  projects: "projects",
  posts: "posts",
  testimonials: "testimonials",
  awards: "awards",
  highlights: "highlights",
  pageSections: "page-sections",
  githubActivity: "github-activity",
} as const;

export function revalidateProjects(slug?: string, previousSlug?: string) {
  revalidateTag(CONTENT_TAGS.projects);
  revalidatePath("/projects");

  if (slug) {
    revalidatePath(`/projects/${slug}`);
  }

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/projects/${previousSlug}`);
  }
}

export function revalidatePosts(slug?: string, previousSlug?: string) {
  revalidateTag(CONTENT_TAGS.posts);
  revalidatePath("/blog");

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/blog/${previousSlug}`);
  }
}

export function revalidateAbout() {
  revalidateTag(CONTENT_TAGS.pageSections);
  revalidatePath("/about");
}

export function revalidateExperience() {
  revalidateTag(CONTENT_TAGS.highlights);
  revalidateTag(CONTENT_TAGS.testimonials);
  revalidateTag(CONTENT_TAGS.awards);
  revalidateTag(CONTENT_TAGS.githubActivity);
  revalidatePath("/experience");
}

export function revalidateHome() {
  revalidateTag(CONTENT_TAGS.projects);
  revalidateTag(CONTENT_TAGS.pageSections);
  revalidateTag(CONTENT_TAGS.highlights);
  revalidateTag(CONTENT_TAGS.awards);
  revalidateTag(CONTENT_TAGS.githubActivity);
  revalidatePath("/");
}
