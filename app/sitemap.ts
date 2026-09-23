import type { MetadataRoute } from "next";
import { latestChangelogDate } from "@/lib/content/changelog";
import { getPublishedPosts, getPublishedProjects } from "@/lib/content/public";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getPublishedProjects(), getPublishedPosts()]);
  const staticPages = ["/", "/about", "/projects", "/experience", "/blog", "/changelog"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: path === "/changelog" ? latestChangelogDate : undefined,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
  const projectPages = projects.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: project.publishedAt ? new Date(project.publishedAt) : undefined,
    changeFrequency: "monthly" as const,
    priority: project.featured ? 0.8 : 0.6,
  }));
  const postPages = posts.filter((post) => post.postType === "native").map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
    changeFrequency: "yearly" as const,
    priority: post.featured ? 0.7 : 0.5,
  }));

  return [...staticPages, ...projectPages, ...postPages];
}
