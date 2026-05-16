"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import MarkdownContent from '@/components/content/MarkdownContent'
import type { AboutRecentPost, AboutSidebarPanel } from '@/lib/content/page-data'

interface SidebarProps {
  dateLabel?: string
  heading?: string
  subheading?: string
  navSections?: AboutSidebarPanel[]
  recentPosts?: AboutRecentPost[]
}

const defaultSections: AboutSidebarPanel[] = []

export default function Sidebar({
  dateLabel = '',
  heading = '',
  subheading = '',
  navSections = defaultSections,
  recentPosts = [],
}: SidebarProps) {
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
          {dateLabel ? (
            <div className="mb-2 text-[12px] text-[#666666]">
              <MarkdownContent markdown={dateLabel} className="[&_*]:text-[12px] [&_p]:mt-0 [&_p]:leading-[1.6]" />
            </div>
          ) : null}
          <h2 className="text-[20px] font-bold text-[#424242] tracking-[-0.01em]">{heading}</h2>
          <h3 className="text-[16px] font-semibold text-[#424242] mt-4">{subheading}</h3>
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
          {recentPosts.length > 0 ? (
            <div className="mt-4 space-y-4">
              {recentPosts.map((post) => {
                const href = post.postType === 'external' && post.canonicalUrl ? post.canonicalUrl : `/blog/${post.slug}`
                const isExternal = post.postType === 'external' && Boolean(post.canonicalUrl)

                return isExternal ? (
                  <a
                    key={post.slug}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-[#d5d5d5] p-3 transition-colors hover:bg-[#fafafa]"
                  >
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#666666]">Writing</div>
                    <h4 className="mt-2 text-[13px] font-semibold leading-[1.5] text-[#424242]">{post.title}</h4>
                  </a>
                ) : (
                  <Link
                    key={post.slug}
                    href={href}
                    className="block border border-[#d5d5d5] p-3 transition-colors hover:bg-[#fafafa]"
                  >
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#666666]">Writing</div>
                    <h4 className="mt-2 text-[13px] font-semibold leading-[1.5] text-[#424242]">{post.title}</h4>
                  </Link>
                )
              })}
            </div>
          ) : null}
          <Link href="/blog" className="mt-3 inline-block text-sm text-[#1342FF] hover:underline">
            Read writing →
          </Link>
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
              <MarkdownContent
                markdown={`**${activeContent.heading}** ${activeContent.intro}`.trim()}
                className="[&_*]:text-[14px] [&_p]:mt-0 [&_p]:leading-relaxed"
              />

              {activeContent.points.map((point, idx) => (
                <MarkdownContent
                  key={idx}
                  markdown={point}
                  className="[&_*]:text-[14px] [&_p]:mt-0 [&_p]:leading-relaxed"
                />
              ))}

              <MarkdownContent
                markdown={activeContent.summary}
                className="[&_*]:text-[14px] [&_p]:mt-0 [&_p]:leading-relaxed"
              />

              <MarkdownContent
                markdown={activeContent.extended}
                className="[&_*]:text-[14px] [&_p]:mt-0 [&_p]:leading-relaxed [&_*]:text-[#555]"
              />

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
