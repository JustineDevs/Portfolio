"use client"

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface SpiralAnimationProps {
  dotSize?: number
  spacing?: number
  animationSpeed?: number
  color?: string
  className?: string
  isActive?: boolean
}

export default function SpiralAnimation({
  dotSize = 3,
  spacing = 15,
  animationSpeed = 1,
  color = '#d5d5d5',
  className = '',
  isActive = false,
}: SpiralAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const animationFrameRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    const draw = () => {
      if (!ctx || !canvas || !isActive) {
        animationFrameRef.current = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const maxRadius = Math.min(canvas.width, canvas.height) / 2

      timeRef.current += animationSpeed * 0.01

      for (let i = 0; i < 200; i++) {
        const angle = i * 0.1 + timeRef.current
        const radius = (i / 200) * maxRadius * 0.8
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        const opacity = 1 - (i / 200) * 0.8
        ctx.fillStyle = color
        ctx.globalAlpha = opacity * 0.6

        ctx.beginPath()
        ctx.arc(x, y, dotSize, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mounted, dotSize, spacing, animationSpeed, color, isActive])

  if (!mounted) return null

  return (
    <motion.div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  )
}

