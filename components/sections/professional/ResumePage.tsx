"use client"

import React, { useMemo, useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import CornerDot from '@/components/ui/CornerDot'
import LiquidImage from '@/components/ui/LiquidImage'
import NeumorphicSocialButton from '@/components/ui/NeumorphicSocialButton'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/components/providers/ToastProvider'

interface CellData {
  level: number
  contributions: number
  date: Date
}

export default function ResumePage() {
  const { info } = useToast()
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const badgeData = {
    'metis': {
      title: 'Metis Hackathon',
      event: 'METIS HYPERION HACKATHON',
      description: 'Won first place in the Metis Hyperion Hackathon. Developed innovative blockchain solutions using Metis Layer 2 technology.',
      date: '2025',
      link: 'https://forum.ceg.vote/t/hyperhack-winners/10593',
    },
    'avalanche': {
      title: 'Avalanche x402',
      event: 'AVALANCHE BUILD X402 AGENTS',
      description: 'Achieved recognition in the Avalanche Build x402 Agents program. Built decentralized applications leveraging Avalanche\'s high-performance blockchain.',
      date: '2025',
      link: 'https://x.com/AvaxDevelopers/status/2001334825199063331',
    },
    'mantle': {
      title: 'Mantle Hackathon',
      event: 'MANTLE GLOBAL HACKATHON',
      description: 'Participated in the Mantle Global Hackathon 2025. Built innovative solutions on Mantle Network.',
      date: '2025',
      link: 'https://www.hackquest.io/projects/Mantle-Global-Hackathon-2025-Hyperkit',
    },
    'certificate': {
      title: 'Certificates',
      event: 'CERTIFICATES',
      description: 'Various certifications and achievements in blockchain development, web technologies, and software engineering.',
      date: '2023-2024',
      link: null,
    },
  }

  const handleBadgeClick = (badgeId: string) => {
    setSelectedBadge(badgeId)
    setIsModalOpen(true)
  }

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

  const experiences = [
    {
      company: 'Project One Percent',
      role: 'Web3 Community Moderator',
      period: '2023-2026',
      description: 'Moderated and managed Web3 community discussions, supporting member engagement and conflict resolution.',
      website: 'https://oneproject.one',
    },
  ]

  const techCategories = [
    {
      title: 'FRONTEND',
      items: ['Typescript', 'TailwindCSS', 'HTML5', 'Three.js', 'Astro', 'Shadcn/UI', 'Vite', 'Redux', 'PostCSS', 'Next.js', 'CSS3', 'Vue.js', 'Babylon.js', 'Styled Components', 'Radix UI', 'Webpack', 'Prettier', 'Framer Motion'],
    },
    {
      title: 'BACKEND',
      items: ['Java', 'Python', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase DB', 'GraphQL', 'gRPC', 'Websockets', 'OAuth 2.0', 'JWT'],
    },
    {
      title: 'CMS & NO-CODE',
      items: ['ComfyUI', 'N8N'],
    },
    {
      title: 'DEVOPS & CLOUD',
      items: ['Vercel', 'GitHub Actions', 'Warp', 'CUP', 'Grafana', 'Docker', 'DegenCloud', 'Pinata IPFS', 'Prometheus'],
    },
    {
      title: 'AI & MACHINE LEARNING',
      items: ['Anthropic', 'OPENAI', 'Hugging Face', 'LlamaIndex', 'GEMINI', 'GROK AI', 'TensorFlow', 'PyTorch'],
    },
    {
      title: 'BLOCKCHAIN & WEB3',
      items: ['Move', 'Solana', 'Rust', 'Ethereum', 'Web3.js', 'Viem', 'Wagmi', 'RainbowKit', 'ConnectKit', 'Thirdweb SDK', 'Alchemy SDK', 'ERC-4337', 'ERC-4066', 'ERC-2771'],
    },
    {
      title: 'SECURITY & IDENTITY',
      items: ['OAuth2.0', 'WebAuthn', 'Multi-Sig', 'AES-256', 'RSA', 'ECDSA', 'SHA-256', 'bcrypt', 'GDPR', 'SOC 2', 'ISO 27001', 'OWASP Top 10', 'Static Analysis', 'OpenZeppelin Contracts'],
    },
    {
      title: 'DEVELOPER TOOLS',
      items: ['Cursor IDE', 'VS Code', 'Claude', 'Visual Studio', 'Antigravity', 'Unreal Engine 5'],
    },
  ]

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
      image: '/v2/showcase/ASTRA BANNER.png',
    },
    {
      slug: 'hyperagent',
      title: 'HyperAgent',
      image: '/v2/showcase/HyperAgent.png',
    },
  ]

  // Activity Heatmap State
  const [selectedYear, setSelectedYear] = useState(2026)
  const [hoveredCell, setHoveredCell] = useState<{ date: Date; contributions: number; x: number; y: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
  const days = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate grid data with dates and contribution counts
  const gridData = useMemo(() => {
    const grid: CellData[][] = []
    const startDate = new Date(selectedYear, 0, 1)
    const endDate = new Date(selectedYear, 11, 31)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const weeks = Math.ceil(daysDiff / 7)

    for (let col = 0; col < weeks; col++) {
      const column: CellData[] = []
      for (let row = 0; row < 7; row++) {
        const dayOffset = col * 7 + row
        const cellDate = new Date(startDate)
        cellDate.setDate(startDate.getDate() + dayOffset)

        if (cellDate > endDate) {
          column.push({ level: 0, contributions: 0, date: cellDate })
          continue
        }

        const seed = (col * 7 + row) * 9301 + 49297 + selectedYear
        const val = (seed % 233280) / 233280
        let level = 0
        let contributions = 0

        if (val > 0.85) {
          level = 3
          contributions = Math.floor(Math.random() * 20) + 15
        } else if (val > 0.65) {
          level = 2
          contributions = Math.floor(Math.random() * 10) + 5
        } else if (val > 0.4) {
          level = 1
          contributions = Math.floor(Math.random() * 4) + 1
        }

        column.push({ level, contributions, date: cellDate })
      }
      grid.push(column)
    }
    return grid
  }, [selectedYear])

  // Calculate statistics
  const stats = useMemo(() => {
    let totalContributions = 0
    let activeDays = 0
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    gridData.forEach(column => {
      column.forEach(cell => {
        if (cell.contributions > 0) {
          totalContributions += cell.contributions
          activeDays++
          tempStreak++
          longestStreak = Math.max(longestStreak, tempStreak)
        } else {
          tempStreak = 0
        }
      })
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let i = gridData.length - 1; i >= 0; i--) {
      for (let j = gridData[i].length - 1; j >= 0; j--) {
        const cell = gridData[i][j]
        if (cell.date <= today && cell.contributions > 0) {
          currentStreak++
        } else if (cell.date <= today) {
          break
        }
      }
    }

    return {
      totalContributions,
      activeDays,
      currentStreak,
      longestStreak,
    }
  }, [gridData])

  const getCellColor = (level: number) => {
    switch (level) {
      case 3: return 'bg-[#216E39]'
      case 2: return 'bg-[#30A14E]'
      case 1: return 'bg-[#9BE9A8]'
      default: return 'bg-[#EBEDF0]'
    }
  }

  const handleCellHover = (cell: CellData, event: React.MouseEvent<HTMLDivElement>) => {
    if (cell.contributions === 0) return
    
    const rect = event.currentTarget.getBoundingClientRect()
    setHoveredCell({
      date: cell.date,
      contributions: cell.contributions,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    })
  }

  const handleCellLeave = () => {
    setHoveredCell(null)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <>
      {/* Tier 2: Personal & Tech Stack */}
      <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
        <CornerDot position="tl" />
        <CornerDot position="tr" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {/* Personal Section - Left */}
          <div className="border-r-0 md:border-r border-[#d5d5d5] p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="flex items-start gap-6">
              <div className="relative w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] md:w-[120px] md:h-[120px] rounded-lg border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/Profile-transparent.png"
                  alt="Justine Lupasi"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-[clamp(24px,3vw,32px)] font-bold text-[#424242] tracking-tight">
                    Justine Lupasi
                  </h1>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#1342FF] flex-shrink-0">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#666666] mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Metro Manila, Philippines</span>
                </div>
                <p className="text-[14px] font-semibold text-[#424242] mb-4">
                  Technical Founder | Web3 Architect
                </p>
                <div className="mb-4">
                  <NeumorphicSocialButton />
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="https://cal.com/justinedevs" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-[#424242] text-white text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2"
                    aria-label="Schedule a call"
                  >
                    Schedule a Call
                  </a>
                  <a
                    href="https://t.me/TraderGOfficial" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 border border-[#d5d5d5] text-[#424242] text-[13px] font-medium rounded-lg hover:bg-[#f5f5f5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2"
                    aria-label="Join community on Telegram"
                  >
                    Community
                  </a>
                </div>
                <div className="mt-10 pt-10 border-t border-[#d5d5d5]">
                  <h2 className="text-[18px] font-bold text-[#424242] mb-6 tracking-[-0.01em] flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#424242] flex-shrink-0">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                    </svg>
                    About
                  </h2>
                  <div className="space-y-4 text-[14px] leading-[1.8] text-[#555555]">
                    <p>
                      A software developer specializing in blockchain and web technologies with a strong portfolio of projects. 
                      My experience also covers front-end projects, responsive web apps, user authentication systems, advanced crypto 
                      trading automation, and decentralized governance tools.
                    </p>
                    <p>
                      <span className="font-semibold text-[#1342FF]">Co-Founder Hyperkit Labs at Hyperion</span> - 
                      Building innovative developer infrastructure tools and contributing to the Metis Layer 2 ecosystem. Since 2022, 
                      I have been an active <span className="font-semibold text-[#1342FF]">Web3 community moderator</span> and professional moderator, 
                      evolving from volunteer roles to paid projects.
                    </p>
                    <p>
                      <span className="font-semibold text-[#1342FF]">Strong problem solver and communicator</span>, 
                      aiming to expand client-facing and IT infrastructure skills.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Section - Right */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            <h2 className="text-[clamp(18px,2vw,20px)] font-bold text-[#424242] mb-6 tracking-[-0.01em]">Tech stack</h2>
            <div className="space-y-6">
              {techCategories.map((category, index) => (
                <div key={index}>
                  <h3 className="text-[11px] font-bold text-[#424242] mb-2 uppercase tracking-wide">
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {category.items.map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        className="px-2 py-1 text-[10px] text-[#555555] bg-[#f5f5f5] rounded border border-[#e0e0e0]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tier 3: Work Experience & Recent Projects */}
      <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Work Experience Section - Left */}
          <div className="border-r-0 lg:border-r border-[#d5d5d5] p-4 sm:p-6 md:p-8 lg:p-12">
            <h2 className="text-[clamp(18px,2vw,20px)] font-bold text-[#424242] mb-8 tracking-[-0.01em]">Work Experience</h2>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={index} className="pb-6 border-b border-[#e0e0e0] last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-[18px] font-bold text-[#424242] mb-2">{exp.company}</h3>
                      <p className="text-[15px] font-medium text-[#666666]">{exp.role}</p>
                    </div>
                    <span className="text-[14px] text-[#666666] whitespace-nowrap ml-4">{exp.period}</span>
                  </div>
                  <p className="text-[15px] leading-[1.7] text-[#555555] mb-4">{exp.description}</p>
                  {exp.website && (
                    <a href={exp.website} target="_blank" rel="noopener noreferrer" className="text-[14px] text-[#1342FF] hover:underline font-medium">
                      Visit Website →
                    </a>
                  )}
                </div>
              ))}
              <div className="pt-6 space-y-3 text-[15px] leading-[1.7] text-[#555555]">
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

          {/* Recent Projects Section - Right */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            <h2 className="text-[20px] font-bold text-[#424242] mb-6 tracking-[-0.01em]">Recent Projects</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group relative overflow-hidden rounded-lg bg-[#424242] h-[200px] border border-[#d5d5d5] block"
                >
                  <div className="absolute inset-0 z-0">
                    <LiquidImage
                      src={project.image}
                      alt={project.title}
                      strength={0.4}
                      speed={0.6}
                      size={0.8}
                    />
                  </div>
                  <div className="absolute inset-0 z-10 p-4 flex flex-col justify-between pointer-events-none">
                    <div>
                      <h3 className="text-white text-[18px] font-bold mb-1">{project.title}</h3>
                      {project.subtitle && (
                        <p className="text-white/90 text-[11px] mb-1">{project.subtitle}</p>
                      )}
                      {project.description && (
                        <p className="text-white/80 text-[10px] leading-tight">{project.description}</p>
                      )}
                    </div>
                    <div className="flex items-end justify-end">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium text-white rounded-full bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-all pointer-events-auto">
                        &lt; View
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tier 4: Education & Featured Badges & Certificates */}
      <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
        <CornerDot position="bl" />
        <CornerDot position="br" />
        <div className="p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Education Section - Left */}
            <div>
              <h2 className="text-[20px] font-bold text-[#424242] mb-6 tracking-[-0.01em]">Education</h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="pb-6 border-b border-[#e0e0e0] last:border-b-0 last:pb-0">
                    <h3 className="text-[16px] font-bold text-[#424242] mb-2">{edu.institution}</h3>
                    <p className="text-[13px] font-medium text-[#666666] mb-2">
                      {edu.degree} {edu.specialization && `(${edu.specialization})`}
                    </p>
                    {edu.status && (
                      <span className="inline-block px-2.5 py-1 text-[11px] text-[#666666] bg-[#f5f5f5] rounded border border-[#e0e0e0] mb-2">
                        {edu.status}
                      </span>
                    )}
                    <div className="flex items-center gap-2 text-[12px] text-[#666666] mt-2">
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

            {/* Featured Badge & Certificates Section - Right */}
            <div>
              <div className="mb-6">
                <h2 className="text-[clamp(18px,2vw,20px)] font-bold text-[#424242] mb-1 tracking-[-0.01em]">Featured Badge & Certificates</h2>
                <p className="text-[clamp(11px,1.2vw,12px)] text-[#666666]">Badges earned from hackathon wins</p>
              </div>
              
              <div className="space-y-5">
                  {/* Metis Hackathon Badge */}
                  <div>
                    <span className="text-[10px] font-bold text-[#666666] tracking-wider uppercase">METIS HYPERION HACKATHON</span>
                    <div className="flex items-center justify-between mt-2.5 pb-4 border-b border-[#E5E5E5]">
                      <div className="bg-[#424242] rounded-lg px-4 py-2.5 flex items-center gap-3 shadow-sm">
                        <div className="relative w-8 h-8">
                          <Image 
                            src="/Logo/metis/metis-symbol-blue.svg" 
                            alt="Metis" 
                            fill 
                            className="object-contain" 
                          />
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="text-[10px] text-white/60">Winning on</span>
                          <span className="text-[12px] font-bold text-white">Metis Hackathon</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleBadgeClick('metis')}
                        className="bg-[#424242] text-white text-[11px] px-5 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2"
                        aria-label="View Metis Hackathon badge details"
                      >
                        Details
                      </button>
                    </div>
                  </div>

                {/* Avalanche Hackathon Badge */}
                <div>
                  <span className="text-[10px] font-bold text-[#666666] tracking-wider uppercase">AVALANCHE BUILD X402 AGENTS</span>
                  <div className="flex items-center justify-between mt-2.5 pb-4 border-b border-[#E5E5E5]">
                    <div className="bg-[#424242] rounded-lg px-4 py-2.5 flex items-center gap-3 shadow-sm">
                      <div className="relative w-8 h-8">
                        <Image 
                          src="/Logo/avalanche/Avalanche Logomark/Avalanche Logomark/SVG/Avalanche_Logomark_Red.svg" 
                          alt="Avalanche" 
                          fill 
                          className="object-contain" 
                        />
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-[10px] text-white/60">Winning on</span>
                        <span className="text-[12px] font-bold text-white">Avalanche x402</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleBadgeClick('avalanche')}
                      className="bg-[#424242] text-white text-[11px] px-5 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2"
                      aria-label="View Avalanche x402 badge details"
                    >
                      Details
                    </button>
                  </div>
                </div>

                  {/* Mantle Hackathon Badge */}
                  <div>
                    <span className="text-[10px] font-bold text-[#666666] tracking-wider uppercase">MANTLE GLOBAL HACKATHON</span>
                    <div className="flex items-center justify-between mt-2.5 pb-4 border-b border-[#E5E5E5]">
                      <div className="bg-[#424242] rounded-lg px-4 py-2.5 flex items-center gap-3 shadow-sm">
                        <div className="relative w-8 h-8">
                          <Image 
                            src="/Logo/mantle/Mantle-Brand-Assets/Mantle Logo Mark/Mantle-Logo-mark.svg" 
                            alt="Mantle" 
                            fill 
                            className="object-contain" 
                          />
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="text-[10px] text-yellow-400">In Progress</span>
                          <span className="text-[12px] font-bold text-white">Mantle Hackathon</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleBadgeClick('mantle')}
                        className="bg-[#424242] text-white text-[11px] px-5 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2"
                        aria-label="View Mantle Hackathon badge details"
                      >
                        Details
                      </button>
                    </div>
                  </div>

                {/* Certificates */}
                <div>
                  <span className="text-[10px] font-bold text-[#666666] tracking-wider uppercase">CERTIFICATES</span>
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="bg-[#424242] rounded-lg px-4 py-2.5 flex items-center gap-3 shadow-sm">
                      <div className="flex flex-col leading-tight">
                        <span className="text-[10px] text-white/60">Featured on</span>
                        <span className="text-[12px] font-bold text-white">N/A</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleBadgeClick('certificate')}
                      className="bg-[#424242] text-white text-[11px] px-5 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2"
                      aria-label="View certificate details"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tier 5: Activity Heatmap */}
      <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
        <CornerDot position="bl" />
        <CornerDot position="br" />
        {/* Header Row */}
        <div className="border-b border-[#d5d5d5] h-[56px] flex items-center px-6">
          <h2 className="text-[20px] font-bold text-[#424242] tracking-[-0.01em]">Activity</h2>
        </div>

        {/* Content Row */}
        <div className="p-6">
          <div className="mb-5">
            <h3 className="text-[15px] font-semibold text-[#424242] mb-1.5">Heatmap</h3>
            <p className="text-[13px] leading-[1.6] text-[#666666] max-w-[480px]">
              A visual representation showing activity levels over the past year. Each square represents a day, with color intensity indicating contribution volume.
            </p>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-[#e0e0e0] rounded-lg p-3"
            >
              <div className="text-[10px] text-[#666666] font-medium mb-1">Total Contributions</div>
              <div className="text-[18px] font-bold text-[#424242]">{stats.totalContributions.toLocaleString()}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-[#e0e0e0] rounded-lg p-3"
            >
              <div className="text-[10px] text-[#666666] font-medium mb-1">Active Days</div>
              <div className="text-[18px] font-bold text-[#424242]">{stats.activeDays}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-[#e0e0e0] rounded-lg p-3"
            >
              <div className="text-[10px] text-[#666666] font-medium mb-1">Current Streak</div>
              <div className="text-[18px] font-bold text-[#1342FF]">{stats.currentStreak} days</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border border-[#e0e0e0] rounded-lg p-3"
            >
              <div className="text-[10px] text-[#666666] font-medium mb-1">Longest Streak</div>
              <div className="text-[18px] font-bold text-[#424242]">{stats.longestStreak} days</div>
            </motion.div>
          </div>

          <div className="flex gap-5 items-start flex-col lg:flex-row">
            <div className="flex-1 bg-white border border-[#e0e0e0] rounded-xl p-5 w-full">
              <div className="w-full overflow-x-auto">
                <div className="flex ml-7 mb-2">
                  {months.map((month, i) => (
                    <span key={i} className="text-[10px] text-[#666666] flex-1 text-center font-medium">
                      {month}
                    </span>
                  ))}
                </div>

                <div className="flex gap-0.5">
                  <div className="flex flex-col justify-around py-0.5 mr-2 w-6">
                    {days.map((day, i) => (
                      <span key={i} className="text-[10px] text-[#666666] h-[10px] leading-none font-medium">
                        {day}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-[3px] flex-1">
                    {gridData.map((column, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-[3px]">
                        {column.map((cell, rowIdx) => {
                          const isHovered = hoveredCell?.date.getTime() === cell.date.getTime()
                          return (
                            <motion.div
                              key={rowIdx}
                              onMouseEnter={(e) => handleCellHover(cell, e)}
                              onMouseLeave={handleCellLeave}
                              className={`w-[10px] h-[10px] rounded-[2px] ${getCellColor(cell.level)} transition-all duration-200 ${
                                cell.contributions > 0 ? 'cursor-pointer hover:ring-2 hover:ring-[#424242] hover:ring-offset-1' : ''
                              }`}
                              whileHover={cell.contributions > 0 ? { scale: 1.3, zIndex: 10 } : {}}
                              animate={isHovered ? { scale: 1.2, zIndex: 10 } : { scale: 1 }}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-end items-center gap-2">
                  <span className="text-[10px] text-[#666666] font-medium">Less</span>
                  <div className="flex gap-[3px]">
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-[#EBEDF0]" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-[#9BE9A8]" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-[#30A14E]" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-[#216E39]" />
                  </div>
                  <span className="text-[10px] text-[#666666] font-medium">More</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-col gap-1.5 w-full lg:w-[80px] shrink-0">
              {[2026, 2025, 2024, 2023].map((year) => (
                <motion.button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-center lg:text-left px-4 py-2 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap flex-1 lg:flex-none ${
                    year === selectedYear 
                      ? 'bg-[#1342FF] text-white' 
                      : 'text-[#666666] hover:bg-white hover:text-[#424242]'
                  }`}
                >
                  {year}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tooltip Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {hoveredCell && (
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="fixed px-3 py-2 bg-[#424242] text-white text-[11px] font-medium rounded whitespace-nowrap pointer-events-none z-[9999] shadow-lg"
              style={{
                left: `${hoveredCell.x}px`,
                top: `${hoveredCell.y}px`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-semibold">{hoveredCell.contributions} contributions</span>
                <span className="text-[10px] text-white/80">{formatDate(hoveredCell.date)}</span>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-[#424242]" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Badge Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedBadge(null)
        }}
        title={selectedBadge ? badgeData[selectedBadge as keyof typeof badgeData]?.title : ''}
        size="md"
      >
        {selectedBadge && badgeData[selectedBadge as keyof typeof badgeData] && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#666666] mb-2">
                {badgeData[selectedBadge as keyof typeof badgeData].description}
              </p>
              <div className="flex items-center gap-4 text-sm text-[#666666]">
                <span>
                  <strong className="text-[#424242]">Event:</strong>{' '}
                  {badgeData[selectedBadge as keyof typeof badgeData].event}
                </span>
                <span>
                  <strong className="text-[#424242]">Date:</strong>{' '}
                  {badgeData[selectedBadge as keyof typeof badgeData].date}
                </span>
              </div>
            </div>
            {badgeData[selectedBadge as keyof typeof badgeData].link && (
              <div className="pt-4 border-t border-[#d5d5d5]">
                <a
                  href={badgeData[selectedBadge as keyof typeof badgeData].link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1342FF] hover:underline text-sm font-medium"
                >
                  Learn more →
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}
