"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

interface HeartButtonProps {
  className?: string
}

export default function HeartButton({ className = '' }: HeartButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [heartCount, setHeartCount] = useState(0)
  const [showReminder, setShowReminder] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchHeartCount = useCallback(async () => {
    try {
      const response = await fetch('/api/hearts')
      const data = await response.json()
      setHeartCount(data.likes || 0)
    } catch (error) {
      console.error('Failed to fetch heart count:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const liked = localStorage.getItem('portfolio-liked') === 'true'
      setIsLiked(liked)
    }
    fetchHeartCount()
  }, [fetchHeartCount])

  useEffect(() => {
    if (!isLiked && !hasInteracted && !isLoading) {
      const timer = setTimeout(() => {
        setShowReminder(true)
        setTimeout(() => {
          setShowReminder(false)
        }, 5000)
      }, 8000)

      return () => clearTimeout(timer)
    }
  }, [isLiked, hasInteracted, isLoading])

  const handleClick = async () => {
    if (isUpdating) return
    
    setIsUpdating(true)
    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    setHasInteracted(true)
    setShowReminder(false)

    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-liked', newLikedState.toString())
    }

    setHeartCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1))

    try {
      const response = await fetch('/api/hearts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: newLikedState ? 'like' : 'unlike' }),
      })
      const data = await response.json()
      if (data.likes !== undefined) {
        setHeartCount(data.likes)
      }
    } catch (error) {
      console.error('Failed to update heart count:', error)
      setHeartCount(prev => newLikedState ? Math.max(0, prev - 1) : prev + 1)
      setIsLiked(!newLikedState)
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio-liked', (!newLikedState).toString())
      }
    }
    
    setIsUpdating(false)
  }

  return (
    <div className={`relative flex items-center gap-1.5 ${className}`}>
      <motion.button
        onClick={handleClick}
        disabled={isUpdating}
        className="relative flex items-center justify-center disabled:opacity-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
        aria-label={isLiked ? 'Unlike this portfolio' : 'Like this portfolio'}
      >
        <motion.div
          animate={{
            scale: isLiked ? [1, 1.3, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={16}
            className={`transition-colors duration-300 ${
              isLiked 
                ? 'fill-[#ff6b6b] text-[#ff6b6b]' 
                : 'fill-none text-gray-400 hover:text-[#ff6b6b]'
            }`}
          />
        </motion.div>
      </motion.button>
      
      <span className="text-[11px] text-[#666666] font-medium min-w-[20px]">
        {isLoading ? '' : (heartCount > 0 ? heartCount.toLocaleString() : '')}
      </span>

      <AnimatePresence>
        {showReminder && !isLiked && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#424242] text-white text-[10px] font-medium rounded whitespace-nowrap pointer-events-none z-[9999] shadow-lg"
            style={{
              whiteSpace: 'nowrap',
            }}
          >
            <div className="flex items-center gap-2">
              <Heart size={12} className="fill-[#ff6b6b] text-[#ff6b6b]" />
              <span>Love the design? Give it a heart!</span>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-[#424242]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
