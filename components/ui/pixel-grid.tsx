"use client"

import { useState, useEffect, useRef } from "react"

interface PixelState {
  id: string
  color: string
  timeout?: NodeJS.Timeout
}

export default function PixelGrid() {
  // Keep the decorative grid dimensions stable after hydration. Replacing a
  // large grid when the viewport is measured causes a visible layout shift.
  const [gridSize] = useState({ rows: 32, cols: 32 })
  const [litPixels, setLitPixels] = useState<Map<string, PixelState>>(new Map())
  const litPixelsRef = useRef(litPixels)
  const fadeOutDuration = 300

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360)
    const saturation = 70 + Math.random() * 30
    const lightness = 45 + Math.random() * 10
    return `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`
  }

  const handleMouseEnter = (row: number, col: number) => {
    const pixelId = `${row}-${col}`
    const currentPixel = litPixelsRef.current.get(pixelId)
    
    if (currentPixel?.timeout) {
      clearTimeout(currentPixel.timeout)
    }
    
    setLitPixels(prev => {
      const next = new Map(prev)
      next.set(pixelId, {
        id: pixelId, 
        color: currentPixel?.color || getRandomColor()
      })
      litPixelsRef.current = next
      return next
    })
  }

  const handleMouseLeave = (row: number, col: number) => {
    const pixelId = `${row}-${col}`
    const pixel = litPixelsRef.current.get(pixelId)
    
    if (pixel) {
      const timeout = setTimeout(() => {
        setLitPixels(prev => {
          const next = new Map(prev)
          next.delete(pixelId)
          litPixelsRef.current = next
          return next
        })
      }, fadeOutDuration)

      setLitPixels(prev => {
        const next = new Map(prev)
        next.set(pixelId, { ...pixel, timeout })
        litPixelsRef.current = next
        return next
      })
    }
  }

  useEffect(() => {
    return () => {
      litPixelsRef.current.forEach(pixel => {
        if (pixel.timeout) clearTimeout(pixel.timeout)
      })
    }
  }, [])

  return (
    <div className="absolute inset-0 bg-white overflow-hidden pointer-events-none">
      <div 
        className="absolute"
        style={{
          top: '-50%',
          left: '-50%',
          width: '200vw',
          height: '200vh',
        }}
      >
        <div 
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
            gap: '1px',
            backgroundColor: '#f3f4f6',
            transform: 'skew(-67deg, 30deg)',
            transformOrigin: 'center'
          }}
        >
          {Array.from({ length: gridSize.rows }, (_, row) =>
            Array.from({ length: gridSize.cols }, (_, col) => {
              const pixelId = `${row}-${col}`
              const pixel = litPixels.get(pixelId)
              
              return (
                <div
                  key={pixelId}
                  className="aspect-square bg-white pointer-events-auto"
                  style={{
                    backgroundColor: pixel?.color || undefined,
                    transition: `background-color ${fadeOutDuration}ms ease-out`
                  }}
                  onMouseEnter={() => handleMouseEnter(row, col)}
                  onMouseLeave={() => handleMouseLeave(row, col)}
                />
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

