'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const HomePageClient = dynamic(() => import('@/components/HomePageClient'))
const SiteOnboarding = dynamic(() => import('@/components/SiteOnboarding'))

export default function HomeEntry() {
  const [portfolioSelected, setPortfolioSelected] = useState(false)
  const [onboardingVisible, setOnboardingVisible] = useState(true)
  const [loadingActive, setLoadingActive] = useState(false)

  useEffect(() => {
    const locked = onboardingVisible || loadingActive
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    document.body.style.overflow = locked ? 'hidden' : ''
  }, [loadingActive, onboardingVisible])

  useEffect(() => () => {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
  }, [])

  const selectPortfolio = () => {
    setPortfolioSelected(true)
    setLoadingActive(window.matchMedia('(min-width: 768px)').matches)
  }

  return (
    <>
      {portfolioSelected ? <HomePageClient onLoadingComplete={() => setLoadingActive(false)} /> : null}
      {onboardingVisible ? (
        <SiteOnboarding
          onPortfolioReady={selectPortfolio}
          onTransitionComplete={() => setOnboardingVisible(false)}
        />
      ) : null}
    </>
  )
}
