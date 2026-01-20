"use client"

import React from 'react'
import Link from 'next/link'
import CornerDot from '@/components/ui/CornerDot'
import LiquidImage from '@/components/ui/LiquidImage'

export default function RecentProjects() {
  const projects = [
    {
      slug: 'hyperkit',
      title: 'HYPERKIT',
      subtitle: 'The Modular infrastructure toolkit',
      description: 'for multi-chain dev',
      image: '/v2/showcase/Hyperkit Banner (README).png',
    },
    {
      slug: 'metagen-wallet',
      title: 'METAGEN WALLET',
      image: '/v2/showcase/Banner V1 METAGEN WALLET.png',
    },
    {
      slug: 'astra',
      title: 'ASTRA',
      description: 'Web3-native AI-powered platform that generates personalized learning roadmaps using intelligent agents',
      image: '/v2/showcase/Hyperkit Banner (README).png', // Placeholder
    },
    {
      slug: 'hyperagent',
      title: 'HyperAgent',
      image: '/v2/showcase/Hyperkit Banner (README).png', // Placeholder
    },
  ]

  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="bl" />
      <CornerDot position="br" />
      
      <div className="p-8 lg:p-12">
        <h2 className="text-[24px] font-bold text-[#424242] mb-6 tracking-[-0.01em]">Recent Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group relative overflow-hidden rounded-xl bg-[#424242] h-[280px] border border-[#d5d5d5]"
            >
              {/* Liquid Image Background */}
              <div className="absolute inset-0 z-0">
                <LiquidImage
                  src={project.image}
                  alt={project.title}
                  strength={0.4}
                  speed={0.6}
                  size={0.8}
                />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 z-10 p-5 flex flex-col justify-between pointer-events-none">
                <div>
                  <h3 className="text-white text-[24px] font-bold mb-1">{project.title}</h3>
                  {project.subtitle && (
                    <p className="text-white/90 text-[12px] mb-1">{project.subtitle}</p>
                  )}
                  {project.description && (
                    <p className="text-white/80 text-[11px] leading-tight">{project.description}</p>
                  )}
                </div>
                
                {/* View Button */}
                <div className="flex items-end justify-end">
                  <button className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-medium text-white rounded-full bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-all pointer-events-auto">
                    &lt; View
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

