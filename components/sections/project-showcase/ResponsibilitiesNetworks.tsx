'use client'

import Image from 'next/image'
import { getProjectBySlug, projects } from '@/lib/projects'

interface ResponsibilitiesNetworksProps {
  slug: string
}

export default function ResponsibilitiesNetworks({ slug }: ResponsibilitiesNetworksProps) {
  const project = getProjectBySlug(slug) || projects.hyperkit

  return (
    <section className="bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="border-l border-r border-b border-[#d5d5d5]">
          <div>
            <div className="border-b border-[#d5d5d5] px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#424242]">Responsibilities</h2>
            </div>
            <div className="p-4 sm:p-6">
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

        {project.hackathons && project.hackathons.length > 0 && (
          <div className="border-l border-r border-b border-[#d5d5d5]">
            <div className="border-b border-[#d5d5d5] px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#424242]">Featured Badge</h2>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">Add this badge to your website to show you are featured on hackathon.</p>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {project.hackathons.map((hackathon, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[#d5d5d5] last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-[#424242] rounded-lg px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
                      <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                        <Image
                          src={hackathon.logo}
                          alt={hackathon.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] sm:text-xs text-white/60 block">
                          {hackathon.type === 'winning' ? 'Winning on' : 'Featured on'}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white">{hackathon.name}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#424242] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-[#333333] transition min-h-[44px] w-fit">
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
