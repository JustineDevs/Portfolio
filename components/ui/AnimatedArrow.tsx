"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedArrowProps {
  className?: string
  color?: string
  size?: number
  direction?: 'right' | 'left' | 'up' | 'down' | 'curved-right'
  animated?: boolean
}

export default function AnimatedArrow({
  className = '',
  color = '#424242',
  size = 100,
  direction = 'curved-right',
  animated = true,
}: AnimatedArrowProps) {
  const arrowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  }

  const getArrowPath = () => {
    switch (direction) {
      case 'curved-right':
        return (
          <>
            <path
              d="M20 50 Q50 20, 80 50"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M70 45 L80 50 L70 55"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
            />
          </>
        )
      case 'right':
        return (
          <>
            <path
              d="M20 50 L80 50"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M70 45 L80 50 L70 55"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
            />
          </>
        )
      case 'left':
        return (
          <>
            <path
              d="M80 50 L20 50"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M30 45 L20 50 L30 55"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
            />
          </>
        )
      case 'up':
        return (
          <>
            <path
              d="M50 80 L50 20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M45 30 L50 20 L55 30"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
            />
          </>
        )
      case 'down':
        return (
          <>
            <path
              d="M50 20 L50 80"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M45 70 L50 80 L55 70"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
            />
          </>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      className={className}
      variants={animated ? arrowVariants : undefined}
      initial={animated ? 'initial' : false}
      animate={animated ? 'animate' : false}
      whileHover={animated ? 'hover' : undefined}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        stroke={color}
        strokeWidth="2"
        className="text-[#424242]"
      >
        {getArrowPath()}
      </svg>
    </motion.div>
  )
}

