"use client"

import React from 'react'
import CornerDot from '@/components/ui/CornerDot'

interface StrengthsHowVisionProps {
  strengthsTitle?: string
  strengthsBody?: string[]
  thinkingTitle?: string
  thinkingBody?: string[]
  visionTitle?: string
  visionBody?: string[]
}

export default function StrengthsHowVision({
  strengthsTitle = "",
  strengthsBody = [],
  thinkingTitle = "",
  thinkingBody = [],
  visionTitle = "",
  visionBody = [],
}: StrengthsHowVisionProps) {
  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="bl" className="hidden xs:block" />
      <CornerDot position="br" className="hidden xs:block" />
      
<div className="grid grid-cols-1 md:grid-cols-3">
          <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12 border-b md:border-b-0 md:border-r border-[#d5d5d5]">
            <h2 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] font-bold text-[#424242] mb-4 xs:mb-5 sm:mb-6 tracking-[-0.01em]">
              {strengthsTitle}
            </h2>
            <div className="space-y-3 xs:space-y-4 text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.7] text-[#555555]">
              {strengthsBody.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12 border-b md:border-b-0 md:border-r border-[#d5d5d5]">
            <h2 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] font-bold text-[#424242] mb-4 xs:mb-5 sm:mb-6 tracking-[-0.01em]">
              {thinkingTitle}
            </h2>
            <div className="space-y-3 xs:space-y-4 text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.7] text-[#555555]">
              {thinkingBody.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12">
            <h2 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] font-bold text-[#424242] mb-4 xs:mb-5 sm:mb-6 tracking-[-0.01em]">
              {visionTitle}
            </h2>
            <div className="text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.7] text-[#555555]">
              {visionBody.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
    </section>
  )
}
