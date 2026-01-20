'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProviderProps {
  children: ReactNode
}

/**
 * Page Transition Provider
 * Simple fade-in transition without exit animation to prevent white screens
 * Background is always visible, only new content fades in
 */
export default function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const pathname = usePathname()

  return (
    <div 
      className="min-h-screen bg-[#F8F8F8]"
      style={{ 
        width: '100%',
        overflowX: 'hidden',
        position: 'relative',
        backgroundColor: '#F8F8F8',
      }}
    >
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
        style={{ 
          width: '100%',
          minHeight: '100%',
          position: 'relative',
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

