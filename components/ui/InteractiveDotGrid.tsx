"use client"

import React, { useRef, useEffect, useState } from 'react'

interface InteractiveDotGridProps {
  dotSize?: number
  dotSpacing?: number
  dotColor?: string
  backgroundColor?: string
  distortionRadius?: number
  distortionStrength?: number
  animationSpeed?: number
  showCursor?: boolean
  glow?: boolean
  glowColor?: string
  className?: string
}

export default function InteractiveDotGrid({
  dotSize = 2,
  dotSpacing = 20,
  dotColor = '#E5E5E5',
  backgroundColor = 'transparent',
  distortionRadius = 100,
  distortionStrength = 0.8,
  animationSpeed = 0.15,
  showCursor = false,
  glow = true,
  glowColor = '#1342FF',
  className = '',
}: InteractiveDotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const mousePos = useRef({ x: -1000, y: -1000 })
  const targetMousePos = useRef({ x: -1000, y: -1000 })
  const animationFrameRef = useRef<number>()

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
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      targetMousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => {
      targetMousePos.current = { x: -1000, y: -1000 }
    }

    window.addEventListener('mousemove', handleMouseMove)
    containerRef.current.addEventListener('mouseleave', handleMouseLeave)

    const draw = () => {
      if (!ctx || !canvas || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      mousePos.current.x += (targetMousePos.current.x - mousePos.current.x) * animationSpeed
      mousePos.current.y += (targetMousePos.current.y - mousePos.current.y) * animationSpeed

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      const dpr = window.devicePixelRatio || 1
      ctx.scale(dpr, dpr)

      ctx.clearRect(0, 0, width, height)
      
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, width, height)
      }

      const cols = Math.ceil(width / dotSpacing) + 1
      const rows = Math.ceil(height / dotSpacing) + 1

      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const baseX = col * dotSpacing
          const baseY = row * dotSpacing

          const dx = mousePos.current.x - baseX
          const dy = mousePos.current.y - baseY
          const distance = Math.sqrt(dx * dx + dy * dy)

          let offsetX = 0
          let offsetY = 0
          let currentDotSize = dotSize
          let currentColor = dotColor

          if (distance < distortionRadius) {
            const normalizedDist = distance / distortionRadius
            const strength = Math.pow(1 - normalizedDist, 2) * distortionStrength
            const angle = Math.atan2(dy, dx)
            
            offsetX = -Math.cos(angle) * strength * 20
            offsetY = -Math.sin(angle) * strength * 20
            
            currentDotSize = dotSize * (1 + strength * 1.5)

            if (glow) {
              const glowIntensity = Math.pow(1 - normalizedDist, 1.5)
              currentColor = interpolateColor(dotColor, glowColor, glowIntensity * 0.8)
            }
          }

          const x = baseX + offsetX
          const y = baseY + offsetY

          if (glow && distance < distortionRadius) {
            const glowSize = currentDotSize * 3
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize)
            const normalizedDist = distance / distortionRadius
            const alpha = Math.pow(1 - normalizedDist, 2) * 0.3
            gradient.addColorStop(0, `${glowColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`)
            gradient.addColorStop(1, 'transparent')
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(x, y, glowSize, 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.fillStyle = currentColor
          ctx.beginPath()
          ctx.arc(x, y, currentDotSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mounted, dotSize, dotSpacing, dotColor, backgroundColor, distortionRadius, distortionStrength, animationSpeed, glow, glowColor])

  if (!mounted) return null

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={{ zIndex: 0, cursor: showCursor ? 'default' : 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ opacity: 1 }}
      />
      </div>
    )
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  const hex1 = color1.replace('#', '')
  const hex2 = color2.replace('#', '')
  
  const r1 = parseInt(hex1.substring(0, 2), 16)
  const g1 = parseInt(hex1.substring(2, 4), 16)
  const b1 = parseInt(hex1.substring(4, 6), 16)
  
  const r2 = parseInt(hex2.substring(0, 2), 16)
  const g2 = parseInt(hex2.substring(2, 4), 16)
  const b2 = parseInt(hex2.substring(4, 6), 16)
  
  const r = Math.round(r1 + (r2 - r1) * factor)
  const g = Math.round(g1 + (g2 - g1) * factor)
  const b = Math.round(b1 + (b2 - b1) * factor)
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

