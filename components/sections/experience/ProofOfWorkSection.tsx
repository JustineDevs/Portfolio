"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

import CornerDot from "@/components/ui/CornerDot";
import { getRenderableImageUrl, isSvgAssetUrl } from "@/lib/asset-urls";

interface ProofPayload {
  highlights: Array<{
    id?: number;
    highlightType: string;
    targetId?: number | null;
    titleOverride?: string | null;
    summaryOverride?: string | null;
    imageUrlOverride?: string | null;
    linkOverride?: string | null;
    pinned?: boolean;
    resolvedTitle: string;
    resolvedSummary: string;
    resolvedImageUrl?: string | null;
    resolvedHref?: string | null;
    resolvedMeta: string;
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
    description?: string | null;
    year: string;
    proofUrl?: string | null;
    logoUrl?: string | null;
  }>;
}

type HighlightCard = {
  key: string;
  typeLabel: string;
  title: string;
  summary: string;
  href?: string | null;
  imageUrl?: string | null;
  pinned?: boolean;
};

type WritingCard = {
  key: string;
  label: string;
  title: string;
  summary: string;
  href: string;
  imageUrl?: string | null;
};

type TestimonialCard = {
  key: string;
  label: string;
  title?: string | null;
  quote: string;
};

type AwardCard = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  href?: string | null;
  logoUrl?: string | null;
  sourceLabel: string;
};

