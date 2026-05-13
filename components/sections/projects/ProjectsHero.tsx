"use client"

import React from 'react'
import CornerDot from '@/components/ui/CornerDot'

export default function ProjectsHero() {
  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="tl" className="hidden xs:block" />
      <CornerDot position="tr" className="hidden xs:block" />
      
      <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12">
        <h1 className="text-[28px] xs:text-[36px] sm:text-[42px] md:text-[48px] lg:text-[64px] font-bold text-[#424242] tracking-tight mb-4 xs:mb-5 sm:mb-6 leading-tight">
          Project Featured Showcase
        </h1>
        
        <p className="text-[13px] xs:text-[14px] sm:text-[16px] lg:text-[18px] text-[#666666] mb-5 xs:mb-6 sm:mb-8 max-w-2xl">
          Explore websites and projects what I built. Each example demonstrates my innovation development.
        </p>

        <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 flex-wrap">
          <a
            href="https://x.com/Trader2G"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 xs:w-10 xs:h-10 flex items-center justify-center rounded-lg border border-[#d5d5d5] hover:bg-[#f5f5f5] transition-colors"
            aria-label="X (Twitter)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#424242] xs:w-[18px] xs:h-[18px]">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/justine-lupasi-444608295"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 xs:w-10 xs:h-10 flex items-center justify-center rounded-lg border border-[#d5d5d5] hover:bg-[#f5f5f5] transition-colors"
            aria-label="LinkedIn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#424242] xs:w-[18px] xs:h-[18px]">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://github.com/justinedevs"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 xs:w-10 xs:h-10 flex items-center justify-center rounded-lg border border-[#d5d5d5] hover:bg-[#f5f5f5] transition-colors"
            aria-label="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#424242] xs:w-[18px] xs:h-[18px]">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://t.me/TraderGOfficial"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 xs:w-10 xs:h-10 flex items-center justify-center rounded-lg border border-[#d5d5d5] hover:bg-[#f5f5f5] transition-colors"
            aria-label="Telegram"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#424242] xs:w-[18px] xs:h-[18px]">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.169 1.858-.896 6.562-1.268 8.695-.162.938-.48 1.251-.788 1.283-.664.062-1.168-.438-1.812-.861-1.003-.672-1.57-1.09-2.543-1.745-1.004-.677-.353-1.05.218-1.658.15-.157 2.706-2.482 2.756-2.694.006-.02.011-.096-.056-.134-.067-.039-.165-.024-.236-.014-.101.013-1.694 1.078-4.784 3.168-.453.316-.863.47-1.232.462-.408-.008-1.191-.23-1.774-.42-.714-.234-1.283-.36-1.234-.761.024-.197.325-.4.895-.618 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.118.095.151.223.167.313.014.09.032.297.017.459z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
