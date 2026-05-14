'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SplitFlapText } from './ui/split-flap-text'
import { AnimatedNoise } from './ui/animated-noise'

export default function PreLoading() {
  const [loadingState, setLoadingState] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // State 1: Dark background with "JUSTINE" (scramble)
    setTimeout(() => {
      setLoadingState(1)
    }, 800)

    // State 2: Light background with "JSTN" (split-flap)
    setTimeout(() => {
      setLoadingState(2)
    }, 2000)

    // Hide after both states
    setTimeout(() => {
      setIsVisible(false)
    }, 3500)
  }, [])

  // Prevent body scroll during loading
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {loadingState === 0 && (
            <motion.div
              className="absolute inset-0 bg-[#424242] flex items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatedNoise opacity={0.03} />
              <motion.h1
                className="text-6xl md:text-8xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                JUSTINE
              </motion.h1>
            </motion.div>
          )}

          {loadingState === 1 && (
            <motion.div
              className="absolute inset-0 bg-[#F8F8F8] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatedNoise opacity={0.02} />
              <div className="flex items-center justify-center">
                <SplitFlapText text="JSTN" speed={60} skipEntrance={false} />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

