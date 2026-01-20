"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CornerDot from '@/components/ui/CornerDot'
import Ecosystem, { OrbitingCircles } from '@/components/ui/Ecosystem'
import { 
  N8nIcon, FramerIcon, FigmaIcon, RustIcon, MoveIcon,
  VisualBasicIcon, CIcon, JavaScriptIcon, JavaIcon, MySQLIcon,
  UnrealIcon, HTML5Icon, TailwindIcon,
  SolidityIcon, PythonIcon, TypeScriptIcon, ReactIcon, NodeIcon, MongoIcon, SupabaseIcon
} from '@/components/ui/TechIcons'

export default function TimelineNavigationSection() {
  const [activeStage, setActiveStage] = useState(0)

  const stages = [
    {
      id: 'founder',
      title: 'The Founder (Present)',
      shortTitle: 'THE FOUNDER',
      subtitle: '"Building the Future"',
      period: '(2026 - Present)',
      languagesLabel: 'Workflow & Designing:',
      languages: 'N8N, | ComfyUI | Framer | Figma | Rust (Solana) | Move (Sui)',
      quote: "Now I'm asking: 'What impact do I create?'",
      milestone: 'Multi-chain infrastructure at scale ($100k ARR target)',
      milestoneLabel: 'Vision:',
      icons: [
        { name: 'N8N', icon: N8nIcon },
        { name: 'Framer', icon: FramerIcon },
        { name: 'Figma', icon: FigmaIcon },
        { name: 'Rust', icon: RustIcon },
        { name: 'Move', icon: MoveIcon },
      ],
    },
    {
      id: 'breakthrough',
      title: 'The Breakthrough (The "Proof")',
      shortTitle: 'THE BREAKTHROUGH',
      subtitle: '"From Builder to Product Owner"',
      period: '(May - Aug 2025)',
      languagesLabel: 'Languages:',
      languages: 'Solidity | Python | TypeScript | JavaScript | React | Node.js | MongoDB | Supabase',
      quote: '"I shipped HyperAgent and won Metis & Avalanche hackathon."',
      milestone: '',
      milestoneLabel: '',
      icons: [
        { name: 'Solidity', icon: SolidityIcon },
        { name: 'Python', icon: PythonIcon },
        { name: 'TypeScript', icon: TypeScriptIcon },
        { name: 'JavaScript', icon: JavaScriptIcon },
        { name: 'React', icon: ReactIcon },
        { name: 'Node.js', icon: NodeIcon },
        { name: 'MongoDB', icon: MongoIcon },
        { name: 'Supabase', icon: SupabaseIcon },
      ],
    },
    {
      id: 'pivot',
      title: 'The Pivot (The Transition)',
      shortTitle: 'THE PIVOT',
      subtitle: '"Backend Only → Fullstack"',
      period: '(Feb - Apr 2025)',
      languagesLabel: 'Languages:',
      languages: 'Unreal Engine | HTML5 | Tailwind CSS |',
      quote: '"I realized backend isn\'t the whole picture."',
      milestone: 'First web & desktop app',
      milestoneLabel: 'Milestone:',
      icons: [
        { name: 'Unreal Engine 5', icon: UnrealIcon },
        { name: 'HTML5', icon: HTML5Icon },
        { name: 'Tailwind CSS', icon: TailwindIcon },
      ],
    },
    {
      id: 'foundation',
      title: 'The Foundation (The Origin)',
      shortTitle: 'THE FOUNDATION',
      subtitle: '"Hello World"',
      period: '(June 2024 - Jan 2025)',
      languagesLabel: 'Languages:',
      languages: 'C | MySQL | Java | Visual Basic',
      quote: '"I didn\'t know if I could code. I learned the hard way."',
      milestone: 'First database connection',
      milestoneLabel: 'Milestone:',
      icons: [
        { name: 'C Language', icon: CIcon },
        { name: 'MySQL', icon: MySQLIcon },
        { name: 'Java', icon: JavaIcon },
        { name: 'Visual Basic', icon: VisualBasicIcon },
      ],
    },
  ]

  const learningPathTools = [
    { name: 'n8n', icon: N8nIcon },
    { name: 'Framer', icon: FramerIcon },
    { name: 'Figma', icon: FigmaIcon },
    { name: 'Rust', icon: RustIcon },
    { name: 'Move', icon: MoveIcon },
  ]

  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white" data-border="true">
      <CornerDot position="bl" className="hidden xs:block" />
      <CornerDot position="br" className="hidden xs:block" />
      
      <div className="flex flex-col lg:flex-row">
        {/* Left Column: Timeline Navigation with Borders */}
        <div className="lg:w-[45%] xl:w-[40%] shrink-0 border-b lg:border-b-0 lg:border-r border-[#d5d5d5]">
          {/* Timeline Navigation List - Each item has border dividers */}
          <div className="flex flex-col">
            {stages.map((stage, index) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(index)}
                onMouseEnter={() => setActiveStage(index)}
                className={`relative w-full text-left transition-all group ${
                  index !== stages.length - 1 ? 'border-b border-[#d5d5d5]' : ''
                }`}
                data-border="true"
              >
                {/* Top decorative line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-transparent" />
                
                {/* Content container */}
                <div className={`relative flex items-center justify-between px-4 xs:px-5 sm:px-6 md:px-8 py-4 xs:py-5 sm:py-6 transition-all ${
                  activeStage === index
                    ? 'bg-[#F8F8F8]'
                    : 'bg-white hover:bg-[#FAFAFA]'
                }`}>
                  {/* Left side: indicator dot + title */}
                  <div className="flex items-center gap-3 xs:gap-4">
                    {/* Active indicator dot */}
                    <div className={`w-2 h-2 xs:w-2.5 xs:h-2.5 rounded-full transition-all ${
                      activeStage === index
                        ? 'bg-[#1342FF]'
                        : 'bg-[#d5d5d5] group-hover:bg-[#424242]'
                    }`} />
                    
                    <h2 className={`text-[14px] xs:text-[16px] sm:text-[18px] md:text-[20px] font-bold tracking-[-0.01em] transition-colors ${
                      activeStage === index
                        ? 'text-[#424242]'
                        : 'text-[#666666] group-hover:text-[#424242]'
                    }`}>
                      {stage.title}
                    </h2>
                  </div>
                  
                  {/* Right side: arrow indicator */}
                  <div className={`transition-all ${
                    activeStage === index
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                  }`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#424242]">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                {/* Bottom decorative line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-transparent" />
              </button>
            ))}
          </div>

            {/* Learning Path Section with border */}
            <div className="border-t border-[#d5d5d5] px-4 xs:px-5 sm:px-6 md:px-8 py-5 xs:py-6 sm:py-8">
              <h3 className="text-[12px] xs:text-[13px] sm:text-[14px] font-semibold text-[#424242] mb-4 xs:mb-5 tracking-wide uppercase">
                Learning Path
              </h3>
              <div className="flex flex-wrap gap-2 xs:gap-3">
                {learningPathTools.map((tool, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-lg border border-[#d5d5d5] bg-white flex items-center justify-center hover:border-[#424242] hover:bg-[#F8F8F8] transition-all cursor-pointer"
                    title={tool.name}
                  >
                    <tool.icon className="w-5 h-5 xs:w-6 xs:h-6 text-[#424242]" />
                  </div>
                ))}
              </div>
            </div>
        </div>

          {/* Right Column: Timeline Detail Card */}
          <div className="flex-1 flex flex-col">
            {/* Spiral Visualization Card - Dark Background with Title */}
            <div className="border-b border-[#d5d5d5]">
                <div className="relative w-full h-[200px] xs:h-[220px] sm:h-[260px] md:h-[280px] bg-[#424242] flex items-center justify-center overflow-hidden">
                  <Ecosystem
                    mainCircleSize={60}
                    mainCircleOpacity={0.12}
                    numCircles={6}
                  >
                    {(() => {
                      const currentIcons = stages[activeStage].icons;
                      const totalIcons = currentIcons.length;
                      const innerCount = Math.min(Math.floor(totalIcons / 2), 4);
                      const innerIcons = currentIcons.slice(0, innerCount);
                      const outerIcons = currentIcons.slice(innerCount);

                      return (
                        <>
                          {innerIcons.length > 0 && (
                            <OrbitingCircles
                              radius={70}
                              duration={25}
                              delay={6}
                              iconSize={28}
                              path={true}
                            >
                              {innerIcons.map((iconItem, index) => (
                                <div
                                  key={`inner-${index}`}
                                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center border border-white/20"
                                >
                                  <iconItem.icon className="w-4 h-4 text-white" />
                                </div>
                              ))}
                            </OrbitingCircles>
                          )}
                          {outerIcons.length > 0 && (
                            <OrbitingCircles
                              radius={110}
                              duration={30}
                              delay={7.5}
                              iconSize={32}
                              path={true}
                              reverse={true}
                            >
                              {outerIcons.map((iconItem, index) => (
                                <div
                                  key={`outer-${index}`}
                                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20"
                                >
                                  <iconItem.icon className="w-5 h-5 text-white" />
                                </div>
                              ))}
                            </OrbitingCircles>
                          )}
                        </>
                      );
                    })()}
                  </Ecosystem>
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-32 h-16 xs:w-40 xs:h-20 sm:w-48 sm:h-24 pointer-events-auto">
                    {stages.map((_, index) => {
                      const angle = (index * 90) - 90
                      const radius = 100
                      const x = 50 + radius * Math.cos((angle * Math.PI) / 180)
                      const y = 50 + radius * Math.sin((angle * Math.PI) / 180)
                      
                      return (
                        <button
                          key={index}
                          onClick={() => setActiveStage(index)}
                          onMouseEnter={() => setActiveStage(index)}
                          className={`absolute w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 rounded-full transition-all cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                            index === activeStage
                              ? 'bg-white scale-150 z-10 shadow-lg'
                              : 'bg-white/40 hover:bg-white/70'
                          }`}
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`title-bar-${activeStage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="bg-[#424242] border-t border-[#555555] px-4 xs:px-5 sm:px-6 md:px-8 py-3 xs:py-4"
                >
                  <h4 className="text-[16px] xs:text-[18px] sm:text-[22px] md:text-[26px] font-bold text-white tracking-[-0.01em] italic">
                    {stages[activeStage].title}
                  </h4>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Content Section - Light Background */}
            <div className="flex-1 bg-[#F8F8F8]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${activeStage}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 xs:px-5 sm:px-6 md:px-8 py-4 xs:py-5 sm:py-6"
                >
                  <div className="mb-4 xs:mb-5">
                    <h5 className="text-[13px] xs:text-[14px] sm:text-[15px] font-bold text-[#424242] mb-1">
                      {stages[activeStage].shortTitle}
                    </h5>
                    <p className="text-[12px] xs:text-[13px] sm:text-[14px] text-[#666666]">
                      <span className="italic">{stages[activeStage].subtitle}</span>
                      <span className="ml-1">{stages[activeStage].period}</span>
                    </p>
                    <p className="text-[11px] xs:text-[12px] sm:text-[13px] text-[#666666] mt-1">
                      <span className="font-semibold">{stages[activeStage].languagesLabel}</span>{' '}
                      {stages[activeStage].languages}
                    </p>
                    <p className="text-[11px] xs:text-[12px] sm:text-[13px] text-[#555555] mt-2 italic">
                      {stages[activeStage].quote}
                    </p>
                    {stages[activeStage].milestone && (
                      <p className="text-[11px] xs:text-[12px] sm:text-[13px] text-[#666666] mt-1">
                        <span className="font-semibold">{stages[activeStage].milestoneLabel}</span>{' '}
                        {stages[activeStage].milestone}
                      </p>
                    )}
                  </div>

                  {/* Tech Icons Grid */}
                  <div className="border-t border-[#E5E5E5] pt-4 xs:pt-5">
                    <div className="flex flex-wrap gap-4 xs:gap-5 sm:gap-6">
                      {stages[activeStage].icons.map((iconItem, iconIndex) => (
                        <div key={iconIndex} className="flex flex-col items-center gap-1.5">
                          <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                            <iconItem.icon className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-[#424242]" />
                          </div>
                          <span className="text-[9px] xs:text-[10px] sm:text-[11px] text-[#666666] text-center">
                            {iconItem.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
      </div>
    </section>
  )
}

