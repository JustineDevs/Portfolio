"use client"

import React from 'react'
import CornerDot from '@/components/ui/CornerDot'
import VideosGallery3D from '@/components/gallery/VideosGallery3D'
import QuoteTestimonial from '@/components/gallery/QuoteTestimonial'

export default function GalleryTestimonials() {
  const testimonials = [
    {
      id: '1',
      quote: "Doing a great job by giving alpha info's about the upcoming projects that has potential keeping the community active",
      author: 'Rommel Celestino',
      role: 'FOUNDER OF PROJECT ONE PERCENT',
      avatar: '/v2/Testimonials/Rommel Celestino.jpg',
    },
  ]

  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-[#F8F8F8]">
      <CornerDot position="bl" />
      <CornerDot position="br" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-b lg:border-b-0 lg:border-r border-[#d5d5d5]">
          <div className="border-b border-[#d5d5d5] relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#F8F8F8]" />
            <div className="p-4 sm:p-5">
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#383838] tracking-[-0.01em]">
                Gallery Area
              </h3>
            </div>
          </div>
          <div className="p-0">
            <VideosGallery3D
                title=""
                className="h-[350px] sm:h-[400px] md:h-[450px] rounded-none"
                duration={15}
                hoverPause={true}
              />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="border-b border-[#d5d5d5] relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#F8F8F8]" />
            <div className="p-4 sm:p-5">
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#383838] tracking-[-0.01em]">
                Testimonials
              </h3>
            </div>
          </div>
          <div className="flex-1">
            <QuoteTestimonial
              testimonials={testimonials}
              showQuotes={true}
              quotesOpacity={0.2}
              animationSpeed={0.3}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
