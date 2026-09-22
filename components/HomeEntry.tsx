'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { ONBOARDING_COMPLETED_KEY } from '@/lib/onboarding'

const HomePageClient = dynamic(() => import('@/components/HomePageClient'))
const SiteOnboarding = dynamic(() => import('@/components/SiteOnboarding'))

export default function HomeEntry() {
  const [portfolioSelected, setPortfolioSelected] = useState(false)
  const [onboardingVisible, setOnboardingVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [loadingActive, setLoadingActive] = useState(false)
  const [introRequested, setIntroRequested] = useState(false)

  useEffect(() => {
    const completed = sessionStorage.getItem(ONBOARDING_COMPLETED_KEY) === '1'
    setPortfolioSelected(completed)
    setOnboardingVisible(!completed)
    setReady(true)
  }, [])

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
    sessionStorage.setItem(ONBOARDING_COMPLETED_KEY, '1')
    setPortfolioSelected(true)
    setOnboardingVisible(false)
    setIntroRequested(true)
    setLoadingActive(window.matchMedia('(min-width: 768px)').matches)
  }

  return (
    <>
      {ready && portfolioSelected ? (
        <HomePageClient
          showIntro={introRequested}
          onLoadingComplete={() => setLoadingActive(false)}
        />
      ) : null}
      {ready && onboardingVisible && !portfolioSelected ? (
        <SiteOnboarding
          onPortfolioReady={selectPortfolio}
          onTransitionComplete={() => setOnboardingVisible(false)}
        />
      ) : null}
    </>
  )
}
