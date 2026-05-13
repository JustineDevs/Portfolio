'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Twitter, Globe, Share2, ExternalLink, ChevronDown, Calendar } from 'lucide-react'
import LiquidImage from '@/components/ui/LiquidImage'
import CornerDot from '@/components/ui/CornerDot'
import type { PublicProject } from '@/lib/content/types'
import { getRenderableImageUrl, isSvgAssetUrl } from '@/lib/asset-urls'

interface HeroProjectHeaderProps {
  project: PublicProject
}

export default function HeroProjectHeader({ project }: HeroProjectHeaderProps) {
  const detailsRef = useRef<HTMLDivElement>(null)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.summary,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="pt-0 pb-0 bg-[#F8FAFC]">
      <div className="border-b border-[#d5d5d5]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        {/* Navigation Top Bar */}
        <div className="border-l border-r border-b border-[#d5d5d5] bg-white">
          <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#666666] flex-wrap">
              <Link href="/" className="hover:text-[#424242] transition">Home</Link>
              <span className="text-[#d5d5d5]">/</span>
              <Link href="/projects" className="hover:text-[#424242] transition">Projects</Link>
              <span className="text-[#d5d5d5]">/</span>
              <span className="text-[#424242] font-medium truncate max-w-[120px] sm:max-w-none">{project.title}</span>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-[#666666] hidden sm:inline">Project Socials:</span>
              <div className="flex items-center gap-1">
                {project.links.find((link) => link.type === "github")?.url && (
                  <a
                    href={project.links.find((link) => link.type === "github")?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-[#F8FAFC] rounded-lg transition border border-transparent hover:border-[#d5d5d5] min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Github className="w-5 h-5 text-[#424242]" />
                  </a>
                )}
                {project.links.find((link) => link.type === "twitter")?.url && (
                  <a
                    href={project.links.find((link) => link.type === "twitter")?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-[#F8FAFC] rounded-lg transition border border-transparent hover:border-[#d5d5d5] min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Twitter className="w-5 h-5 text-[#424242]" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Banner Image Area */}
        <div className="border-l border-r border-b border-[#d5d5d5] bg-white relative overflow-hidden">
          <div className="relative h-[280px] sm:h-[350px] md:h-[450px] lg:h-[600px] bg-gray-50">
            {project.bannerImageUrl ? (
              <LiquidImage
                src={project.bannerImageUrl}
                alt={project.title}
                strength={0.3}
                speed={0.5}
                size={0.6}
              />
            ) : project.coverImageUrl ? (
              <Image
                src={getRenderableImageUrl(project.coverImageUrl)}
                alt={project.title}
                fill
                className="object-cover"
                priority
                unoptimized={isSvgAssetUrl(project.coverImageUrl) || getRenderableImageUrl(project.coverImageUrl).startsWith("/api/image/resolve")}
              />
            ) : null}
          </div>
        </div>

        {/* Main Title & Description Block */}
        <div className="border-l border-r border-b border-[#d5d5d5] bg-white relative">
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#1342FF]"></span>
              <span className="text-xs sm:text-sm text-[#666666] font-bold uppercase tracking-widest">{project.publishedAt ?? ""}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-[#424242] mb-4 sm:mb-6 md:mb-8 tracking-tight leading-[0.95]">
              {project.title}
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#666666] leading-relaxed max-w-4xl mb-6 sm:mb-8 md:mb-12">
              {project.summary}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-[#424242] text-white font-bold rounded-xl hover:bg-black transition flex items-center justify-center gap-2 shadow-sm min-h-[48px]"
                >
                  <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5" />
                  Visit Website
                </a>
              )}
                <a
                  href="https://cal.com/justinedevs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 sm:px-8 py-3 sm:py-4 border border-[#d5d5d5] text-[#424242] font-bold rounded-xl hover:bg-[#F8FAFC] transition flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <Calendar className="w-4 sm:w-5 h-4 sm:h-5" />
                  Schedule a Call
                </a>
              <button
                onClick={handleShare}
                className="px-6 sm:px-8 py-3 sm:py-4 border border-[#d5d5d5] text-[#424242] font-bold rounded-xl hover:bg-[#F8FAFC] transition flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Share2 className="w-4 sm:w-5 h-4 sm:h-5" />
                Share Project
              </button>
            </div>
          </div>
        </div>

        {/* Structured Meta Grid */}
        <div ref={detailsRef} className="border-l border-r border-b border-[#d5d5d5] bg-white scroll-mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 sm:p-6 md:p-8 border-b sm:border-b lg:border-b-0 sm:border-r border-[#d5d5d5]">
              <span className="text-[10px] text-[#666666] uppercase tracking-[0.2em] font-black block mb-3 sm:mb-4">Category</span>
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#424242] text-white text-[11px] sm:text-[12px] font-bold rounded-lg inline-block uppercase tracking-wider">
                {project.category}
              </span>
            </div>
            
            <div className="p-4 sm:p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-[#d5d5d5]">
              <span className="text-[10px] text-[#666666] uppercase tracking-[0.2em] font-black block mb-3 sm:mb-4">Tags</span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 border border-[#d5d5d5] text-[#424242] text-[11px] sm:text-[12px] font-bold rounded-lg bg-[#F8FAFC]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8 border-b sm:border-b-0 sm:border-r border-[#d5d5d5]">
              <span className="text-[10px] text-[#666666] uppercase tracking-[0.2em] font-black block mb-3 sm:mb-4">Author</span>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-[#1342FF] flex items-center justify-center text-white text-[11px] sm:text-[12px] font-bold flex-shrink-0">
                  {project.authorName.charAt(0)}
                </div>
                <span className="text-[#424242] font-bold text-base sm:text-lg truncate">{project.authorName}</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8">
              <span className="text-[10px] text-[#666666] uppercase tracking-[0.2em] font-black block mb-3 sm:mb-4">Official Site</span>
              <a
                href={project.authorUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1342FF] font-bold text-base sm:text-lg hover:underline transition truncate block"
              >
                {(project.authorUrl || "").replace('https://', '').replace('www.', '')}
              </a>
            </div>
          </div>
        </div>

        {/* Networks Section */}
        <div className="border-l border-r border-b border-[#d5d5d5] bg-white relative">
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <h3 className="text-[10px] sm:text-xs font-black text-[#666666] uppercase tracking-[0.2em] sm:tracking-[0.3em] whitespace-nowrap">Integrated Networks</h3>
              <div className="h-px w-full bg-[#d5d5d5]"></div>
            </div>
            
            {project.networks && (
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {project.networks.map((network, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-[#d5d5d5] rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold text-[#424242] hover:border-[#1342FF] hover:text-[#1342FF] transition-all cursor-default group min-h-[40px] sm:min-h-[44px]"
                  >
                    <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#d5d5d5] group-hover:bg-[#1342FF] transition-colors"></div>
                    {network}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
