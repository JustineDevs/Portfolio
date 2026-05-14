'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'

interface SkeletonLoaderProps {
  className?: string
  variant?: 'text' | 'card' | 'circle' | 'rect'
  width?: string
  height?: string
  count?: number
}

/**
 * Skeleton loader component for loading states
 * Provides smooth shimmer animation
 */
export default function SkeletonLoader({
  className = '',
  variant = 'rect',
  width,
  height,
  count = 1,
}: SkeletonLoaderProps) {
  useEffect(() => {
    // Inject shimmer keyframes if not already present
    if (typeof document !== 'undefined' && !document.getElementById('shimmer-keyframes')) {
      const style = document.createElement('style')
      style.id = 'shimmer-keyframes'
      style.textContent = `
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const baseClasses = 'bg-[#e0e0e0] rounded'
  
  const variantClasses = {
    text: 'h-4',
    card: 'h-48',
    circle: 'rounded-full',
    rect: 'h-24',
  }[variant]

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`${baseClasses} ${variantClasses} ${className}`}
          style={{
            width: width || '100%',
            height: height || undefined,
            background: 'linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 50%, #e0e0e0 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  )
}

