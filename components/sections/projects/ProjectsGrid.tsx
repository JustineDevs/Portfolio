"use client"

import React from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion"
import { X } from "lucide-react"
import Image from "next/image"
import CornerDot from "@/components/ui/CornerDot"
import LiquidImage from "@/components/ui/LiquidImage"
import { DiagonalCarousel } from "@/components/ui/diagonal-carousel"
import MarkdownContent from "@/components/content/MarkdownContent"
import type { PublicProject } from "@/lib/content/types"
import { getRenderableImageUrl, shouldUseUnoptimizedImage } from "@/lib/asset-urls"

export default function ProjectsGrid({ projects }: { projects: PublicProject[] }) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [expandedProject, setExpandedProject] = React.useState<PublicProject | null>(null)
  const prefersReducedMotion = useReducedMotion()

  React.useEffect(() => {
    if (!expandedProject) return
    const previousBodyOverflow = document.body.style.overflow
    const previousBodyOverflowY = document.body.style.overflowY
    const previousDocumentOverflow = document.documentElement.style.overflow
    const previousDocumentOverflowY = document.documentElement.style.overflowY
    document.body.style.overflow = "hidden"
    document.body.style.overflowY = "hidden"
    document.documentElement.style.overflow = "hidden"
    document.documentElement.style.overflowY = "hidden"
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setExpandedProject(null) }
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.body.style.overflowY = previousBodyOverflowY
      document.documentElement.style.overflow = previousDocumentOverflow
      document.documentElement.style.overflowY = previousDocumentOverflowY
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [expandedProject])

  return (
    <LayoutGroup id="project-expandable">
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="bl" className="hidden xs:block" />
      <CornerDot position="br" className="hidden xs:block" />
      <div className="relative h-[640px] overflow-hidden bg-[#f7f9fc] sm:h-[700px]">
        <DiagonalCarousel
          items={projects.map((project) => ({ src: project.bannerImageUrl || project.coverImageUrl || "/v2/showcase/banner.png", title: project.title, alt: project.title, layoutId: `project-${project.slug}` }))}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          onActiveItemClick={(index) => setExpandedProject(projects[index])}
          activeItemExpanded={Boolean(expandedProject)}
          slideSize={270}
          rotationStep={30}
          verticalStep={120}
          inactiveScale={0.6}
          className="text-[#202938]"
          imageClassName="bg-white/60"
          labelClassName="text-[#202938]"
        />
      </div>
      {typeof document !== "undefined" ? createPortal(<AnimatePresence>
        {expandedProject ? <motion.div
          key={expandedProject.slug}
          layoutId={`project-${expandedProject.slug}`}
          className="fixed inset-0 z-[100] h-screen overscroll-contain overflow-hidden bg-white text-[#202938]"
          role="dialog"
          aria-modal="true"
          aria-label={`${expandedProject.title} project details`}
          initial={{ opacity: 0.98 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.98 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div className="grid h-screen min-h-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]" initial={{ y: prefersReducedMotion ? 0 : 24, scale: prefersReducedMotion ? 1 : 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: prefersReducedMotion ? 0 : 24, scale: prefersReducedMotion ? 1 : 0.98 }} transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", bounce: 0.14, duration: 0.65 }}>
            <div className="relative min-h-0 overflow-hidden bg-[#f3f6fb]">
              <Image src={getRenderableImageUrl(expandedProject.bannerImageUrl || expandedProject.coverImageUrl || "/v2/showcase/banner.png")} alt={expandedProject.title} fill className="object-contain p-8 sm:p-16" priority unoptimized={shouldUseUnoptimizedImage(expandedProject.bannerImageUrl || expandedProject.coverImageUrl || "")} />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/95 to-transparent" />
              <div className="absolute bottom-8 left-6 right-6 sm:bottom-12 sm:left-12 sm:right-12"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1342FF]">{expandedProject.category}</p><h2 className="max-w-3xl text-3xl font-bold leading-tight text-[#202938] sm:text-5xl">{expandedProject.title}</h2></div>
            </div>
            <div
              className="relative h-full min-h-0 overflow-y-scroll overscroll-y-contain touch-pan-y bg-white px-6 py-24 sm:px-12 sm:py-16 lg:px-16"
              onWheel={(event) => {
                event.preventDefault()
                event.currentTarget.scrollTop += event.deltaY
              }}
            >
              <button type="button" onClick={() => setExpandedProject(null)} className="fixed right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#d5d5d5] bg-white text-[#202938] shadow-sm transition hover:bg-[#f3f6fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1342FF]" aria-label="Close project details"><X size={20} /></button>
              <div className="mx-auto max-w-2xl"><p className="text-lg leading-relaxed text-[#687386]">{expandedProject.summary}</p>{expandedProject.bodyMd ? <div className="mt-8 border-t border-[#e5e9f0] pt-8"><MarkdownContent markdown={expandedProject.bodyMd} /></div> : null}<div className="mt-10 border-t border-[#e5e9f0] pt-8"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#687386]">Technology and tags</p><div className="mt-3 flex flex-wrap gap-2">{[...expandedProject.tags, ...expandedProject.technologies].filter((value, index, values) => values.indexOf(value) === index).map((tag) => <span key={tag} className="rounded-full border border-[#d5dce8] bg-[#f8fafc] px-3 py-1.5 text-xs text-[#536176]">{tag}</span>)}</div></div>{expandedProject.responsibilities.length > 0 ? <div className="mt-10 border-t border-[#e5e9f0] pt-8"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#687386]">Responsibilities</p><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#536176]">{expandedProject.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}{expandedProject.networks.length > 0 ? <div className="mt-10 border-t border-[#e5e9f0] pt-8"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#687386]">Networks</p><div className="mt-3 flex flex-wrap gap-2">{expandedProject.networks.map((network) => <span key={network} className="rounded-full border border-[#d5dce8] bg-[#f8fafc] px-3 py-1.5 text-xs text-[#536176]">{network}</span>)}</div></div> : null}<div className="mt-10 flex flex-wrap gap-3 border-t border-[#e5e9f0] pt-8">{expandedProject.websiteUrl ? <a href={expandedProject.websiteUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#202938] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1342FF]">Visit website</a> : null}{expandedProject.links.map((link) => <a key={`${link.type}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#cfd7e3] px-5 py-3 text-sm font-semibold text-[#202938] transition hover:border-[#1342FF] hover:text-[#1342FF]">{link.label || link.type}</a>)}</div></div>
            </div>
          </motion.div>
        </motion.div> : null}
      </AnimatePresence>, document.body) : null}
    </section>
    </LayoutGroup>
  )
}
