'use client'

import Link from 'next/link'
import MarkdownContent from '@/components/content/MarkdownContent'
import LiquidImage from '@/components/ui/LiquidImage'
import type { PublicProject } from '@/lib/content/types'

interface DescriptionOtherProjectsProps {
  project: PublicProject
  otherProjects: PublicProject[]
}

const contents = [
  { id: 'overview', label: 'Overview' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'benchmarks', label: 'Benchmarks' },
  { id: 'go-stack', label: 'Go Stack' },
]

export default function DescriptionOtherProjects({ project, otherProjects }: DescriptionOtherProjectsProps) {
  return (
    <section className="bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
        <div className="border-x border-b border-[#d5d5d5] bg-white">
          <nav aria-label="Project contents" className="border-b border-[#d5d5d5] px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">
              <span className="mr-1 text-[#424242]">Contents</span>
              {contents.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="transition hover:text-[#1342FF]">
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <div id="overview" className="scroll-mt-24 px-4 py-8 sm:px-8 sm:py-12 lg:px-16">
            <div className="mx-auto max-w-[760px]">
              <div className="mb-6 border-b border-[#e5e5e5] pb-3">
                <h2 className="text-lg font-bold text-[#424242]">Description</h2>
              </div>
              {project.bodyMd ? (
                <MarkdownContent markdown={project.bodyMd} className="[&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24" />
              ) : (
                <p className="text-base leading-8 text-[#666666]">{project.summary}</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-x border-b border-[#d5d5d5] bg-white">
          <div className="border-b border-[#d5d5d5] px-4 py-3 sm:px-6">
            <h2 className="text-lg font-bold text-[#424242]">Related projects</h2>
          </div>
          <div className="grid grid-cols-1 gap-px bg-[#d5d5d5] sm:grid-cols-2">
            {otherProjects.map((otherProject) => (
              <Link key={otherProject.slug} href={`/projects/${otherProject.slug}`} className="group bg-white p-4 sm:p-6">
                <div className="relative h-40 overflow-hidden bg-[#424242] sm:h-48">
                  {otherProject.bannerImageUrl || otherProject.coverImageUrl ? (
                    <LiquidImage
                      src={otherProject.bannerImageUrl || otherProject.coverImageUrl || '/v2/showcase/banner.png'}
                      alt={otherProject.title}
                      strength={0.4}
                      speed={0.6}
                      size={0.7}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white sm:text-base">{otherProject.title}</h3>
                    <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-white transition group-hover:text-[#b9c7ff]">View</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="p-4 sm:p-6">
            <Link href="/projects" className="flex min-h-[44px] items-center justify-center border border-[#d5d5d5] py-2.5 text-sm font-medium text-[#424242] transition hover:bg-[#F8FAFC]">
              See more projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
