"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import CornerDot from '@/components/ui/CornerDot'
import HoverTextHighlight from '@/components/ui/HoverTextHighlight'
import InteractiveDotGrid from '@/components/ui/InteractiveDotGrid'

export default function HeroTitle() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const vibeItems = [
    { number: '01', label: 'VIBE CODING', image: '/v2/Service Section/Vibe Coding.png' },
    { number: '02', label: 'INNOVATE', image: '/v2/Service Section/Innovative.gif' },
    { number: '03', label: 'CREATE', image: '/v2/Service Section/Create.gif' },
    { number: '04', label: 'INSPIRE', image: '/v2/Service Section/Inspire.gif' },
  ]

  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white overflow-hidden min-h-[800px] lg:min-h-[900px]">
      <InteractiveDotGrid
        dotSize={1.5}
        dotSpacing={24}
        dotColor="#D5D5D5"
        backgroundColor="transparent"
        distortionRadius={120}
        distortionStrength={0.6}
        animationSpeed={0.12}
        glow={true}
        glowColor="#1342FF"
        showCursor={true}
      />
      
      <CornerDot position="tl" />
      <CornerDot position="tr" />
      
      <div className="relative p-4 sm:p-6 md:p-8 lg:p-12 z-10">
        {/* Desktop Layout - Grid System */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 lg:gap-x-12 relative min-h-[700px]">
          {/* Left Column (3 cols) - empty top space */}
          <div className="lg:col-span-3 relative flex flex-col justify-end pb-8">
            <div className="mt-auto">
              <HoverTextHighlight variant="background" direction="left-to-right">
                <h3 className="text-[clamp(100px,12vw,160px)] font-black text-[#424242] tracking-tight leading-[0.85] flex flex-col">
                  <span>The</span>
                  <span>Journey</span>
                </h3>
              </HoverTextHighlight>
            </div>
          </div>

          {/* Right Column: Career Path & Milestones + Content (9 cols) */}
          <div className="lg:col-span-9">
            <div className="mb-6 lg:mb-8">
              <HoverTextHighlight variant="background" direction="left-to-right">
                <h2 
                  className="text-[clamp(48px,6vw,87px)] font-black text-[#424242] tracking-tight leading-[clamp(60px,8vw,114px)] text-right"
                  style={{
                    fontFamily: 'var(--font-geist, "Geist", sans-serif)',
                    fontWeight: 900,
                  }}
                >
                  Career Path & Milestones
                </h2>
              </HoverTextHighlight>
            </div>
          </div>

          {/* Bottom Right VIBE Items with Image Preview - Desktop only */}
          <div className="absolute bottom-8 right-12 hidden lg:flex lg:items-end lg:gap-6">
            <AnimatePresence>
              {hoveredItem !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-[280px] h-[200px] flex-shrink-0 rounded-lg overflow-hidden border border-[#d5d5d5]"
                >
                  <Image
                    src={vibeItems[hoveredItem].image}
                    alt={vibeItems[hoveredItem].label}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-2 max-w-md">
              {vibeItems.map((item, index) => (
                <div
                  key={`bottom-${item.number}`}
                  className="flex items-center justify-between py-3 px-4 border-b border-[#d5d5d5] cursor-pointer transition-all duration-300 rounded-lg hover:bg-[#f5f5f5]"
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <h2 className={`text-[clamp(18px,2.2vw,26px)] font-black transition-colors duration-300 ${
                    hoveredItem === index ? 'text-[#1342FF]' : 'text-[#424242]'
                  }`}>
                    {item.label}
                  </h2>
                  <span className={`text-[clamp(12px,1.5vw,16px)] font-semibold transition-colors duration-300 ${
                    hoveredItem === index ? 'text-[#FF4444]' : 'text-[#424242]'
                  }`}>
                    {`{${item.number}}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          <div className="mb-8">
            <HoverTextHighlight variant="background" direction="left-to-right">
              <h1 className="text-[clamp(64px,12vw,120px)] font-black text-[#424242] tracking-tight leading-[0.9]">
                The Journey
              </h1>
            </HoverTextHighlight>
          </div>

          <div className="mb-6">
            <HoverTextHighlight variant="background" direction="left-to-right">
              <h2 className="text-[clamp(48px,6vw,87px)] font-black text-[#424242] tracking-tight leading-[0.9]">
                Career Path & Milestones
              </h2>
            </HoverTextHighlight>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#d5d5d5]">
              <h2 className="text-[clamp(18px,2.2vw,24px)] font-black text-[#1342FF]">
                VIBE CODING
              </h2>
              <span className="text-[clamp(12px,1.5vw,16px)] font-semibold text-[#FF4444]">
                {'{01}'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#d5d5d5]">
              <h2 className="text-[clamp(20px,2.5vw,28px)] font-black text-[#424242]">
                INNOVATE
              </h2>
              <span className="text-[clamp(12px,1.5vw,16px)] font-medium text-[#666666]">
                {'{02}'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#d5d5d5]">
              <h2 className="text-[clamp(20px,2.5vw,28px)] font-black text-[#424242]">
                CREATE
              </h2>
              <span className="text-[clamp(12px,1.5vw,16px)] font-medium text-[#666666]">
                {'{03}'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#d5d5d5]">
              <h2 className="text-[clamp(20px,2.5vw,28px)] font-black text-[#424242]">
                INSPIRE
              </h2>
              <span className="text-[clamp(12px,1.5vw,16px)] font-medium text-[#666666]">
                {'{04}'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
