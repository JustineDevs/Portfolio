"use client"

import React from 'react'
import CornerDot from '@/components/ui/CornerDot'
import Image from 'next/image'

export default function FeaturedBadgeCertificates() {
  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="bl" />
      <CornerDot position="br" />
      
      <div className="p-8 lg:p-12">
        <p className="text-[14px] text-[#666666] mb-6">
          Add this badge to your website to show you are featured achievements.
        </p>

        <div className="space-y-6">
          {/* Winning Achievements */}
          <div>
            <h3 className="text-[18px] font-bold text-[#424242] mb-4 tracking-[-0.01em]">
              Winning Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#424242] rounded-lg flex items-center justify-between">
                <span className="text-white text-[14px] font-medium">Winning on Metis Hackathon</span>
                <button className="px-4 py-1.5 bg-white text-[#424242] text-[12px] font-medium rounded hover:opacity-90 transition-opacity">
                  View
                </button>
              </div>
              <div className="p-4 bg-[#424242] rounded-lg flex items-center justify-between">
                <span className="text-white text-[14px] font-medium">Winning on Avalanche x402</span>
                <button className="px-4 py-1.5 bg-white text-[#424242] text-[12px] font-medium rounded hover:opacity-90 transition-opacity">
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Certificates */}
          <div>
            <h3 className="text-[18px] font-bold text-[#424242] mb-4 tracking-[-0.01em]">
              Certificates
            </h3>
            <div className="p-4 bg-[#424242] rounded-lg flex items-center justify-between">
              <span className="text-white text-[14px] font-medium">Featured on N/A</span>
              <button className="px-4 py-1.5 bg-white text-[#424242] text-[12px] font-medium rounded hover:opacity-90 transition-opacity">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

