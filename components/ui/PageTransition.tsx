'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PageTransitionProps {
  children: React.ReactNode
}

/**
 * Page transition wrapper for smooth page changes
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [displayLocation, setDisplayLocation] = useState(pathname)

  useEffect(() => {
    if (pathname !== displayLocation) {
      setDisplayLocation(pathname)
    }
  }, [pathname, displayLocation])

  return (
    <motion.div
      key={displayLocation}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

