"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  avatar?: string
  avatarInitials?: string
}

interface QuoteTestimonialProps {
  testimonials: Testimonial[]
  className?: string
  showQuotes?: boolean
  quotesOpacity?: number
  animationSpeed?: number
}

export default function QuoteTestimonial({
  testimonials,
  className = '',
  showQuotes = true,
  quotesOpacity = 0.15,
  animationSpeed = 0.3,
}: QuoteTestimonialProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredAvatar, setHoveredAvatar] = useState<number | null>(null)

  const activeTestimonial = testimonials[activeIndex]

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex-1 flex flex-col justify-center bg-[#F8F8F8] p-6 sm:p-8">
        <div className="relative mb-6">
          {showQuotes && (
            <span
              className="absolute -top-4 -left-2 text-[60px] sm:text-[80px] font-serif text-[#00bcd4] leading-none select-none"
              style={{ opacity: quotesOpacity }}
            >
              &ldquo;&ldquo;
            </span>
          )}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTestimonial.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: animationSpeed, ease: [0.4, 0, 0.2, 1] }}
              className="text-[14px] sm:text-[15px] md:text-[16px] leading-[1.8] text-[#424242] relative z-10 pt-4"
            >
              {activeTestimonial.quote}
            </motion.p>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={`role-${activeTestimonial.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationSpeed }}
            className="text-[11px] sm:text-[12px] font-semibold text-[#666666] mb-6 uppercase tracking-[0.15em]"
          >
            {activeTestimonial.role}
          </motion.p>
        </AnimatePresence>

        <div className="flex items-center justify-center">
          <motion.button
            onClick={() => setActiveIndex((activeIndex + 1) % testimonials.length)}
            onMouseEnter={() => setHoveredAvatar(activeIndex)}
            onMouseLeave={() => setHoveredAvatar(null)}
            className="relative flex items-center gap-3 px-4 py-2 bg-[#424242]/5 rounded-full hover:bg-[#424242]/10 transition-colors border border-[#d5d5d5]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#d5d5d5]">
              {activeTestimonial.avatar ? (
                <Image
                  src={activeTestimonial.avatar}
                  alt={activeTestimonial.author}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#666666] flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {activeTestimonial.avatarInitials || activeTestimonial.author.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <AnimatePresence mode="wait">
              <motion.span
                key={`name-${activeTestimonial.id}`}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                transition={{ duration: animationSpeed }}
                className="text-[#424242] text-[13px] sm:text-[14px] font-medium pr-2"
              >
                {activeTestimonial.author}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeIndex === index ? 'bg-[#00bcd4] w-4' : 'bg-[#d5d5d5]'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
