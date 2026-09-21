import Image from 'next/image'
import Link from 'next/link'
import type { PublicProject } from '@/lib/content/types'
import { getRenderableImageUrl, shouldUseUnoptimizedImage } from '@/lib/asset-urls'

interface ResponsibilitiesNetworksProps {
  project: PublicProject
  otherProjects: PublicProject[]
}

function ProjectCatalogCard({ project, index }: { project: PublicProject; index: number }) {
  const imageUrl = project.bannerImageUrl || project.coverImageUrl

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative aspect-[1.5] overflow-hidden bg-[#202020]">
        {imageUrl ? <Image src={getRenderableImageUrl(imageUrl)} alt={project.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]" unoptimized={shouldUseUnoptimizedImage(imageUrl)} /> : <div className="absolute inset-0 bg-[#202020]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        <div className="absolute inset-x-5 bottom-4 flex items-center justify-between"><span className="font-mono text-[10px] text-white/70">0{index + 1}</span><span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">{project.category}</span></div>
      </div>
      <div className="border-b border-[#d5d5d5] py-5"><div className="flex items-start justify-between gap-5"><h3 className="max-w-xl text-xl font-semibold leading-tight tracking-[-0.035em] text-[#383838] transition group-hover:text-[#1342FF] sm:text-2xl">{project.title}</h3><span className="shrink-0 pt-1 text-xs uppercase tracking-[0.16em] text-[#777777]">View ↗</span></div><p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-[#777777]">{project.summary}</p></div>
    </Link>
  )
}

export default function ResponsibilitiesNetworks({ otherProjects }: ResponsibilitiesNetworksProps) {
  return otherProjects.length > 0 ? (
    <section className="border-t border-[#d5d5d5] bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6"><div><p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#777777]">Archive</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#383838] sm:text-6xl">Explore the catalogue.</h2></div><Link href="/projects" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#777777] transition hover:text-[#1342FF]">All projects ↗</Link></div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">{otherProjects.map((otherProject, index) => <ProjectCatalogCard key={otherProject.slug} project={otherProject} index={index} />)}</div>
      </div>
    </section>
  ) : null
}
