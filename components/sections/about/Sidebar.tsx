"use client"

import React, { useState } from 'react'

const navSections = [
  {
    id: 'intuitive-engineering',
    title: '/Intuitive Engineering',
    description: 'Rapid Prototyping with Quality Gates',
    philosophy: 'Ship to Learn',
    link: 'How I Work',
    content: {
      heading: 'Rapid Prototyping with Quality Gates',
      intro: `I don't just write code; I architect systems using a "Ship to Learn" philosophy. My workflow combines high-velocity experimentation with strict engineering rigor.`,
      points: [
        `I possess the "Tier 1" ability to conceive, architect, and ship complete full-stack systems alone. I don't wait for permission; I build the MVP to prove the concept.`,
        `I use "vibe coding" as a strategic advantage rapidly trusting intuition to draft architecture, then ruthlessly validating it with 93.6% TypeScript coverage and automated testing.`,
        `I don't read books cover-to-cover. I learn by solving immediate architectural problems (e.g., learning Solidity to fix a smart contract bug in real-time).`,
        `I utilize AI not to write code for me, but as a force multiplier acting as a prompt engineer and critical reviewer to move 15-20x faster than traditional development cycles.`,
      ],
      summary: `Vibe → Prototype → Gate → Ship → Learn. 93% coverage. Dawn deployments.`,
      extended: `It hits at 2:17 AM that electric spark. I grab Figma, dump intuition: boxes, arrows, invariants. 27 minutes flat. Code follows like transcription standing MVP in 2 hours. Then the gauntlet: tests must hit 93% coverage or it burns. Red → green → ship. AI steps in as my scalpel: "Optimize this reducer." I dictate, it drafts, I carve truth. Deploy lands production in 8 minutes. Dashboard blinks: latency flat, errors zero. Dawn breaks, metrics whisper reality. What survives? What scales? That's not workflow it's how I breathe code into existence.`,
    },
  },
  {
    id: 'credible-technologist',
    title: '/The Credible Technologist',
    description: 'Should Be Autonomous',
    philosophy: 'Web3 as AI-Native and Network Agnostic',
    link: 'Tech Philosophy',
    content: {
      heading: 'Should Be Autonomous',
      intro: `I believe the future of Web3 is AI-Native and Network Agnostic. Technology is only useful if it solves human problems without friction.`,
      points: [
        `"It works on my machine" is not a strategy. I believe in strict type safety, CI/CD pipelines, and rigorous deployment standards (Vercel/Docker) from Day 1.`,
        `Users shouldn't care which chain they are on. Tools like HyperKit and x402 exist to abstract away the complexity of blockchain, making decentralized apps as seamless as Web2.`,
        `I believe in "Learning in Public." I share templates, starter kits, and documentation (Public-Github-Repo) because the best way to master a subject is to teach it.`,
        `I value logic over emotion. If a system is flawed, I acknowledge it immediately and fix it. No fluff, no hype just execution.`,
      ],
      summary: `Infinite Composability. Every module chains anywhere. Quality over velocity.`,
      extended: `Velocity without rigor is noise. I build for the chain that doesn't exist yet modules that snap into any protocol, any language, any ledger. Programming languages bow to invariants: pure functions, zero dependencies, 100% type safety. Frameworks? Temporary scaffolding. Standards endure. AI drafts the boilerplate; I forge the architecture. Every deploy measures truth: latency spikes, coverage gaps, edge failures. Philosophy isn't words it's the 17-hour debug session that ships perfect.`,
    },
  },
  {
    id: 'dual-mode-reality',
    title: '/Dual-Mode Reality',
    description: 'Expression Meets Utility',
    philosophy: 'Dual-Mode System...',
    link: 'Design Principles',
    content: {
      heading: 'Expression Meets Utility',
      intro: `My design philosophy rejects the idea that you have to choose between "creative" and "professional." My work embodies both via a Dual-Mode System.`,
      points: [
        `Content shouldn't be a dead end. My designs feature continuous discovery loops that encourage re-exploration, mirroring the iterative nature of software development.`,
        `Motion must have meaning. I use Parallax and Scroll-Triggered Animations not for decoration, but to control the pacing of the story and reveal complexity layer by layer.`,
        `Adaptive Context:\n  • Creative Mode: For visionaries and investors. It prioritizes immersion, 3D depth, and emotional connection.\n  • Professional Mode: For hiring managers and auditors. It prioritizes readability, data density, and clear hierarchy.`,
        `Mobile-First Performance: A portfolio must perform. I target Lighthouse 90+ scores and WCAG AA Accessibility, ensuring that visual richness never compromises usability or speed.`,
      ],
      summary: `Invisible Complexity. Visible Poetry. Systems that shimmer.`,
      extended: `Beauty without function is decoration. I design systems where complexity vanishes chromatic that refract 247-chain flows, cursor trails that map your interaction graph. Every hover distortion encodes intent. Two modes: Creative bleeds neon for dreamers; Professional snaps to monochrome for auditors. Same data, different poetry. Lighthouse demands 90+; I deliver 95. Accessibility isn't afterthought it's architecture.`,
    },
  },
]

