"use client";

import Link from "next/link";
import Image from "next/image";

import CornerDot from "@/components/ui/CornerDot";
import { getRenderableImageUrl, isSvgAssetUrl } from "@/lib/asset-urls";
import type { ExperiencePageData } from "@/lib/content/page-data";

function AssetThumb({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) return null;

  const renderableSrc = getRenderableImageUrl(src);
  const unoptimized = isSvgAssetUrl(src) || renderableSrc.startsWith("/api/image/resolve");

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#f8f8f8]">
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

export default function ProofOfWorkSection({ payload }: { payload: ExperiencePageData["proofOfWork"] }) {
  const featuredProofCards = payload.projects;
  const featuredPosts = payload.writing;
  const featuredTestimonials = payload.testimonials;
  const featuredAwards = payload.awards;
  const featuredCertificates = payload.certificates.slice(0, 3);

  return (
    <section id="proof-of-work" className="relative scroll-mt-24 border-l border-r border-b border-[#d5d5d5] bg-[#F8F8F8]">
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
                {featuredCertificates.map((certificate) => (
                  <a
                    key={certificate.slug}
                    href={certificate.proofUrl || "#"}
                    target={certificate.proofUrl ? "_blank" : undefined}
                    rel={certificate.proofUrl ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-3 rounded-xl border border-[#d5d5d5] bg-white p-4 transition hover:bg-[#fafafa]"
                  >
                    <AssetThumb src={certificate.logoUrl || null} alt={certificate.title} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#666666]">
                        Certificate
                      </div>
                      <div className="mt-2 text-[15px] font-bold text-[#424242]">{certificate.title}</div>
                      <p className="mt-2 text-[13px] leading-[1.7] text-[#555555]">{certificate.description}</p>
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
