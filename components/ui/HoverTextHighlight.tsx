"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface HoverTextHighlightProps {
  children: React.ReactNode
  variant?: 'background' | 'underline'
  direction?: 'left-to-right' | 'right-to-left'
  className?: string
  highlightColor?: string
  underlineThickness?: number
}

export default function HoverTextHighlight({
  children,
  variant = 'background',
  direction = 'left-to-right',
  className = '',
  highlightColor = '#F5F5F5',
  underlineThickness = 2,
}: HoverTextHighlightProps) {
  const [isHovered, setIsHovered] = useState(false)

  const backgroundVariants = {
    initial: {
      scaleX: 0,
      originX: direction === 'left-to-right' ? 0 : 1,
    },
    hover: {
      scaleX: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const underlineVariants = {
    initial: {
      scaleX: 0,
      originX: direction === 'left-to-right' ? 0 : 1,
    },
    hover: {
      scaleX: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  if (variant === 'background') {
    return (
      <span
        className={`relative inline-block ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.span
          className="absolute inset-0 bg-[#F5F5F5] rounded-sm -z-10"
          style={{ backgroundColor: highlightColor }}
          variants={backgroundVariants}
          initial="initial"
          animate={isHovered ? 'hover' : 'initial'}
        />
        {children}
      </span>
    )
  }

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#424242]"
        style={{
          height: `${underlineThickness}px`,
          backgroundColor: highlightColor === '#F5F5F5' ? '#424242' : highlightColor,
        }}
        variants={underlineVariants}
        initial="initial"
        animate={isHovered ? 'hover' : 'initial'}
      />
    </span>
  )
}

