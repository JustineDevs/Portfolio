'use client'

import React from 'react'
import { tokens } from '@/lib/design-tokens'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  variant?: 'default' | 'dark' | 'bordered'
}

/**
 * Reusable card component with consistent styling
 * Supports hover effects and click interactions
 */
export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  variant = 'default',
}: CardProps) {
  const baseClasses = tokens.borders.rounded
  
  const variantClasses = {
    default: 'bg-white',
    dark: 'bg-[#424242] text-white',
    bordered: 'bg-white border border-[#d5d5d5]',
  }[variant]

  const hoverClasses = hover
    ? 'cursor-pointer hover:shadow-md transition-shadow duration-300'
    : ''

  const Component = onClick || hover ? motion.div : 'div'
  const motionProps = onClick || hover
    ? {
        whileHover: hover ? { scale: 1.02, y: -2 } : undefined,
        whileTap: onClick ? { scale: 0.98 } : undefined,
        transition: { duration: 0.2 },
      }
    : {}

  return (
    <Component
      className={`${baseClasses} ${variantClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  )
}

