"use client"

import PageLayout from '@/components/layouts/PageLayout'
import HeroTitle from '@/components/sections/experience/HeroTitle'
import TimelineNavigationSection from '@/components/sections/experience/TimelineNavigationSection'
import ActivitySection from '@/components/sections/ActivitySection'
import GalleryTestimonials from '@/components/sections/experience/GalleryTestimonials'
import PixeledCursorTrail from '@/components/ui/PixeledCursorTrail'

export default function ExperiencePage() {
  return (
    <>
      {/* Global Cursor Trail for Experience Page */}
      <PixeledCursorTrail
        pixelCount={20}
        pixelSize={4}
        shape="square"
        color="#424242"
        blur={false}
        fadeOut={true}
        progressiveScale={true}
        trailStyle="solid"
        animationPreset="fade"
        spacing={8}
        stiffness={100}
        damping={10}
        trailDuration={0.3}
      />
      
      <PageLayout>
        {/* Section 1: Hero Title */}
        <HeroTitle />
        
        {/* Section 2: Timeline Navigation & Card */}
        <TimelineNavigationSection />
        
        {/* Section 3: Activity (Heatmap) */}
        <ActivitySection />
        
        {/* Section 4: Gallery & Testimonials */}
        <GalleryTestimonials />
      </PageLayout>
    </>
  )
}
