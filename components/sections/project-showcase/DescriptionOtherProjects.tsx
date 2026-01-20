'use client'

import Link from 'next/link'
import { getProjectBySlug, getOtherProjects, projects } from '@/lib/projects'
import LiquidImage from '@/components/ui/LiquidImage'

interface DescriptionOtherProjectsProps {
  slug: string
}

export default function DescriptionOtherProjects({ slug }: DescriptionOtherProjectsProps) {
  const project = getProjectBySlug(slug) || projects.hyperkit
  const otherProjects = getOtherProjects(slug, 2)

  return (
    <section className="bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="border-l border-r border-b border-[#d5d5d5]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="border-b lg:border-b-0 lg:border-r border-[#d5d5d5]">
              <div className="border-b border-[#d5d5d5] px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#424242]">Description</h2>
              </div>
              <div className="p-4 sm:p-6">
                {project.longDescription ? (
                  <div className="space-y-3 sm:space-y-4">
                    {project.longDescription.map((paragraph, index) => (
                      <p key={index} className="text-sm sm:text-base text-[#666666] leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-[#666666] leading-relaxed">{project.description}</p>
                )}
              </div>
            </div>

            <div>
              <div className="border-b border-[#d5d5d5] px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#424242]">Other Projects</h2>
              </div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {otherProjects.map((otherProject) => (
                  <Link
                    key={otherProject.slug}
                    href={`/projects/${otherProject.slug}`}
                    className="block group"
                  >
                    <div className="relative h-32 sm:h-40 rounded-xl overflow-hidden bg-[#424242]">
                      {otherProject.bannerImage || otherProject.coverImage ? (
                        <LiquidImage
                          src={otherProject.bannerImage || otherProject.coverImage}
                          alt={otherProject.title}
                          strength={0.4}
                          speed={0.6}
                          size={0.7}
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between">
                        <h3 className="text-white text-sm sm:text-base font-semibold">{otherProject.title}</h3>
                        <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-lg group-hover:bg-white/30 transition min-h-[36px] sm:min-h-[40px] flex items-center">
                          View
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/projects"
                  className="block text-center py-2.5 sm:py-3 border border-[#d5d5d5] rounded-lg hover:bg-white transition text-[#424242] text-sm sm:text-base font-medium min-h-[44px] flex items-center justify-center"
                >
                  See more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
