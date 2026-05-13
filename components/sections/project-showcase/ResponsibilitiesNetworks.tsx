'use client'

import type { PublicProject } from '@/lib/content/types'

interface ResponsibilitiesNetworksProps {
  project: PublicProject
}

export default function ResponsibilitiesNetworks({ project }: ResponsibilitiesNetworksProps) {
  return (
    <section className="bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="border-l border-r border-b border-[#d5d5d5]">
          <div>
            <div className="border-b border-[#d5d5d5] px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#424242]">Responsibilities</h2>
            </div>
            <div className="p-4 sm:p-6">
              {(project.tags.length > 0 || project.technologies.length > 0) && (
                <div className="mb-6 space-y-5 sm:mb-8">
                  {project.tags.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#666666]">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span
                            key={`${tag}-${index}`}
                            className="inline-flex min-h-[36px] items-center rounded-full border border-[#d5d5d5] bg-white px-3 py-1.5 text-xs font-semibold text-[#424242]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.technologies.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#666666]">Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((technology, index) => (
                          <span
                            key={`${technology}-${index}`}
                            className="inline-flex min-h-[36px] items-center rounded-full border border-[#d5d5d5] bg-[#424242] px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <h3 className="text-base sm:text-lg font-semibold text-[#424242] mb-3 sm:mb-4">My Responsibilities</h3>
              {project.responsibilities && (
                <ul className="space-y-2 sm:space-y-3">
                  {project.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-[#666666]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#424242] mt-1.5 sm:mt-2 shrink-0"></span>
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {project.links.length > 0 && (
          <div className="border-l border-r border-b border-[#d5d5d5]">
            <div className="border-b border-[#d5d5d5] px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#424242]">Project Links</h2>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">Key links and references for this project.</p>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {project.links.map((link, index) => (
                <a
                  key={`${link.type}-${index}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-lg border border-[#d5d5d5] px-4 py-3 text-sm text-[#424242] transition hover:bg-white"
                >
                  <span className="font-medium">{link.label || link.type}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#666666]">{link.type}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
