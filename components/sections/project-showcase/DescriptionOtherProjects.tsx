'use client'

import MarkdownContent from '@/components/content/MarkdownContent'
import type { PublicProject } from '@/lib/content/types'

interface DescriptionOtherProjectsProps {
  project: PublicProject
}

function slugifyHeading(value: string) {
  return value.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/`/g, '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')
}

export default function DescriptionOtherProjects({ project }: DescriptionOtherProjectsProps) {
  const headings = (project.bodyMd?.replaceAll('\\n', '\n').match(/^#{2,3}\s+(.+)$/gm) || []).map((heading) => heading.replace(/^#{2,3}\s+/, '').trim()).filter(Boolean).slice(0, 5)
  const contents = headings.map((heading) => ({ id: slugifyHeading(heading), label: heading }))

  return (
    <section className="bg-[#F8FAFC] text-[#383838]">
      <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:px-12 lg:pb-24 lg:pt-12">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-[#d5d5d5] pb-8 sm:mb-16">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#777777]">Project dossier</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#383838] sm:text-6xl">Inside the build.</h2></div>
          <p className="max-w-sm text-sm leading-6 text-[#777777]">A technical record of the decisions, systems, and trade-offs behind {project.title}.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#777777]">Read the case study</p>
            <nav aria-label="Project contents" className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-y-4">
              {contents.map((item, index) => <a key={item.id} href={`#${item.id}`} className="group flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-[#777777] transition hover:text-[#1342FF]"><span className="font-mono text-[10px] text-[#aaaaaa] group-hover:text-[#1342FF]">0{index + 1}</span>{item.label}</a>)}
            </nav>
          </aside>

          <article id="overview" className="scroll-mt-20 overflow-hidden bg-[#F8FAFC] px-5 py-7 text-[#383838] sm:px-10 sm:py-12 lg:px-16 lg:py-16">
            <div className="mb-10 flex items-center justify-between border-b border-[#d5d5d5] pb-5"><span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#777777]">Technical notes</span><span className="font-mono text-xs text-[#999999]">{project.category}</span></div>
            {project.bodyMd ? <MarkdownContent markdown={project.bodyMd} className="[&_h1]:text-4xl [&_h1]:tracking-[-0.05em] [&_h2]:scroll-mt-24 [&_h2]:mb-6 [&_h2]:mt-20 [&_h2]:border-t [&_h2]:border-[#d5d5d5] [&_h2]:pt-8 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-[-0.04em] [&_h3]:mb-4 [&_h3]:mt-12 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:text-base [&_p]:leading-8 [&_p]:text-[#555555] [&_table]:my-10 [&_table]:text-sm" /> : <p className="max-w-3xl text-xl leading-relaxed text-[#555555] sm:text-2xl">{project.summary}</p>}
          </article>
        </div>
      </div>
    </section>
  )
}
