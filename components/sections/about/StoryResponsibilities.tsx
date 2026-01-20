"use client"

import React from 'react'
import CornerDot from '@/components/ui/CornerDot'

export default function StoryResponsibilities() {
  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="bl" className="hidden xs:block" />
      <CornerDot position="br" className="hidden xs:block" />
      
<div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#d5d5d5]">
            <h2 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] font-bold text-[#424242] mb-4 xs:mb-5 sm:mb-6 tracking-[-0.01em]">Story</h2>
            <div className="space-y-3 xs:space-y-4 text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.7] text-[#555555]">
              <p>
                I&apos;m a builder who lives at the intersection of code, markets, and communities. 
                I treat the browser as a control panel for complex systems. My journey started with user 
                interfaces, but I quickly moved to infrastructure—designing workflows that help teams 
                ship faster and safer.
              </p>
            </div>
          </div>

          <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12">
            <h2 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] font-bold text-[#424242] mb-4 xs:mb-5 sm:mb-6 tracking-[-0.01em]">Responsibilities</h2>
            <div className="space-y-4 xs:space-y-5 sm:space-y-6">
              <div>
                <h3 className="text-[14px] xs:text-[15px] sm:text-[16px] font-semibold text-[#424242] mb-2 xs:mb-3">
                  I Don&apos;t Wait for Permission. I Build the Whole Stack.
                </h3>
                <p className="text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.7] text-[#555555] mb-3 xs:mb-4">
                  End-to-end accountability. From whiteboard to production in 72 hours. I build SDKs, 
                  design APIs, and ship features that work. I prioritize security and system design over 
                  superficial aesthetics.
                </p>
                <p className="text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.7] text-[#555555]">
                  End-to-end accountability. From whiteboard to production in 72 hours. I build SDKs, 
                  design APIs, and ship features that work. I prioritize security and system design over 
                  superficial aesthetics.
                </p>
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}
