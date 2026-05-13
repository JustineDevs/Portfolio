"use client"

import React from 'react'
import CornerDot from '@/components/ui/CornerDot'

interface StoryResponsibilitiesProps {
  storyTitle?: string
  storyParagraphs?: string[]
  responsibilitiesTitle?: string
  responsibilitiesHeading?: string
  responsibilitiesParagraphs?: string[]
}

export default function StoryResponsibilities({
  storyTitle = "",
  storyParagraphs = [],
  responsibilitiesTitle = "",
  responsibilitiesHeading = "",
  responsibilitiesParagraphs = [],
}: StoryResponsibilitiesProps) {
  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="bl" className="hidden xs:block" />
      <CornerDot position="br" className="hidden xs:block" />
      
<div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#d5d5d5]">
            <h2 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] font-bold text-[#424242] mb-4 xs:mb-5 sm:mb-6 tracking-[-0.01em]">{storyTitle}</h2>
            <div className="space-y-3 xs:space-y-4 text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.7] text-[#555555]">
              {storyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12">
            <h2 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] font-bold text-[#424242] mb-4 xs:mb-5 sm:mb-6 tracking-[-0.01em]">{responsibilitiesTitle}</h2>
            <div className="space-y-4 xs:space-y-5 sm:space-y-6">
              <div>
                <h3 className="text-[14px] xs:text-[15px] sm:text-[16px] font-semibold text-[#424242] mb-2 xs:mb-3">
                  {responsibilitiesHeading}
                </h3>
                {responsibilitiesParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={`text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.7] text-[#555555] ${index === 0 ? 'mb-3 xs:mb-4' : ''}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}