export default function Sidebar() {
  const [activePanel, setActivePanel] = useState<string | null>(null)

  const handleClick = (id: string) => {
    setActivePanel(activePanel === id ? null : id)
  }

  const closeModal = () => {
    setActivePanel(null)
  }

  const activeContent = navSections.find(s => s.id === activePanel)

  return (
    <>
      <aside className="hidden lg:block w-[280px] shrink-0 border-r border-[#d5d5d5] bg-white sticky top-[101px] h-[calc(100vh-101px)] overflow-y-auto">
        <div className="p-6 border-b border-[#d5d5d5]">
          <p className="text-[12px] text-[#666666] mb-2">January 20, 2026</p>
          <h2 className="text-[20px] font-bold text-[#424242] tracking-[-0.01em]">About</h2>
          <h3 className="text-[16px] font-semibold text-[#424242] mt-4">Beyond Engineer Invisible Systems</h3>
        </div>

        <nav className="p-6 space-y-6">
          {navSections.map((section) => (
            <div
              key={section.id}
              className="group cursor-pointer p-3 -mx-3 rounded-lg border transition-all duration-200 border-transparent hover:border-[#d5d5d5] hover:bg-gray-50"
              onClick={() => handleClick(section.id)}
            >
              <div className="flex items-start justify-between">
                <h4 className="text-[14px] font-semibold text-[#424242] mb-2">{section.title}</h4>
                <div className="w-2 h-2 rounded-full mt-1.5 transition-colors bg-[#424242]" />
              </div>
              <p className="text-[13px] text-[#666666] leading-relaxed mb-1">{section.description}</p>
              <p className="text-[13px] text-[#666666] leading-relaxed mb-3">{section.philosophy}</p>
              <span className="text-left text-[12px] text-[#1342FF] font-medium hover:underline inline-block">
                {section.link} →
              </span>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-[#d5d5d5] mt-auto">
          <h3 className="text-[14px] font-semibold text-[#424242]">Blogs</h3>
        </div>
      </aside>

      {activeContent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="relative w-[90%] max-w-[710px] max-h-[85vh] bg-white rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white border border-[#d5d5d5] transition-colors"
            >
              <svg className="w-4 h-4 text-[#424242]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="h-[60px] bg-[#424242] flex items-center px-6">
              <h2 className="text-[22px] font-bold text-white">{activeContent.title}</h2>
            </div>

            <div className="px-6 py-6 space-y-5 overflow-y-auto max-h-[calc(85vh-60px)]">
              <p className="text-[14px] text-[#333] leading-relaxed">
                <strong>{activeContent.content.heading}</strong> {activeContent.content.intro}
              </p>

              {activeContent.content.points.map((point, idx) => (
                <p key={idx} className="text-[14px] text-[#333] leading-relaxed whitespace-pre-line">
                  {point}
                </p>
              ))}

              <p className="text-[14px] text-[#333] leading-relaxed">
                {activeContent.content.summary}
              </p>

              <p className="text-[14px] text-[#555] leading-relaxed">
                {activeContent.content.extended}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-[#d5d5d5]">
                <div className="w-3 h-3 rounded-full bg-[#424242]" />
                <div className="w-8 h-[1px] bg-[#d5d5d5]" />
                <p className="text-[12px] text-[#666]">{activeContent.title}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
