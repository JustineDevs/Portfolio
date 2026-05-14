"use client"

import React from 'react'
import CornerDot from '@/components/ui/CornerDot'

export default function WorkExperience() {
  const experiences = [
    {
      company: 'Project One Percent',
      role: 'Web3 Community Moderator',
      period: '2023-2026',
      description: 'Managing and engaging with Web3 communities, providing technical support, and fostering community growth.',
      website: 'https://projectonepercent.io/',
    },
  ]

  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="bl" />
      <CornerDot position="br" />
      
      <div className="p-8 lg:p-12">
        <h2 className="text-[24px] font-bold text-[#424242] mb-6 tracking-[-0.01em]">Work Experience</h2>
        
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="pb-6 border-b border-[#e0e0e0] last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-[18px] font-bold text-[#424242] mb-1">{exp.company}</h3>
                  <p className="text-[14px] font-medium text-[#666666]">{exp.role}</p>
                </div>
                <span className="text-[12px] text-[#666666]">{exp.period}</span>
              </div>
              <p className="text-[14px] leading-[1.7] text-[#555555] mb-3">{exp.description}</p>
              {exp.website && (
                <a
                  href={exp.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-[#1342FF] hover:underline"
                >
                  Visit Website →
                </a>
              )}
            </div>
          ))}
          
          <div className="pt-4 space-y-3 text-[14px] leading-[1.7] text-[#555555]">
            <p>
              Committed to continuous learning and staying current with industry trends. Proficient in using 
              AI-powered development tools to enhance productivity and code quality.
            </p>
            <p>
              Proven track record of delivering high-quality projects both independently and as part of 
              collaborative teams, with a focus on clean code, best practices, and user experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

