"use client"

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SocialLinksBar from '@/components/ui/SocialLinksBar'
import PixelCursor from '@/components/ui/PixelCursor'
import AsciiBackground from '@/components/ui/AsciiBackground'
import PreLoading from '@/components/PreLoading'

interface PageLayoutProps {
  children: React.ReactNode
  showPreLoading?: boolean
}

export default function PageLayout({ children, showPreLoading = false }: PageLayoutProps) {
  const [isLoading, setIsLoading] = useState(showPreLoading)

  useEffect(() => {
    if (showPreLoading) {
      setTimeout(() => {
        setIsLoading(false)
      }, 3500)
    } else {
      setIsLoading(false)
    }
  }, [showPreLoading])

  return (
    <>
      {showPreLoading && isLoading && <PreLoading />}
      <div className="min-h-screen bg-[#F8F8F8] relative overflow-x-hidden">
        <PixelCursor />
        <AsciiBackground />
        
        <SocialLinksBar />
        <Navbar />

        <main id="main-content" className="w-[95%] xs:w-[92%] sm:w-[90%] md:w-[88%] lg:w-[82%] xl:w-[75%] 2xl:w-[70%] 3xl:max-w-[1600px] mx-auto pb-4 xs:pb-6 sm:pb-8 relative z-10 overflow-x-hidden">
          {children}
          <Footer />
        </main>
      </div>
    </>
  )
}

