"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ServiceItem {
  id: string
  title: string
  previewImage?: string
  description?: string
}

interface ServiceHoverRevealProps {
  items: ServiceItem[]
  className?: string
  revealStyle?: 'fade' | 'slide-up' | 'overlay'
  activeColor?: string
  layout?: 'list' | 'grid'
  gridCols?: number
}

export default function ServiceHoverReveal({
  items,
  className = '',
  revealStyle = 'fade',
  activeColor = '#1342FF',
  layout = 'list',
  gridCols = 2,
}: ServiceHoverRevealProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [activeItem, setActiveItem] = useState<string | null>(null)

  const revealVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    'slide-up': {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    overlay: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  }

  const currentVariant = revealVariants[revealStyle]

  const gridClassMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }
  
  const gridClass = layout === 'grid' 
    ? `grid ${gridClassMap[gridCols] || 'grid-cols-2'} gap-4` 
    : 'grid grid-cols-1 gap-3'
    
  const buttonClass = layout === 'grid' 
    ? 'w-full text-center p-4 sm:p-5 rounded-lg border transition-all relative z-10 flex flex-col'
    : 'w-full text-left p-4 rounded-lg border transition-all relative z-10'

  return (
    <div className={`relative ${className}`}>
      <div className={gridClass}>
        {items.map((item) => (
          <div key={item.id} className="relative">
            <motion.button
              className={buttonClass}
              style={{
                borderColor: hoveredItem === item.id || activeItem === item.id ? activeColor : '#d5d5d5',
                backgroundColor: hoveredItem === item.id || activeItem === item.id ? '#F8F8F8' : 'white',
              }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setActiveItem(activeItem === item.id ? null : item.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {layout === 'grid' ? (
                <>
                  <div className="text-[clamp(11px,1.2vw,12px)] font-semibold text-[#666666] mb-1">
                    {item.id}
                  </div>
                  <div className="text-[clamp(13px,1.4vw,14px)] font-bold text-[#424242]">
                    {item.title}
                  </div>
                </>
              ) : (
                <span className="text-[clamp(13px,1.4vw,14px)] font-semibold text-[#424242]">
                  {item.title}
                </span>
              )}
            </motion.button>

            {/* Preview Reveal */}
            <AnimatePresence>
              {(hoveredItem === item.id || activeItem === item.id) && (item.previewImage || item.description) && (
                <motion.div
                  className="absolute left-0 right-0 mt-2 p-4 rounded-lg border border-[#d5d5d5] bg-white shadow-lg z-20"
                  variants={currentVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  {item.previewImage && (
                    <div className="relative w-full h-48 mb-3 rounded overflow-hidden">
                      <Image
                        src={item.previewImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {item.description && (
                    <p className="text-[clamp(12px,1.3vw,14px)] text-[#555555] leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

