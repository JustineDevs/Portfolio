'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '@/components/providers/ModeProvider'
import { animations } from '@/lib/design-tokens'

import type { PublicAwardCard, PublicCertificateCard, PublicProject } from '@/lib/content/types'
import type { PublicLegalLinks } from '@/lib/legal-links-shared'
import type { AboutRecentPost } from '@/lib/content/page-data'
import type { ProfessionalContent } from '@/lib/content/home-page-data'
import type { PublicAsset } from '@/lib/content/assets'

const Navbar = dynamic(() => import('@/components/Navbar'))
const Footer = dynamic(() => import('@/components/Footer'))
const Hero = dynamic(() => import('@/components/Hero'), {
  loading: () => <div className="min-h-[400px] w-full rounded-t-lg border border-[#d5d5d5] bg-white" aria-busy aria-label="Loading hero" />,
})
const AsciiBackground = dynamic(() => import('@/components/ui/AsciiBackground'))
const ScrollToTop = dynamic(() => import('@/components/ui/ScrollToTop'))
const PreLoading = dynamic(() => import('@/components/PreLoading'))

const TechAndDescriptionSection = dynamic(
  () => import('@/components/sections/TechAndDescriptionSection'),
  {
    loading: () => (
      <div
        className="min-h-[240px] w-full border-l border-r border-b border-[#d5d5d5] bg-white"
        aria-busy
        aria-label="Loading section"
      />
    ),
  }
)

const BrandBadgeProjectsSection = dynamic(
  () => import('@/components/sections/BrandBadgeProjectsSection'),
  {
    loading: () => (
      <div
        className="min-h-[320px] w-full border-l border-r border-b border-[#d5d5d5] bg-white"
        aria-busy
        aria-label="Loading section"
      />
    ),
  }
)

const GithubActivitySection = dynamic(
  () => import('@/components/sections/GithubActivitySection'),
  {
    loading: () => (
      <div
        className="min-h-[200px] w-full border-l border-r border-b border-[#d5d5d5] bg-white"
        aria-busy
        aria-label="Loading section"
      />
    ),
  }
)

const ResumePage = dynamic(
  () => import('@/components/sections/professional/ResumePage'),
  {
    loading: () => (
      <div
        className="min-h-[70vh] w-full border border-[#d5d5d5] bg-white rounded-t-lg"
        aria-busy
        aria-label="Loading resume"
      />
    ),
  }
)

interface HomePageData {
  featuredProjects: PublicProject[]
  featuredAwards: PublicAwardCard[]
  featuredPosts: AboutRecentPost[]
  featuredCertificates: PublicCertificateCard[]
  legalLinks: PublicLegalLinks
  assets: { projectOnePercent: PublicAsset | null; jstn: PublicAsset | null; platforms: Array<PublicAsset | null> }
  howIWork: { title: string; paragraphs: string[]; linkLabel: string; link: string }
  professional: ProfessionalContent
}

const emptyHomePageData: HomePageData = {
  featuredProjects: [],
  featuredAwards: [],
  featuredPosts: [],
  featuredCertificates: [],
  legalLinks: { privacyPolicyUrl: null, termsUrl: null },
  assets: { projectOnePercent: null, jstn: null, platforms: [] },
  howIWork: { title: 'Want the longer version?', paragraphs: [], linkLabel: 'Read the story', link: '/about' },
  professional: { name: 'Justine Lupasi', location: 'Metro Manila, Philippines', headline: '', about: [], experiences: [], education: [] },
}

export default function HomePageClient({
  initialData,
  showIntro = false,
  onLoadingComplete,
}: {
  initialData?: HomePageData
  showIntro?: boolean
  onLoadingComplete?: () => void
}) {
  const [pageData, setPageData] = useState<HomePageData>(initialData ?? emptyHomePageData)
  const [contentDataReady, setContentDataReady] = useState(Boolean(initialData))
  const [avatarReady, setAvatarReady] = useState(false)
  const [contentReady, setContentReady] = useState(false)
  /** Desktop-only intro overlay; mobile always sees content (Speed Insights / LCP). */
  const [deskSplash, setDeskSplash] = useState(false)
  const { mode } = useMode()

  useEffect(() => {
    if (initialData) return

    const controller = new AbortController()
    fetch('/api/home', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Home content request failed: ${response.status}`)
        return response.json() as Promise<HomePageData>
      })
      .then((data) => {
        setPageData(data)
        setContentDataReady(true)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        console.error('[home] content request failed', error)
        setContentDataReady(true)
      })

    return () => controller.abort()
  }, [initialData])

  useEffect(() => {
    setContentReady(contentDataReady && (mode !== 'personal' || avatarReady))
  }, [avatarReady, contentDataReady, mode])

  const { featuredProjects, featuredAwards, featuredPosts, featuredCertificates, legalLinks } = pageData

  useLayoutEffect(() => {
    if (!showIntro || typeof window === 'undefined') return
    if (window.matchMedia('(max-width: 767px)').matches) {
      return
    }
    setDeskSplash(true)
  }, [showIntro])

  return (
    <div className="min-h-screen bg-[#F8F8F8] relative overflow-x-hidden">
      {showIntro && deskSplash && (
        <div className="pointer-events-auto fixed inset-0 z-[9999] hidden md:block" aria-hidden={false}>
          <PreLoading
            ready={contentReady}
            onComplete={() => {
              setDeskSplash(false)
              onLoadingComplete?.()
            }}
          />
        </div>
      )}

      <AsciiBackground />

      <Navbar logoUrl={pageData.assets.jstn?.url} />

      <main id="main-content" className="site-main">
        <AnimatePresence mode="wait">
          {mode === 'personal' ? (
            <motion.div key="personal" {...animations.modeSwitch} initial={false}>
              <Hero
                projectOnePercentLogoUrl={pageData.assets.projectOnePercent?.url}
                onAvatarReady={() => setAvatarReady(true)}
              />
              <TechAndDescriptionSection content={pageData.howIWork} platformAssets={pageData.assets.platforms} />
              <BrandBadgeProjectsSection featuredProjects={featuredProjects} featuredAwards={featuredAwards} featuredPosts={featuredPosts} />
              <GithubActivitySection />
            </motion.div>
          ) : (
            <motion.div key="professional" {...animations.modeSwitch} initial={false}>
                <ResumePage
                  featuredProjects={featuredProjects}
                  featuredAwards={featuredAwards}
                  featuredCertificates={featuredCertificates}
                  content={pageData.professional}
                />
            </motion.div>
          )}
        </AnimatePresence>

        <Footer legalLinks={legalLinks} logoUrl={pageData.assets.jstn?.url} />
      </main>

      <ScrollToTop />
    </div>
  )
}
