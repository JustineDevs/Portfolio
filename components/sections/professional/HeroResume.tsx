"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import CornerDot from '@/components/ui/CornerDot'
import ScheduleCallModal from '@/components/ui/ScheduleCallModal'

export default function HeroResume() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)

  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="tl" className="hidden xs:block" />
      <CornerDot position="tr" className="hidden xs:block" />
      
      <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 sm:gap-8">
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] rounded-full border-4 border-white shadow-lg overflow-hidden">
              <Image
                src="/Justinedevs_Banner.png"
                alt="Justine Lupasi"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col justify-center text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-center lg:items-center gap-2 sm:gap-3 mb-2 justify-center lg:justify-start">
              <h1 className="text-[28px] xs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] font-bold text-[#424242] tracking-tight">
                Justine Lupasi
              </h1>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#1342FF] hidden sm:block">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-2 text-[12px] sm:text-[14px] text-[#666666] mb-3 sm:mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Metro Manila, Philippines</span>
            </div>

            <p className="text-[14px] sm:text-[16px] font-semibold text-[#424242] mb-4 sm:mb-6">
              Technical Founder | Web3 Architect
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <a
                href="https://x.com/Trader2G"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-[#d5d5d5] hover:bg-[#f5f5f5] transition-colors"
                aria-label="X (Twitter)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#424242]">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/justine-lupasi-444608295"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-[#d5d5d5] hover:bg-[#f5f5f5] transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#424242]">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@justinedevs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-[#d5d5d5] hover:bg-[#f5f5f5] transition-colors"
                aria-label="TikTok"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#424242]">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>

              <div className="flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <a 
                  href="https://cal.com/justinedevs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full xs:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[#424242] text-white text-[13px] sm:text-[14px] font-medium rounded-lg hover:opacity-90 transition-opacity min-h-[44px] flex items-center justify-center"
                >
                  Schedule a Call
                </a>
              <button className="w-full xs:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-[#d5d5d5] text-[#424242] text-[13px] sm:text-[14px] font-medium rounded-lg hover:bg-[#f5f5f5] transition-colors min-h-[44px]">
                Community
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#d5d5d5]">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#424242] mb-3 sm:mb-4 tracking-[-0.01em]">About</h2>
          <div className="space-y-3 sm:space-y-4 text-[13px] sm:text-[14px] leading-[1.7] text-[#555555]">
            <p>
              I build AI-augmented products, blockchain tools, and modern web applications. My work spans front-end
              development, responsive web apps, authentication systems, developer tooling, crypto automation, and
              decentralized systems.
            </p>
            <p>
              As <span className="font-semibold text-[#1342FF]">Co-Founder of HyperKit Labs</span>, I work on developer
              infrastructure and AI-native tooling for the Web3 ecosystem, including projects connected to multi-chain smart
              contract workflows and product experimentation.
            </p>
            <p>
              I also bring community experience from{' '}
              <span className="font-semibold text-[#1342FF]">Web3 moderation</span>, where I&apos;ve supported onboarding,
              discussions, and technical guidance across Discord communities since 2023. I&apos;m especially interested in{' '}
              <span className="font-semibold text-[#1342FF]">product architecture, systems thinking</span>, and building tools
              that are practical, usable, and technically grounded.
            </p>
          </div>
        </div>
      </div>

      <ScheduleCallModal 
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        calendlyUrl="https://calendly.com/your-username"
      />
    </section>
  )
}

