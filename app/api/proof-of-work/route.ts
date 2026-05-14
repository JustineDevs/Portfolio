import { NextResponse } from "next/server";

import {
  getFeaturedAwardCards,
  getFeaturedCertificateCards,
  getFeaturedPosts,
  getFeaturedProjects,
  getFeaturedTestimonials,
} from "@/lib/content/public";

export async function GET() {
  const [projects, posts, testimonials, awards, certificates] = await Promise.all([
    getFeaturedProjects(4),
    getFeaturedPosts(3),
    getFeaturedTestimonials(2),
    getFeaturedAwardCards(3),
    getFeaturedCertificateCards(3),
  ]);

  return NextResponse.json({
    projects,
    posts,
    testimonials,
    awards,
    certificates,
  });
}
