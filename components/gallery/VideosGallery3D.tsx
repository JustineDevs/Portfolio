"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface GalleryImage {
  id: string
  src: string
  alt?: string
}

interface VideosGallery3DProps {
  images?: GalleryImage[]
  title?: string
  className?: string
  duration?: number
  hoverPause?: boolean
  titleColor?: string
  titleGlow?: string
  visibleCount?: number
}

const defaultImages: GalleryImage[] = [
  { id: '1', src: '/v2/Gallery/pm_1741250227190_cmp.jpg', alt: 'Gallery 1' },
  { id: '2', src: '/v2/Gallery/pm_1741250227058_cmp.jpg', alt: 'Gallery 2' },
  { id: '3', src: '/v2/Gallery/pm_1741250226907_cmp.jpg', alt: 'Gallery 3' },
  { id: '4', src: '/v2/Gallery/pm_1741249191757_cmp.jpg', alt: 'Gallery 4' },
  { id: '5', src: '/v2/Gallery/pm_1741249190476_cmp.jpg', alt: 'Gallery 5' },
  { id: '6', src: '/v2/Gallery/pm_1741249190205_cmp.jpg', alt: 'Gallery 6' },
  { id: '7', src: '/v2/Gallery/Messenger_creation_FADDF1E8-D575-4DAC-AAEB-CCEFEBE965B1.jpg', alt: 'Gallery 7' },
  { id: '8', src: '/v2/Gallery/Messenger_creation_DF62502C-CA8E-41B9-9BE1-F52B2C9298EC.jpg', alt: 'Gallery 8' },
  { id: '9', src: '/v2/Gallery/Messenger_creation_CF8B5399-129A-4B6F-9A88-172BA9FC419D.jpg', alt: 'Gallery 9' },
  { id: '10', src: '/v2/Gallery/Messenger_creation_B06BF6ED-68C5-42CD-95DA-75D294AF2494.jpg', alt: 'Gallery 10' },
  { id: '11', src: '/v2/Gallery/Messenger_creation_4DF938AE-F6E3-489B-87BE-F06E74273F90.jpg', alt: 'Gallery 11' },
  { id: '12', src: '/v2/Gallery/Messenger_creation_35FE7770-4068-4ABB-A9BE-2269C07716ED.jpg', alt: 'Gallery 12' },
  { id: '13', src: '/v2/Gallery/Messenger_creation_20D35664-E652-4939-922C-F0CC02CC6658.jpg', alt: 'Gallery 13' },
  { id: '14', src: '/v2/Gallery/Messenger_creation_1F28856F-227B-4D57-B117-A9A6C92CA89C.jpg', alt: 'Gallery 14' },
  { id: '15', src: '/v2/Gallery/IMG_3706.jpg', alt: 'Gallery 15' },
  { id: '16', src: '/v2/Gallery/IMG_20250920_150609.jpg', alt: 'Gallery 16' },
  { id: '17', src: '/v2/Gallery/IMG_20250920_150608.jpg', alt: 'Gallery 17' },
  { id: '18', src: '/v2/Gallery/IMG_20250510_132254_406.jpg', alt: 'Gallery 18' },
  { id: '19', src: '/v2/Gallery/FB_IMG_1765793511625.jpg', alt: 'Gallery 19' },
  { id: '20', src: '/v2/Gallery/00789c9c-d5e8-4772-9c02-5915747bb69e.jpg', alt: 'Gallery 20' },
  { id: '21', src: '/v2/Gallery/4DF938AE-F6E3-489B-87BE-F06E74273F90.jpg', alt: 'Gallery 21' },
  { id: '22', src: '/v2/Gallery/1F28856F-227B-4D57-B117-A9A6C92CA89C.jpg', alt: 'Gallery 22' },
  { id: '23', src: '/v2/Gallery/received_768721005790203.jpg', alt: 'Gallery 23' },
  { id: '24', src: '/v2/Gallery/received_25256485190624185.jpg', alt: 'Gallery 24' },
  { id: '25', src: '/v2/Gallery/received_24236310572737095.jpg', alt: 'Gallery 25' },
]

