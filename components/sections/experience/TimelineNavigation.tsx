"use client"

import React, { useState } from 'react'
import CornerDot from '@/components/ui/CornerDot'

export default function TimelineNavigation() {
  const [activeStage, setActiveStage] = useState(0)

  const stages = [
    {
      id: 'founder',
      title: 'The Founder (Present)',
      period: '2026 - Present',
      description: 'Building the Future',
      workflow: 'Workflow & Designing: N8N, | ComfyUI | Framer | Figma | Rust (Solana) | Move (Sui)',
      vision: 'Multi-chain infrastructure at scale ($100k ARR target)',
      question: "Now I'm asking: 'What impact do I create?'",
      tools: ['N8N', 'Framer', 'Figma', 'Rust', 'Move'],
    },
    {
      id: 'breakthrough',
      title: 'The Breakthrough',
      period: 'The "Proof"',
      description: 'Achieved first hackathon victory with HyperionKit',
      workflow: 'Working in 3-member teams, learning through doing',
      tools: ['Solidity', 'React', 'Node.js', 'Ethers.js'],
    },
    {
      id: 'pivot',
      title: 'The Pivot',
      period: 'The Transition',
      description: 'Transitioned from community moderator to professional developer',
      workflow: 'Balancing community engagement with technical development',
      tools: ['JavaScript', 'React', 'Web3', 'Community Tools'],
    },
    {
      id: 'foundation',
      title: 'The Foundation',
      period: 'The Origin',
      description: 'Started as Web3 community moderator in 2022',
      workflow: 'Volunteer roles, learning through engagement',
      tools: ['Communication', 'Community Management', 'Web3 Basics'],
    },
  ]

  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="bl" />
      <CornerDot position="br" />
      
      <div className="p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Timeline Visualization */}
          <div>
            <h3 className="text-[20px] font-bold text-[#424242] mb-6 tracking-[-0.01em]">
              Hover to see my timeline
            </h3>
            
            {/* Circular Dot Visualization */}
            <div className="relative w-full h-[400px] rounded-lg border border-[#d5d5d5] bg-white flex items-center justify-center mb-6">
              <div className="relative w-64 h-64">
                {stages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStage(index)}
                    onMouseEnter={() => setActiveStage(index)}
                    className={`absolute w-4 h-4 rounded-full transition-all cursor-pointer ${
                      index === activeStage
                        ? 'bg-[#1342FF] scale-150'
                        : 'bg-[#d5d5d5] hover:bg-[#1342FF]/50'
                    }`}
                    style={{
                      top: `${25 + index * 25}%`,
                      left: `${50 + (index % 2) * 20}%`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Active Stage Title */}
            <div className="p-6 rounded-lg border border-[#d5d5d5] bg-white">
              <h4 className="text-[18px] font-bold text-[#424242] mb-2">
                {stages[activeStage].title}
              </h4>
            </div>
          </div>

          {/* Right: Active Stage Details */}
          <div>
            <div className="p-6 rounded-lg border border-[#d5d5d5] bg-white mb-6">
              <h4 className="text-[16px] font-semibold text-[#424242] mb-2">
                {stages[activeStage].period}
              </h4>
              <p className="text-[14px] leading-[1.7] text-[#555555] mb-4">
                {stages[activeStage].description}
              </p>
              {stages[activeStage].workflow && (
                <p className="text-[14px] leading-[1.7] text-[#555555] mb-4">
                  {stages[activeStage].workflow}
                </p>
              )}
              {stages[activeStage].question && (
                <p className="text-[14px] leading-[1.7] text-[#1342FF] font-semibold mb-4">
                  {stages[activeStage].question}
                </p>
              )}
              {stages[activeStage].vision && (
                <p className="text-[14px] leading-[1.7] text-[#555555]">
                  <strong className="text-[#424242]">Vision:</strong> {stages[activeStage].vision}
                </p>
              )}
            </div>

            {/* Tools */}
            <div className="flex flex-wrap gap-2">
              {stages[activeStage].tools.map((tool, index) => (
                <div
                  key={index}
                  className="px-4 py-2 rounded-lg border border-[#d5d5d5] bg-white text-[12px] font-medium text-[#424242]"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
