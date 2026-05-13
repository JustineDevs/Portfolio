import { NextResponse } from "next/server";

import {
  getPublishedProjects,
  getPublishedAwards,
  getPublishedHighlights,
  getPublishedPosts,
  getPublishedTestimonials,
} from "@/lib/content/public";

export async function GET() {
  const [projects, highlights, posts, testimonials, awards] = await Promise.all([
    getPublishedProjects(),
    getPublishedHighlights(),
    getPublishedPosts(),
    getPublishedTestimonials(),
    getPublishedAwards(),
  ]);

  const projectById = new Map(projects.map((project) => [project.id, project]));
  const postById = new Map(posts.map((post) => [post.id, post]));
  const testimonialById = new Map(testimonials.map((testimonial) => [testimonial.id, testimonial]));
  const awardById = new Map(awards.map((award) => [award.id, award]));

  const resolvedHighlights = highlights.map((highlight) => {
    const project = highlight.highlightType === "project" ? projectById.get(highlight.targetId ?? -1) : null;
    const post = highlight.highlightType === "post" ? postById.get(highlight.targetId ?? -1) : null;
    const testimonial = highlight.highlightType === "testimonial" ? testimonialById.get(highlight.targetId ?? -1) : null;
    const award = highlight.highlightType === "award" ? awardById.get(highlight.targetId ?? -1) : null;

    const resolvedTitle =
      highlight.titleOverride?.trim() ||
      project?.title ||
      post?.title ||
      testimonial?.name ||
      award?.title ||
      "Highlight";

    const resolvedSummary =
      highlight.summaryOverride?.trim() ||
      project?.summary ||
      post?.summary ||
      testimonial?.quote ||
      award?.description ||
      "";

    const resolvedImageUrl =
      highlight.imageUrlOverride?.trim() ||
      project?.bannerImageUrl ||
      project?.coverImageUrl ||
      post?.coverImageUrl ||
      award?.logoUrl ||
      null;

    const resolvedHref =
      highlight.linkOverride?.trim() ||
      (highlight.highlightType === "project" && project ? `/projects/${project.slug}` : null) ||
      (highlight.highlightType === "post" && post
        ? post.postType === "external" && post.canonicalUrl
          ? post.canonicalUrl
          : `/blog/${post.slug}`
        : null) ||
      (highlight.highlightType === "award" && award ? award.proofUrl || null : null);

    const resolvedMeta =
      highlight.highlightType === "post"
        ? post?.postType === "native"
          ? "Article"
          : post?.sourcePlatform || "External"
        : highlight.highlightType === "testimonial"
          ? testimonial?.role || "Testimonial"
          : highlight.highlightType === "award"
            ? award?.year || "Award"
            : highlight.highlightType;

    return {
      ...highlight,
      resolvedTitle,
      resolvedSummary,
      resolvedImageUrl,
      resolvedHref,
      resolvedMeta,
    };
  });

  return NextResponse.json({
    highlights: resolvedHighlights,
    posts,
    testimonials,
    awards,
  });
}