interface ImagePosition {
  x: number
  y: number
  z: number
  delay: number
  duration: number
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function VideosGallery3D({
  images = defaultImages,
  title = 'COMMUNITY',
  className = '',
  duration = 20,
  hoverPause = true,
  titleColor = '#00bcd4',
  titleGlow = '0 0 40px rgba(0,188,212,0.8), 0 0 80px rgba(0,188,212,0.4)',
  visibleCount = 8,
}: VideosGallery3DProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentBatch, setCurrentBatch] = useState<GalleryImage[]>(() => {
    const seed = 12345
    const shuffled = shuffleArray(images, seed)
    return shuffled.slice(0, visibleCount)
  })
  const [batchSeed, setBatchSeed] = useState(12345)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const seed = Date.now()
    const shuffled = shuffleArray(images, seed)
    setCurrentBatch(shuffled.slice(0, visibleCount))
    setBatchSeed(seed)
  }, [images, visibleCount])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      const seed = Date.now()
      const shuffled = shuffleArray(images, seed)
      setCurrentBatch(shuffled.slice(0, visibleCount))
      setBatchSeed(seed)
    }, duration * 1000)
    return () => clearInterval(interval)
  }, [duration, images, visibleCount, mounted])

  const imagePositions = useMemo<ImagePosition[]>(() => {
    return currentBatch.map((_, index) => {
      const x = Number(((seededRandom(batchSeed + index * 3 + 1) - 0.5) * 80).toFixed(4))
      const y = Number(((seededRandom(batchSeed + index * 3 + 2) - 0.5) * 60).toFixed(4))
      const z = Number((-800 - seededRandom(batchSeed + index * 3 + 3) * 400).toFixed(4))
      const delay = Number(((index / currentBatch.length) * duration).toFixed(4))
      const imageDuration = Number((duration + seededRandom(batchSeed + index * 3 + 4) * 2).toFixed(4))
      
      return {
        x,
        y,
        z,
        delay,
        duration: imageDuration,
      }
    })
  }, [currentBatch.length, duration, batchSeed])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[#F8F8F8] ${className}`}
        style={{ perspective: '600px', perspectiveOrigin: '50% 0%' }}
      onMouseEnter={() => hoverPause && setIsPaused(true)}
      onMouseLeave={() => hoverPause && setIsPaused(false)}
    >
      <div 
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {mounted && currentBatch.length > 0 && currentBatch.map((image, index) => {
            const pos = imagePositions[index]
            if (!pos) return null
            return (
              <motion.div
                key={image.id}
                className="absolute left-1/2 top-[30%]"
                style={{
                  transformStyle: 'preserve-3d',
                  marginLeft: '-200px',
                  marginTop: '-150px',
                }}
              initial={{
                x: pos.x,
                y: pos.y,
                z: pos.z,
                opacity: 0,
              }}
              animate={{
                z: [pos.z, 200],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: pos.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: pos.delay,
                times: [0, 0.1, 0.85, 1],
              }}
            >
                <motion.div 
                    className="relative w-[240px] h-[180px] sm:w-[280px] sm:h-[200px] md:w-[360px] md:h-[260px] lg:w-[400px] lg:h-[300px] rounded-lg overflow-hidden border border-white/30"
                  style={{
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(0,188,212,0.2)',
                    animationPlayState: isPaused ? 'paused' : 'running',
                  }}
                  whileHover={{ 
                    scale: 1.3, 
                    boxShadow: '0 12px 48px rgba(0,0,0,0.6), 0 0 30px rgba(0,188,212,0.4)',
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || `Gallery ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, (max-width: 1024px) 360px, 400px"
                  />
                </motion.div>
            </motion.div>
          )
        })}
      </div>

      {title && (
        <motion.h3 
          className="absolute inset-0 flex items-center justify-center z-50 text-[clamp(32px,6vw,56px)] font-bold tracking-[0.2em] uppercase pointer-events-none"
          style={{
            color: titleColor,
            textShadow: titleGlow,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {title}
        </motion.h3>
      )}
    </div>
  )
}
