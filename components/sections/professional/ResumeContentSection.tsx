"use client"

import React from 'react'
import CornerDot from '@/components/ui/CornerDot'

export default function ResumeContentSection() {
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
      status: 'Graduated',
      period: '2022-2024',
      proofLabel: 'Batch 13 proof',
      proofHref: 'https://www.facebook.com/reel/728813249571957',
    },
  ]

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
      
      {/* Header Section - 98px height equivalent */}
      <div className="border-b border-[#d5d5d5] bg-white">
        <div className="px-8 lg:px-12 py-6 lg:py-8">
          <h2 className="text-[28px] lg:text-[32px] font-bold text-[#424242] tracking-[-0.02em] leading-tight">
            Education
          </h2>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-auto">
          {/* Education Card - Spans 6 columns on large screens */}
          <div className="lg:col-span-6 bg-white border border-[#d5d5d5] rounded-lg p-6 lg:p-8">
            <h3 className="text-[20px] lg:text-[22px] font-bold text-[#424242] mb-6 tracking-[-0.01em]">
              Education
            </h3>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div 
                  key={index} 
                  className="pb-6 border-b border-[#e0e0e0] last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex-1">
                      <h4 className="text-[18px] lg:text-[20px] font-bold text-[#424242] mb-2 tracking-[-0.01em]">
                        {edu.institution}
                      </h4>
                      <p className="text-[14px] lg:text-[15px] font-medium text-[#666666] mb-2 leading-relaxed">
                        {edu.degree} {edu.specialization && `(${edu.specialization})`}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {edu.status && (
                          <span
                            className={
                              edu.status === 'Graduated'
                                ? 'inline-block px-3 py-1.5 text-[12px] font-semibold text-[#166534] bg-[#ecfdf5] rounded border border-[#86efac]'
                                : 'inline-block px-3 py-1.5 text-[12px] text-[#666666] bg-[#f5f5f5] rounded border border-[#e0e0e0]'
                            }
                          >
                            {edu.status}
                          </span>
                        )}
                        {edu.proofHref && edu.proofLabel && (
                          <a
                            href={edu.proofHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-3 py-1.5 text-[12px] font-semibold text-[#1342FF] bg-[#eef2ff] rounded border border-[#c7d2fe] hover:bg-[#e0e7ff] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1342FF]"
                          >
                            {edu.proofLabel}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] lg:text-[14px] text-[#666666]">
                      <span>{edu.period}</span>
                      {edu.year && (
                        <>
                          <span>•</span>
                          <span>{edu.year}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience Card - Spans 6 columns on large screens */}
          <div className="lg:col-span-6 bg-white border border-[#d5d5d5] rounded-lg p-6 lg:p-8">
            <h3 className="text-[20px] lg:text-[22px] font-bold text-[#424242] mb-6 tracking-[-0.01em]">
              Work Experience
            </h3>
            
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div 
                  key={index} 
                  className="pb-6 border-b border-[#e0e0e0] last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-col gap-3 mb-3">
                    <div className="flex-1">
                      <h4 className="text-[18px] lg:text-[20px] font-bold text-[#424242] mb-2 tracking-[-0.01em]">
                        {exp.company}
                      </h4>
                      <p className="text-[14px] lg:text-[15px] font-medium text-[#666666] mb-2 leading-relaxed">
                        {exp.role}
                      </p>
                    </div>
                    <span className="text-[13px] lg:text-[14px] text-[#666666]">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-[14px] lg:text-[15px] leading-[1.75] text-[#555555] mb-4">
                    {exp.description}
                  </p>
                  {exp.website && (
                    <a
                      href={exp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[13px] lg:text-[14px] text-[#1342FF] hover:underline transition-colors"
                    >
                      Visit Website
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
              
              <div className="pt-4 space-y-3 text-[14px] lg:text-[15px] leading-[1.75] text-[#555555]">
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

          {/* Featured Badge & Certificates Card - Spans full width (12 columns) */}
          <div className="lg:col-span-12 bg-white border border-[#d5d5d5] rounded-lg p-6 lg:p-8">
            <h3 className="text-[20px] lg:text-[22px] font-bold text-[#424242] mb-4 tracking-[-0.01em]">
              Featured Badge & Certificates
            </h3>
            
            <p className="text-[14px] lg:text-[15px] text-[#666666] mb-6 leading-relaxed">
              Add this badge to your website to show you are featured achievements.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Winning Achievements */}
              <div>
                <h4 className="text-[16px] lg:text-[18px] font-bold text-[#424242] mb-4 tracking-[-0.01em]">
                  WINNING ACHIEVEMENTS
                </h4>
                <div className="space-y-4">
                  <div className="group relative p-5 bg-[#424242] rounded-lg flex items-center justify-between hover:bg-[#383838] transition-colors">
                    <span className="text-white text-[14px] lg:text-[15px] font-medium pr-4">
                      Winning on Metis Hackathon
                    </span>
                    <button className="px-4 py-2 bg-white text-[#424242] text-[12px] lg:text-[13px] font-medium rounded hover:opacity-90 transition-opacity whitespace-nowrap">
                      View
                    </button>
                  </div>
                  <div className="group relative p-5 bg-[#424242] rounded-lg flex items-center justify-between hover:bg-[#383838] transition-colors">
                    <span className="text-white text-[14px] lg:text-[15px] font-medium pr-4">
                      Winning on Avalanche x402
                    </span>
                    <button className="px-4 py-2 bg-white text-[#424242] text-[12px] lg:text-[13px] font-medium rounded hover:opacity-90 transition-opacity whitespace-nowrap">
                      View
                    </button>
                  </div>
                </div>
              </div>

              {/* Certificates */}
              <div>
                <h4 className="text-[16px] lg:text-[18px] font-bold text-[#424242] mb-4 tracking-[-0.01em]">
                  Certificates
                </h4>
                <div className="p-5 bg-[#424242] rounded-lg flex items-center justify-between hover:bg-[#383838] transition-colors">
                  <span className="text-white text-[14px] lg:text-[15px] font-medium">
                    Featured on N/A
                  </span>
                  <button className="px-4 py-2 bg-white text-[#424242] text-[12px] lg:text-[13px] font-medium rounded hover:opacity-90 transition-opacity">
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

