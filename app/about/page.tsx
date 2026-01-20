"use client"

import PageLayout from '@/components/layouts/PageLayout'
import Sidebar from '@/components/sections/about/Sidebar'
import HeroBanner from '@/components/sections/about/HeroBanner'
import StoryResponsibilities from '@/components/sections/about/StoryResponsibilities'
import StrengthsHowVision from '@/components/sections/about/StrengthsHowVision'

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="flex flex-col lg:flex-row border-l border-[#d5d5d5]">
        {/* Left Sidebar - Hidden on mobile, visible on desktop */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 w-full lg:w-auto">
          <HeroBanner />
          <StoryResponsibilities />
          <StrengthsHowVision />
        </div>
      </div>
    </PageLayout>
  )
}
