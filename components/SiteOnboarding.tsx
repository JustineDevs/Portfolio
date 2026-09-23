'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const CrowdCanvas = dynamic(() => import('@/components/ui/crowd-canvas').then((module) => module.CrowdCanvas), { ssr: false })

type SiteChoice = 'portfolio' | 'work'
const HANDOFF_DURATION = 450

const WORK_SITE_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3001/'
    : 'https://work.jstn.site/'

export default function SiteOnboarding({
  onPortfolioReady,
  onTransitionComplete,
}: {
  onPortfolioReady: () => void
  onTransitionComplete: () => void
}) {
  const [hoveredSite, setHoveredSite] = useState<SiteChoice | null>(null)
  const [selectedSite, setSelectedSite] = useState<SiteChoice | null>(null)
  const selectedSiteRef = useRef<SiteChoice | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      if (!selectedSiteRef.current) document.body.style.overflow = ''
    }
  }, [])

  const chooseSite = (site: SiteChoice) => {
    if (selectedSite) return
    setSelectedSite(site)
    selectedSiteRef.current = site

    if (site === 'work') {
      window.setTimeout(() => window.location.assign(WORK_SITE_URL), HANDOFF_DURATION)
      return
    }

    onPortfolioReady()
    window.setTimeout(onTransitionComplete, HANDOFF_DURATION)
  }

  const activeSite = selectedSite ?? hoveredSite

  return (
    <div
      className={`site-onboarding${activeSite ? ` site-onboarding--${activeSite}` : ''}${selectedSite ? ' site-onboarding--selected' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-onboarding-title"
    >
      <header className="site-onboarding__header">
        <Image
          src="/JSTN Logo/SVG/Logo Header - B.svg"
          alt="JSTN"
          width={180}
          height={62}
          priority
          className="site-onboarding__logo"
        />
      </header>

      <div className="site-onboarding__panels">
        <button
          type="button"
          className="site-onboarding__panel site-onboarding__panel--portfolio"
          onPointerDown={() => chooseSite('portfolio')}
          onClick={() => chooseSite('portfolio')}
          onMouseEnter={() => setHoveredSite('portfolio')}
          onMouseLeave={() => setHoveredSite(null)}
          onFocus={() => setHoveredSite('portfolio')}
          onBlur={() => setHoveredSite(null)}
          aria-label="Open JustineDevs portfolio"
        >
          <span className="site-onboarding__panel-copy">
            <span className="site-onboarding__eyebrow">01 / PERSONAL</span>
            <span id="site-onboarding-title" className="site-onboarding__title">My Portfolio</span>
            <span className="site-onboarding__hint">Selected work, writing, and experiments</span>
          </span>
        </button>

        <button
          type="button"
          className="site-onboarding__panel site-onboarding__panel--work site-onboarding__panel--disabled"
          disabled
          aria-disabled="true"
          aria-label="JustineDevs work site is under construction"
        >
          <span className="site-onboarding__panel-mark site-onboarding__panel-mark--lock" aria-hidden="true">
            <svg viewBox="0 0 48 48" role="presentation">
              <rect x="11" y="21" width="26" height="20" rx="3" />
              <path d="M16 21v-6a8 8 0 0 1 16 0v6M24 29v5" />
            </svg>
          </span>
          <span className="site-onboarding__panel-copy">
            <span className="site-onboarding__eyebrow">02 / PROFESSIONAL</span>
            <span className="site-onboarding__title">Work Site</span>
            <span className="site-onboarding__hint">Under construction — unavailable for now</span>
          </span>
        </button>

        <div className="site-onboarding__crowd-overlay">
          <CrowdCanvas src="https://cdn.21st.dev/assets/localized/abdb8990a7bef8c2f5af3e45f0a3c969c4b0603fba8be92e81347de4ea4e1ed7.png" />
        </div>
      </div>

    </div>
  )
}
