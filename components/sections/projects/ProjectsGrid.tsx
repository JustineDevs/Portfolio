"use client"

import React from "react"
import Link from "next/link"
import CornerDot from "@/components/ui/CornerDot"
import LiquidImage from "@/components/ui/LiquidImage"
import type { PublicProject } from "@/lib/content/types"

export default function ProjectsGrid({ projects }: { projects: PublicProject[] }) {
  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="bl" className="hidden xs:block" />
      <CornerDot position="br" className="hidden xs:block" />

      <div className="p-3 xs:p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 md:gap-6 lg:gap-8">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group relative overflow-hidden rounded-xl bg-[#424242] h-[200px] xs:h-[220px] sm:h-[250px] md:h-[280px] border border-[#d5d5d5]"
            >
              <div className="absolute inset-0 z-0">
                <LiquidImage
                  src={project.bannerImageUrl || project.coverImageUrl || "/v2/showcase/banner.png"}
                  alt={project.title}
                  strength={0.4}
                  speed={0.6}
                  size={0.8}
                />
              </div>

              <div className="absolute inset-0 z-10 p-3 xs:p-4 sm:p-5 flex flex-col justify-between pointer-events-none">
                <div>
                  <h3 className="text-white text-[14px] xs:text-[16px] sm:text-[18px] font-bold mb-1">
                    {project.title.toUpperCase()}
                  </h3>
                  {project.summary && (
                    <p className="text-white/80 text-[10px] xs:text-[11px] sm:text-[12px] leading-tight mb-1 xs:mb-2 line-clamp-2">
                      {project.summary}
                    </p>
                  )}
                  {project.websiteUrl && (
                    <p className="text-white/60 text-[9px] xs:text-[10px] truncate">{project.websiteUrl}</p>
                  )}
                </div>

                <div className="flex items-end justify-end">
                  <div className="flex items-center gap-1.5 px-3 xs:px-4 py-1 xs:py-1.5 text-[10px] xs:text-[11px] font-medium text-white rounded-full bg-white/15 backdrop-blur-sm border border-white/20 group-hover:bg-white/25 transition-all">
                    &lt; View
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
