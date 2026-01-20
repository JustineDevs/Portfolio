"use client"

import React from 'react'
import CornerDot from '@/components/ui/CornerDot'

export default function Education() {
  const education = [
    {
      institution: 'National University Dasmariñas',
      degree: 'Bachelor of Science in Information Technology',
      specialization: 'Mobile Web Application Development',
      status: 'Dropped Out',
      period: '2024-Present',
      year: '2nd Year',
    },
    {
      institution: 'Far East Asia Pacific Institute of Tourism Science and Technology',
      degree: 'Senior High School',
      specialization: 'ICT',
      period: '2022-2024',
    },
  ]

  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="bl" />
      <CornerDot position="br" />
      
      <div className="p-8 lg:p-12">
        <h2 className="text-[24px] font-bold text-[#424242] mb-6 tracking-[-0.01em]">Education</h2>
        
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="pb-6 border-b border-[#e0e0e0] last:border-b-0 last:pb-0">
              <h3 className="text-[18px] font-bold text-[#424242] mb-1">{edu.institution}</h3>
              <p className="text-[14px] font-medium text-[#666666] mb-1">
                {edu.degree} {edu.specialization && `(${edu.specialization})`}
              </p>
              {edu.status && (
                <span className="inline-block px-2 py-1 text-[11px] text-[#666666] bg-[#f5f5f5] rounded border border-[#e0e0e0] mb-2">
                  {edu.status}
                </span>
              )}
              <div className="flex items-center gap-2 text-[12px] text-[#666666]">
                <span>{edu.period}</span>
                {edu.year && (
                  <>
                    <span>•</span>
                    <span>{edu.year}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

