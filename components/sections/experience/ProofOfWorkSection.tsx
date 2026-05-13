"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import CornerDot from "@/components/ui/CornerDot";

interface ProofPayload {
  highlights: Array<{
    id?: number;
    highlightType: string;
    titleOverride?: string | null;
    summaryOverride?: string | null;
    linkOverride?: string | null;
    pinned?: boolean;
  }>;
  posts: Array<{
    slug: string;
    title: string;
    summary: string;
    postType: string;
    sourcePlatform?: string | null;
  }>;
  testimonials: Array<{
    id?: number;
    name: string;
    role?: string | null;
    quote: string;
  }>;
  awards: Array<{
    slug: string;
    title: string;
    year: string;
    proofUrl?: string | null;
  }>;
}

export default function ProofOfWorkSection() {
  const [payload, setPayload] = useState<ProofPayload>({
    highlights: [],
    posts: [],
    testimonials: [],
    awards: [],
  });

  useEffect(() => {
    async function loadProof() {
      const response = await fetch("/api/proof-of-work");
      const data = await response.json();
      setPayload(data);
    }

    loadProof();
  }, []);

  const featuredPosts = payload.posts.slice(0, 3);
  const featuredTestimonials = payload.testimonials.slice(0, 2);
  const featuredAwards = payload.awards.slice(0, 3);

  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-[#F8F8F8]">
      <CornerDot position="bl" />
      <CornerDot position="br" />

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-b lg:border-b-0 lg:border-r border-[#d5d5d5]">
          <div className="border-b border-[#d5d5d5] relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#F8F8F8]" />
            <div className="p-4 sm:p-5">
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#383838] tracking-[-0.01em]">
                Proof of Work
              </h3>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {payload.highlights.slice(0, 4).map((highlight, index) => (
              <a
                key={`${highlight.highlightType}-${highlight.titleOverride}-${index}`}
                href={highlight.linkOverride || "#"}
                target={highlight.linkOverride?.startsWith("http") ? "_blank" : undefined}
                rel={highlight.linkOverride?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block rounded-xl border border-[#d5d5d5] bg-white p-4 transition hover:bg-[#fafafa]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#666666]">
                    {highlight.highlightType}
                  </span>
                  {highlight.pinned ? (
                    <span className="rounded-full bg-[#424242] px-2 py-1 text-[10px] font-semibold text-white">
                      Pinned
                    </span>
                  ) : null}
                </div>
                <h4 className="mt-3 text-[16px] font-bold text-[#424242]">
                  {highlight.titleOverride || "Highlight"}
                </h4>
                <p className="mt-2 text-[13px] leading-[1.7] text-[#555555]">
                  {highlight.summaryOverride}
                </p>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="border-b border-[#d5d5d5] relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#F8F8F8]" />
            <div className="p-4 sm:p-5">
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#383838] tracking-[-0.01em]">
                Writing & Testimonials
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-0">
            <div className="border-b border-[#d5d5d5] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h4 className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[#666666]">
                  Latest Writing
                </h4>
                <Link href="/blog" className="text-sm text-[#1342FF] hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block rounded-xl border border-[#d5d5d5] bg-white p-4 transition hover:bg-[#fafafa]"
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#666666]">
                      {post.postType === "native" ? "Article" : post.sourcePlatform || "External"}
                    </div>
                    <h5 className="mt-2 text-[15px] font-bold text-[#424242]">{post.title}</h5>
                    <p className="mt-2 text-[13px] leading-[1.7] text-[#555555]">{post.summary}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-b border-[#d5d5d5] p-4 sm:p-5">
              <h4 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.2em] text-[#666666]">
                Testimonials
              </h4>
              <div className="space-y-4">
                {featuredTestimonials.map((testimonial) => (
                  <div key={`${testimonial.name}-${testimonial.id}`} className="rounded-xl border border-[#d5d5d5] bg-white p-4">
                    <p className="text-[13px] leading-[1.8] text-[#424242]">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#666666]">
                      {testimonial.name} · {testimonial.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <h4 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.2em] text-[#666666]">
                Awards
              </h4>
              <div className="space-y-3">
                {featuredAwards.map((award) => (
                  <a
                    key={award.slug}
                    href={award.proofUrl || "#"}
                    target={award.proofUrl ? "_blank" : undefined}
                    rel={award.proofUrl ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#d5d5d5] bg-white p-4 transition hover:bg-[#fafafa]"
                  >
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#666666]">
                        {award.year}
                      </div>
                      <div className="mt-2 text-[15px] font-bold text-[#424242]">{award.title}</div>
                    </div>
                    <span className="text-sm text-[#1342FF]">Open ↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
