'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import AsciiBackground from '@/components/ui/AsciiBackground'
import SocialLinksBar from '@/components/ui/SocialLinksBar'
import ScrollToTop from '@/components/ui/ScrollToTop'
import PreLoading from '@/components/PreLoading'
import { useMode } from '@/components/providers/ModeProvider'
import { animations } from '@/lib/design-tokens'

import type { PublicProject } from '@/lib/content/types'
import type { PublicLegalLinks } from '@/lib/legal-links-shared'

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

interface AwardLike {
  slug: string
  title: string
  eventName: string
  description: string
  year: string
  proofUrl?: string | null
  logoUrl?: string | null
}

interface CertificateLike {
  slug: string
  title: string
  description: string
  proofUrl?: string | null
  logoUrl?: string | null
}

export default function HomePageClient({
  featuredProjects,
  featuredAwards,
  featuredCertificates,
  legalLinks,
}: {
  featuredProjects: PublicProject[]
  featuredAwards: AwardLike[]
  featuredCertificates: CertificateLike[]
  legalLinks: PublicLegalLinks
}) {
  /** Desktop-only intro overlay; mobile always sees content (Speed Insights / LCP). */
  const [deskSplash, setDeskSplash] = useState(false)
  const { mode } = useMode()

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('has-seen-preloading') === 'true') return
    if (window.matchMedia('(max-width: 767px)').matches) {
      sessionStorage.setItem('has-seen-preloading', 'true')
      return
    }
    setDeskSplash(true)
  }, [])

  useEffect(() => {
    if (!deskSplash) return
    const id = window.setTimeout(() => {
      setDeskSplash(false)
      sessionStorage.setItem('has-seen-preloading', 'true')
    }, 3200)
    return () => window.clearTimeout(id)
  }, [deskSplash])

  return (
    <div className="min-h-screen bg-[#F8F8F8] relative overflow-x-hidden">
      {deskSplash && (
        <div className="pointer-events-auto fixed inset-0 z-[9999] hidden md:block" aria-hidden={false}>
          <PreLoading />
        </div>
      )}

      <AsciiBackground />

      <SocialLinksBar />
      <Navbar />

      <main id="main-content" className="site-main">
        <AnimatePresence mode="wait">
          {mode === 'personal' ? (
            <motion.div key="personal" {...animations.modeSwitch}>
              <Hero />
              <TechAndDescriptionSection />
              <BrandBadgeProjectsSection featuredProjects={featuredProjects} featuredAwards={featuredAwards} />
              <GithubActivitySection />
            </motion.div>
          ) : (
            <motion.div key="professional" {...animations.modeSwitch}>
              <ResumePage
                featuredProjects={featuredProjects}
                featuredAwards={featuredAwards}
                featuredCertificates={featuredCertificates}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Footer legalLinks={legalLinks} />
      </main>

      <ScrollToTop />
    </div>
  )
}
