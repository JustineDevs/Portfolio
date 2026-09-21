import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { PublicProject } from "@/lib/content/types"
import { getRenderableImageUrl, shouldUseUnoptimizedImage } from "@/lib/asset-urls"

export function ProjectCard({ project, index }: { project: PublicProject; index: number }) {
  const image = project.bannerImageUrl || project.coverImageUrl || "/v2/showcase/banner.png"
  const href = `/projects/${project.slug}`

  return (
    <li className="group min-w-0">
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#383838] focus-visible:ring-offset-4">
        <div className="relative aspect-[1.4] overflow-hidden rounded-xl bg-[#424242] p-8 sm:p-12" style={{ viewTransitionName: `project-media-${project.slug}` }}>
          <Image
            src={getRenderableImageUrl(image)}
            alt={project.title}
            fill
            sizes="(min-width: 1280px) 31vw, (min-width: 768px) 47vw, 100vw"
            className="object-contain transition duration-500 ease-out group-hover:scale-[1.03]"
            unoptimized={shouldUseUnoptimizedImage(image)}
          />
          <div className="absolute inset-0 bg-[#383838]/0 transition-colors duration-300 group-hover:bg-[#383838]/15" />
          <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F8F8] text-[#383838] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <ArrowUpRight size={18} strokeWidth={1.7} aria-hidden="true" />
          </span>
        </div>

        <div className="flex items-start justify-between gap-5 border-b border-[#d5d5d5] pb-5 pt-5">
          <div className="min-w-0">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#777777]">
              {String(index + 1).padStart(2, "0")} / {project.category}
            </p>
            <h2 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-[#383838] transition-colors group-hover:text-[#666666] sm:text-xl">
              {project.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#666666] line-clamp-2">{project.summary}</p>
          </div>
          <span className="shrink-0 pt-0.5 text-xs text-[#777777]">View</span>
        </div>
      </Link>
    </li>
  )
}

export default function ProjectsGrid({ projects }: { projects: PublicProject[] }) {
  return (
    <section id="projects" className="border-x border-b border-[#d5d5d5] bg-[#F8F8F8]">
      <div className="px-4 py-8 xs:px-5 sm:px-8 md:px-12 md:py-10 lg:px-16">
        <ul className="grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2 xl:grid-cols-3 xl:gap-y-16">
          {projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
        </ul>
      </div>
    </section>
  )
}
