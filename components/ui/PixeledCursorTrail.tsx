"use client"

import React, { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface PixeledCursorTrailProps {
  pixelCount?: number
  pixelSize?: number
  shape?: 'square' | 'circle'
  color?: string
  blur?: boolean
  fadeOut?: boolean
  progressiveScale?: boolean
  trailStyle?: 'solid' | 'dashed' | 'dotted' | 'wave' | 'zigzag'
  animationPreset?: 'fade' | 'pulse' | 'strobe' | 'rainbow' | 'wave' | 'none'
  spacing?: number
  stiffness?: number
  damping?: number
  trailDuration?: number
}

interface Pixel {
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  scale: number
  hue?: number
}

export default function PixeledCursorTrail({
  pixelCount = 20,
  pixelSize = 4,
  shape = 'square',
  color = '#424242',
  blur = false,
  fadeOut = true,
  progressiveScale = true,
  trailStyle = 'solid',
  animationPreset = 'fade',
  spacing = 8,
  stiffness = 100,
  damping = 10,
  trailDuration = 0.3,
}: PixeledCursorTrailProps) {
  const [mounted, setMounted] = useState(false)
  const [pixels, setPixels] = useState<Pixel[]>([])
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const springX = useSpring(targetX, { stiffness, damping })
  const springY = useSpring(targetY, { stiffness, damping })
  const animationFrameRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    setMounted(true)
    const initialPixels: Pixel[] = Array.from({ length: pixelCount }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      opacity: 0,
      scale: 1,
      hue: animationPreset === 'rainbow' ? Math.random() * 360 : undefined,
    }))
    setPixels(initialPixels)

    const handleMouseMove = (e: MouseEvent) => {
      targetX.set(e.clientX)
      targetY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      timeRef.current += 0.016

      setPixels((prev) => {
        const currentX = springX.get()
        const currentY = springY.get()
        const newPixels: Pixel[] = []

        prev.forEach((pixel, index) => {
          const prevPixel = index === 0 
            ? { x: currentX, y: currentY }
            : newPixels[index - 1]

          const dx = prevPixel.x - pixel.x
          const dy = prevPixel.y - pixel.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          let newX = pixel.x
          let newY = pixel.y
          let newOpacity = pixel.opacity
          let newScale = pixel.scale
          let newHue = pixel.hue

          if (distance > spacing) {
            newX = prevPixel.x - (dx / distance) * spacing
            newY = prevPixel.y - (dy / distance) * spacing
            newOpacity = 1
          } else {
            newX = pixel.x + (prevPixel.x - pixel.x) * 0.2
            newY = pixel.y + (prevPixel.y - pixel.y) * 0.2
            if (fadeOut) {
              newOpacity = Math.max(0, pixel.opacity - 0.05)
            }
          }

          if (progressiveScale) {
            newScale = 1 - (index / pixelCount) * 0.5
          }

          if (animationPreset === 'rainbow' && newHue !== undefined) {
            newHue = (newHue + 2) % 360
          }

          if (animationPreset === 'pulse') {
            newScale = 1 + Math.sin(timeRef.current * 2 + index) * 0.2
          }

          if (animationPreset === 'wave') {
            newOpacity = 0.5 + Math.sin(timeRef.current * 2 + index * 0.5) * 0.5
            newScale = 1 + Math.sin(timeRef.current * 2 + index * 0.3) * 0.1
          }

          newPixels.push({
            x: newX,
            y: newY,
            vx: dx * 0.1,
            vy: dy * 0.1,
            opacity: newOpacity,
            scale: newScale,
            hue: newHue,
          })
        })

        return newPixels
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mounted, pixelCount, spacing, stiffness, damping, fadeOut, progressiveScale, animationPreset, springX, springY])

  if (!mounted) return null

  const getPixelColor = (pixel: Pixel) => {
    if (animationPreset === 'rainbow' && pixel.hue !== undefined) {
      return `hsl(${pixel.hue}, 70%, 50%)`
    }
    return color
  }

  const getPixelStyle = (pixel: Pixel, index: number) => {
    let offsetX = 0
    let offsetY = 0

    if (trailStyle === 'wave') {
      offsetY = Math.sin(timeRef.current * 2 + index * 0.5) * 5
    } else if (trailStyle === 'zigzag') {
      offsetX = (index % 2 === 0 ? 1 : -1) * 3
    } else if (trailStyle === 'dashed' && index % 3 !== 0) {
      return { display: 'none' }
    } else if (trailStyle === 'dotted' && index % 2 !== 0) {
      return { display: 'none' }
    }

    return {
      position: 'fixed' as const,
      left: `${pixel.x + offsetX}px`,
      top: `${pixel.y + offsetY}px`,
      width: `${pixelSize * pixel.scale}px`,
      height: `${pixelSize * pixel.scale}px`,
      backgroundColor: getPixelColor(pixel),
      opacity: pixel.opacity,
      borderRadius: shape === 'circle' ? '50%' : '0',
      pointerEvents: 'none' as const,
      transform: 'translate(-50%, -50%)',
      filter: blur ? 'blur(2px)' : 'none',
      zIndex: 9999,
    }
  }

  return (
    <>
      {pixels.map((pixel, index) => (
        <div
          key={index}
          style={getPixelStyle(pixel, index)}
        />
      ))}
    </>
  )
}

