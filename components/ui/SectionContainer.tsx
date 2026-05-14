'use client'

import React from 'react'
import CornerDot from './CornerDot'
import { tokens } from '@/lib/design-tokens'

interface SectionContainerProps {
  children: React.ReactNode
  className?: string
  showCornerDots?: boolean
  cornerDotPositions?: Array<'tl' | 'tr' | 'bl' | 'br'>
  borderStyle?: 'full' | 'section' | 'none'
}

/**
 * Reusable section container with consistent styling
 * Provides consistent borders, padding, and corner dots
 */
export default function SectionContainer({
  children,
  className = '',
  showCornerDots = true,
  cornerDotPositions = ['bl', 'br'],
  borderStyle = 'section',
}: SectionContainerProps) {
  const borderClasses = {
    full: tokens.borders.default,
    section: tokens.borders.section,
    none: '',
  }[borderStyle]

  return (
    <section className={`relative ${borderClasses} bg-white ${tokens.spacing.section} ${className}`}>
      {showCornerDots && cornerDotPositions.map((position) => (
        <CornerDot key={position} position={position} />
      ))}
      {children}
    </section>
  )
}