function AssetThumb({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) return null;

  const renderableSrc = getRenderableImageUrl(src);
  const unoptimized = isSvgAssetUrl(src) || renderableSrc.startsWith("/api/image/resolve");

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#d5d5d5] bg-[#f8f8f8]">
      <Image
        src={renderableSrc}
        alt={alt}
        fill
        className="object-contain p-1.5"
        unoptimized={unoptimized}
      />
    </div>
  );
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

  const proofHighlights = payload.highlights.filter(
    (highlight) => highlight.highlightType === "project" || highlight.highlightType === "custom",
  );
  const postHighlights = payload.highlights.filter((highlight) => highlight.highlightType === "post");
  const testimonialHighlights = payload.highlights.filter((highlight) => highlight.highlightType === "testimonial");
  const awardHighlights = payload.highlights.filter((highlight) => highlight.highlightType === "award");

  const featuredProofCards = proofHighlights.slice(0, 4).map<HighlightCard>((highlight, index) => ({
    key: `proof-${highlight.id ?? index}`,
    typeLabel: highlight.resolvedMeta,
    title: highlight.resolvedTitle,
    summary: highlight.resolvedSummary,
    href: highlight.resolvedHref,
    imageUrl: highlight.resolvedImageUrl,
    pinned: highlight.pinned,
  }));

  const featuredPosts = (() => {
    const seen = new Set<string>();
    const cards: WritingCard[] = [];

    for (const highlight of postHighlights) {
      const title = highlight.resolvedTitle;
      const href = highlight.resolvedHref?.trim() || "#";
      const dedupeKey = `${title.toLowerCase()}|${href}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      cards.push({
        key: `highlight-post-${highlight.id ?? dedupeKey}`,
        label: highlight.resolvedMeta || "Highlight",
        title,
        summary: highlight.resolvedSummary || "Writing highlight",
        href,
        imageUrl: highlight.resolvedImageUrl || null,
      });
    }

    for (const post of payload.posts) {
      const href = `/blog/${post.slug}`;
      const dedupeKey = `${post.title.toLowerCase()}|${href}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      cards.push({
        key: post.slug,
        label: post.postType === "native" ? "Article" : post.sourcePlatform || "External",
        title: post.title,
        summary: post.summary,
        href,
      });
    }

    return cards.slice(0, 3);
  })();

  const featuredTestimonials = (() => {
    const seen = new Set<string>();
    const cards: TestimonialCard[] = [];

    for (const highlight of testimonialHighlights) {
      const title = highlight.resolvedTitle || "Testimonial";
      const quote = highlight.resolvedSummary || "Testimonial highlight";
      const dedupeKey = `${title.toLowerCase()}|${quote.toLowerCase()}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      cards.push({
        key: `highlight-testimonial-${highlight.id ?? dedupeKey}`,
        label: highlight.resolvedMeta || "Highlight",
        title,
        quote,
      });
    }

    for (const testimonial of payload.testimonials) {
      const dedupeKey = `${testimonial.name.toLowerCase()}|${testimonial.quote.toLowerCase()}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      cards.push({
        key: `${testimonial.name}-${testimonial.id ?? dedupeKey}`,
        label: testimonial.role || "Testimonial",
        title: testimonial.name,
        quote: testimonial.quote,
      });
    }

    return cards.slice(0, 2);
  })();

  const featuredAwards = (() => {
    const seen = new Set<string>();
    const cards: AwardCard[] = [];

    for (const highlight of awardHighlights) {
      const title = highlight.resolvedTitle || "Award";
      const href = highlight.resolvedHref?.trim() || null;
      const dedupeKey = `${title.toLowerCase()}|${href || ""}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      cards.push({
        slug: `highlight-${highlight.id ?? dedupeKey}`,
        title,
        summary: highlight.resolvedSummary || "Award highlight",
        year: "",
        href,
        logoUrl: highlight.resolvedImageUrl || null,
        sourceLabel: highlight.resolvedMeta || "Highlight",
      });
    }

    for (const award of payload.awards) {
      const title = award.title.trim();
      const href = award.proofUrl?.trim() || null;
      const dedupeKey = `${title.toLowerCase()}|${href || ""}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      cards.push({
        slug: award.slug,
        title,
        summary: award.description?.trim() || "Award",
        year: award.year,
        href,
        logoUrl: award.logoUrl?.trim() || null,
        sourceLabel: award.year || "Award",
      });
    }

    return cards.slice(0, 3);
  })();

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
            {featuredProofCards.map((highlight) => (
              <a
                key={highlight.key}
                href={highlight.href || "#"}
                target={highlight.href?.startsWith("http") ? "_blank" : undefined}
                rel={highlight.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block rounded-xl border border-[#d5d5d5] bg-white p-4 transition hover:bg-[#fafafa]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#666666]">
                    {highlight.typeLabel}
                  </span>
                  {highlight.pinned ? (
                    <span className="rounded-full bg-[#424242] px-2 py-1 text-[10px] font-semibold text-white">
                      Pinned
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 flex items-start gap-3">
                  <AssetThumb src={highlight.imageUrl} alt={highlight.title} />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[16px] font-bold text-[#424242]">{highlight.title}</h4>
                    <p className="mt-2 text-[13px] leading-[1.7] text-[#555555]">{highlight.summary}</p>
                  </div>
                </div>
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
                  <a
                    key={post.key}
                    href={post.href}
                    target={post.href.startsWith("http") ? "_blank" : undefined}
                    rel={post.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block rounded-xl border border-[#d5d5d5] bg-white p-4 transition hover:bg-[#fafafa]"
                  >
                    <div className="flex items-start gap-3">
                      <AssetThumb src={post.imageUrl} alt={post.title} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-[#666666]">
                          {post.label}
                        </div>
                        <h5 className="mt-2 text-[15px] font-bold text-[#424242]">{post.title}</h5>
                        <p className="mt-2 text-[13px] leading-[1.7] text-[#555555]">{post.summary}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="border-b border-[#d5d5d5] p-4 sm:p-5">
              <h4 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.2em] text-[#666666]">
                Testimonials
              </h4>
              <div className="space-y-4">
                {featuredTestimonials.map((testimonial) => (
                  <div key={testimonial.key} className="rounded-xl border border-[#d5d5d5] bg-white p-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#666666]">
                      {testimonial.label}
                    </div>
                    <p className="text-[13px] leading-[1.8] text-[#424242]">&ldquo;{testimonial.quote}&rdquo;</p>
                    {testimonial.title ? (
                      <div className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#666666]">
                        {testimonial.title}
                      </div>
                    ) : null}
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
                    href={award.href || "#"}
                    target={award.href ? "_blank" : undefined}
                    rel={award.href ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-3 rounded-xl border border-[#d5d5d5] bg-white p-4 transition hover:bg-[#fafafa]"
                  >
                    <div className="relative mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#d5d5d5] bg-[#f8f8f8]">
                      {award.logoUrl ? (
                        <Image
                          src={getRenderableImageUrl(award.logoUrl)}
                          alt={award.title}
                          fill
                          className="object-contain p-1.5"
                          unoptimized={
                            isSvgAssetUrl(award.logoUrl) ||
                            getRenderableImageUrl(award.logoUrl).startsWith("/api/image/resolve")
                          }
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#666666]">
                        {award.sourceLabel}
                      </div>
                      <div className="mt-2 text-[15px] font-bold text-[#424242]">{award.title}</div>
                      <p className="mt-2 text-[13px] leading-[1.7] text-[#555555]">{award.summary}</p>
                    </div>
                    <span className="shrink-0 text-sm text-[#1342FF]">Open ↗</span>
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
