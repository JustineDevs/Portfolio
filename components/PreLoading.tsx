'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type LoaderPhase = 'loading' | 'curtain' | 'complete'

const CURTAIN_DURATION = 650
const MINIMUM_LOADING_TIME = 350
const ASSET_TIMEOUT = 1200

function waitForImage(image: HTMLImageElement) {
  if (image.complete) return Promise.resolve()

  return new Promise<void>((resolve) => {
    const finish = () => {
      image.removeEventListener('load', finish)
      image.removeEventListener('error', finish)
      resolve()
    }

    image.addEventListener('load', finish, { once: true })
    image.addEventListener('error', finish, { once: true })
  })
}

export default function PreLoading({ onComplete, ready = true }: { onComplete?: () => void; ready?: boolean }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<LoaderPhase>('loading')
  const [assetsReady, setAssetsReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const startedAt = useRef<number>(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    startedAt.current = performance.now()
    const images = Array.from(document.images).filter((image) => {
      if (image.loading !== 'lazy') return true
      return image.getBoundingClientRect().top < window.innerHeight * 1.5
    })

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    setReducedMotion(prefersReducedMotion)

    let cancelled = false
    let currentProgress = 4

    const updateProgress = (nextProgress: number) => {
      if (cancelled) return
      currentProgress = Math.max(currentProgress, Math.min(100, Math.round(nextProgress)))
      setProgress(currentProgress)
    }

    const progressTicker = window.setInterval(() => {
      if (currentProgress < 88) updateProgress(currentProgress + 3)
    }, 90)

    const waitForAssets = async () => {
      await Promise.race([
        Promise.all([
          ...images.map(waitForImage),
          document.fonts?.ready ?? Promise.resolve(),
        ]),
        new Promise<void>((resolve) => window.setTimeout(resolve, ASSET_TIMEOUT)),
      ])

      window.clearInterval(progressTicker)
      if (!cancelled) setAssetsReady(true)
    }

    void waitForAssets()

    return () => {
      cancelled = true
      window.clearInterval(progressTicker)
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (!ready || !assetsReady || phase !== 'loading') return

    if (reducedMotion) {
      setProgress(100)
      setPhase('complete')
      return
    }

    const elapsed = performance.now() - startedAt.current
    const delay = Math.max(0, MINIMUM_LOADING_TIME - elapsed)
    const revealTimer = window.setTimeout(() => {
      setProgress(100)
      setPhase('curtain')
      window.setTimeout(() => setPhase('complete'), CURTAIN_DURATION)
    }, delay)

    return () => window.clearTimeout(revealTimer)
  }, [assetsReady, phase, ready, reducedMotion])

  useEffect(() => {
    if (phase !== 'complete') return

    onComplete?.()

    const timeout = window.setTimeout(() => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }, 950)

    return () => window.clearTimeout(timeout)
  }, [onComplete, phase])

  if (phase === 'complete') return null

  return (
    <div
      className={`jstn-preloader ${phase === 'curtain' ? 'jstn-preloader--curtain' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${progress}%`}
    >
      <div className="jstn-preloader__content">
        <Image
          src="/JSTN Logo/SVG/Logo Header - B.svg"
          alt="JSTN"
          width={280}
          height={96}
          priority
          className="jstn-preloader__logo"
        />
        <div className="jstn-preloader__status">
          <span>Loading...</span>
          <span>{progress}%</span>
        </div>
      </div>

      <div className="jstn-preloader__curtain" aria-hidden="true">
        <div className="jstn-preloader__curtain-column jstn-preloader__curtain-column--1" />
        <div className="jstn-preloader__curtain-column jstn-preloader__curtain-column--2" />
        <div className="jstn-preloader__curtain-column jstn-preloader__curtain-column--3" />
        <div className="jstn-preloader__curtain-column jstn-preloader__curtain-column--4" />
      </div>
    </div>
  )
}
