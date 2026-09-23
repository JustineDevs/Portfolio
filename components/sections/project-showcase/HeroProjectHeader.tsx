'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ExternalLink, Share2 } from 'lucide-react'
import LiquidImage from '@/components/ui/LiquidImage'
import type { PublicProject } from '@/lib/content/types'
import { getRenderableImageUrl, shouldUseUnoptimizedImage } from '@/lib/asset-urls'

interface HeroProjectHeaderProps {
  project: PublicProject
}

export default function HeroProjectHeader({ project }: HeroProjectHeaderProps) {
  const detailsRef = useRef<HTMLDivElement>(null)
  const publishedDate = project.publishedAt
    ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(project.publishedAt))
    : null

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: project.title, text: project.summary, url: window.location.href })
    else navigator.clipboard.writeText(window.location.href)
  }

  return (
    <section className="bg-[#F8FAFC]">
      <div className="relative h-[clamp(300px,52svh,560px)] overflow-hidden bg-[#161616]" style={{ viewTransitionName: `project-media-${project.slug}` }}>
        {project.bannerImageUrl ? (
          <LiquidImage src={project.bannerImageUrl} alt={project.title} strength={0.18} speed={0.35} size={0.6} />
        ) : project.coverImageUrl ? (
          <Image src={getRenderableImageUrl(project.coverImageUrl)} alt={project.title} fill priority className="object-cover" unoptimized={shouldUseUnoptimizedImage(project.coverImageUrl)} />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/10" />
        <div className="absolute inset-x-4 bottom-5 flex items-end justify-between gap-6 text-white sm:inset-x-8 sm:bottom-8 lg:inset-x-12">
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/75">{project.category}</span>
          <button type="button" onClick={() => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="text-xs uppercase tracking-[0.18em] text-white/80 transition hover:text-white">Explore project ↓</button>
        </div>
      </div>

      <div ref={detailsRef} className="mx-auto grid max-w-[1440px] scroll-mt-20 grid-cols-1 gap-12 px-5 pb-12 pt-16 sm:px-8 sm:pb-16 sm:pt-24 lg:grid-cols-[minmax(0,1.55fr)_minmax(220px,0.45fr)] lg:gap-20 lg:px-12 lg:pb-12 lg:pt-32">
        <div>
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#777777]"><span className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#1342FF]" /><span>{publishedDate ?? 'Selected work'}</span></span><Link href="/projects" className="transition hover:text-[#1342FF]">← All projects</Link></div>
          <h1 className="max-w-3xl text-3xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#383838] sm:text-4xl lg:text-5xl">{project.title}</h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#666666] sm:text-xl">{project.summary}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            {project.websiteUrl && <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#383838] underline decoration-[#1342FF] decoration-2 underline-offset-4 transition hover:text-[#1342FF]">Visit website <ExternalLink size={15} aria-hidden="true" /></a>}
            <button type="button" onClick={handleShare} className="inline-flex items-center gap-2 text-sm font-semibold text-[#666666] transition hover:text-[#383838]">Share project <Share2 size={15} aria-hidden="true" /></button>
            <span aria-disabled="true" title="Work site under construction" className="inline-flex cursor-not-allowed items-center gap-2 text-sm font-semibold text-[#999999]">Work site under construction <Calendar size={15} aria-hidden="true" /></span>
          </div>
          <div className="mt-8 border-t border-[#d5d5d5] pt-5"><span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#777777]">Tech stack</span><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#555555]">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div>
        </div>

        <aside className="space-y-10 border-t border-[#d5d5d5] pt-6 text-sm text-[#555555] lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div><span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#777777]">Role</span><ul className="space-y-1.5">{(project.responsibilities.length > 0 ? project.responsibilities : [project.category]).map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#777777]">Authors</span><div className="space-y-1.5">{(project.authors.length > 0 ? project.authors : [{ name: project.authorName, url: project.authorUrl }]).map((author) => author.url ? <a key={`${author.name}-${author.url}`} href={author.url} target="_blank" rel="noopener noreferrer" className="block transition hover:text-[#1342FF] hover:underline hover:underline-offset-2">{author.name}</a> : <span key={author.name} className="block">{author.name}</span>)}</div></div>
          <div><span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#777777]">Tags</span><div className="flex flex-wrap gap-x-3 gap-y-1">{project.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></div>
        </aside>
      </div>

    </section>
  )
}
