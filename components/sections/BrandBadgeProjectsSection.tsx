'use client';

import React from 'react';
import Link from 'next/link';
import CornerDot from '@/components/ui/CornerDot';
import { ScrambleTextOnHover } from '@/components/ui/scramble-text';
import type { PublicAwardCard, PublicProject } from '@/lib/content/types';
import type { AboutRecentPost } from '@/lib/content/page-data';
import { AwardsList } from '@/components/sections/experience/ExperienceProofCards';
import { ProjectCard } from '@/components/sections/projects/ProjectsGrid';
import { ArrowUpRight, BookOpen } from 'lucide-react';

export default function BrandBadgeProjectsSection({
  featuredProjects,
  featuredAwards,
  featuredPosts,
}: {
  featuredProjects: PublicProject[]
  featuredAwards: PublicAwardCard[]
  featuredPosts: AboutRecentPost[]
}) {
  return (
    <section className="w-full">
        {/* Header Row */}
          <div className="relative border-l border-r border-b border-[#d5d5d5] flex flex-col lg:flex-row">
            <div className="lg:w-1/2 shrink-0 border-b lg:border-b-0 lg:border-r border-[#d5d5d5] h-[48px] xs:h-[52px] sm:h-[56px] flex items-center px-4 xs:px-5 sm:px-6">
              <h2 className="text-[16px] xs:text-[18px] sm:text-[20px] font-bold text-[#424242] tracking-[-0.01em]">
                <ScrambleTextOnHover text="Blog catalog" as="span" />
              </h2>
            </div>
            <div className="flex-1 h-[48px] xs:h-[52px] sm:h-[56px] flex items-center px-4 xs:px-5 sm:px-6">
              <h2 className="text-[16px] xs:text-[18px] sm:text-[20px] font-bold text-[#424242] tracking-[-0.01em]">
                <ScrambleTextOnHover text="Featured Projects" as="span" />
              </h2>
            </div>
          </div>

        {/* Content Row */}
        <div className="relative border-l border-r border-b border-[#d5d5d5] flex flex-col lg:flex-row">
          
          {/* Left Column: Blog catalog & achievements */}
          <div className="lg:w-1/2 shrink-0 border-b lg:border-b-0 lg:border-r border-[#d5d5d5]">
            <div className="border-b border-[#d5d5d5] p-3 xs:p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#666666]" strokeWidth={1.8} aria-hidden="true" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6a7280]">Recent writing</p>
                </div>
                <Link href="/blog" className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#424242] hover:underline">
                  View catalog <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
              <div className="divide-y divide-[#e5e5e5] border-y border-[#e5e5e5]">
                {featuredPosts.slice(0, 4).map((post, index) => {
                  const href = post.postType === 'external' && post.canonicalUrl ? post.canonicalUrl : `/blog/${post.slug}`
                  const content = (
                    <>
                      <div className="flex items-start gap-3">
                        <span className="pt-0.5 text-[10px] font-bold tracking-[0.16em] text-[#666666]">0{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#7a8496]">
                            <span>{post.postType === 'native' ? 'Article' : 'External post'}</span>
                            {post.canonicalUrl ? <span>↗</span> : null}
                          </div>
                          <h3 className="mt-1 text-[13px] font-bold leading-[1.35] text-[#424242]">{post.title}</h3>
                          <p className="mt-1 line-clamp-2 text-[11px] leading-[1.55] text-[#6a7280]">{post.summary}</p>
                        </div>
                        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[#9aa4b6]" aria-hidden="true" />
                      </div>
                    </>
                  )
                  return post.postType === 'external' && post.canonicalUrl ? (
                    <a key={post.slug} href={href} target="_blank" rel="noopener noreferrer" className="block p-3 transition-colors hover:bg-[#fafafa]">{content}</a>
                  ) : (
                    <Link key={post.slug} href={href} className="block p-3 transition-colors hover:bg-[#fafafa]">{content}</Link>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-[#d5d5d5] px-3 py-3 xs:px-4 sm:px-5">
              <div>
                <h2 className="text-[15px] xs:text-[16px] sm:text-[18px] font-bold text-[#424242]">Featured awards</h2>
                <p className="mt-0.5 text-[10px] xs:text-[11px] sm:text-[12px] text-[#666666]">Selected recognition from shipped work</p>
              </div>
                <Link
                href="/experience#proof-of-work"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#424242] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#424242]"
                aria-label="View all proof of work and writing items"
              >
                View all <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="p-3 xs:p-4 sm:p-5">
              <AwardsList awards={featuredAwards} compact />
            </div>
          </div>

          {/* Right Column: Featured Projects */}
          <div className="flex-1 p-3 xs:p-4 sm:p-5 relative">
            <CornerDot position="br" className="hidden xs:block" />
            <CornerDot position="bl" className="hidden lg:block" />

            <ul className="space-y-4 xs:space-y-5">
              {featuredProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
            </ul>

            <div className="mt-4 xs:mt-5 flex justify-center">
              <Link
                href="/projects"
                className="px-4 xs:px-5 sm:px-6 py-1.5 xs:py-2 bg-[#424242] text-white text-[10px] xs:text-[11px] sm:text-[12px] font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2"
                aria-label="See more projects"
              >
                See more projects
              </Link>
            </div>
          </div>
      </div>

    </section>
  );
}
