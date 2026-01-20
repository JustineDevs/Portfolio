"use client"

import React from 'react'
import CornerDot from '@/components/ui/CornerDot'

export default function StrengthsHowVision() {
  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="bl" className="hidden xs:block" />
      <CornerDot position="br" className="hidden xs:block" />
      
<div className="grid grid-cols-1 md:grid-cols-3">
          <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12 border-b md:border-b-0 md:border-r border-[#d5d5d5]">
            <h2 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] font-bold text-[#424242] mb-4 xs:mb-5 sm:mb-6 tracking-[-0.01em]">
              Strengths & Weaknesses
            </h2>
            <div className="space-y-3 xs:space-y-4 text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.7] text-[#555555]">
              <p>
                <strong className="text-[#424242]">Systems thinking:</strong> I see patterns across domains. 
                I break complex problems into small, testable moves. <strong className="text-[#424242]">Bias toward action:</strong> 
                I ship fast, learn faster. I&apos;m comfortable with ambiguity and willing to learn in public. 
                <strong className="text-[#424242]"> Consistency:</strong> I show up. I&apos;ve been a Web3 community 
                moderator since 2022, evolving from volunteer to paid projects.
              </p>
              <p>
                <strong className="text-[#424242]">Weaknesses:</strong> I overthink. I struggle to delegate. 
                I have finite social energy. I&apos;m working on these.
              </p>
            </div>
          </div>

          <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12 border-b md:border-b-0 md:border-r border-[#d5d5d5]">
            <h2 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] font-bold text-[#424242] mb-4 xs:mb-5 sm:mb-6 tracking-[-0.01em]">
              How am I think?
            </h2>
            <div className="space-y-3 xs:space-y-4 text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.7] text-[#555555]">
              <p>
                My mental model is a graph. I break problems into small, testable moves. I have a 
                pattern-seeking instinct—I encode solutions into tools. I prefer building over talking.
              </p>
            </div>
          </div>

          <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12">
            <h2 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] font-bold text-[#424242] mb-4 xs:mb-5 sm:mb-6 tracking-[-0.01em]">
              What my vision?
            </h2>
            <div className="text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.7] text-[#555555]">
              <p>
                I want complex digital systems to feel natural and transparent. I want people to interact 
                with programmable money, automation, and governance without needing to see the underlying 
                machinery. I&apos;m building interfaces that feel calm over powerful engines.
              </p>
            </div>
          </div>
        </div>
    </section>
  )
}
