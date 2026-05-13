import { NextResponse } from "next/server";

import {
  getPublishedAwards,
  getPublishedHighlights,
  getPublishedPosts,
  getPublishedTestimonials,
} from "@/lib/content/public";

export async function GET() {
  const [highlights, posts, testimonials, awards] = await Promise.all([
    getPublishedHighlights(),
    getPublishedPosts(),
    getPublishedTestimonials(),
    getPublishedAwards(),
  ]);

  return NextResponse.json({
    highlights,
    posts,
    testimonials,
    awards,
  });
}
