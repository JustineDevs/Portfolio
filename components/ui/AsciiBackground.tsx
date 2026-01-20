"use client"
import { useEffect, useRef } from "react"

export default function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    
    const cols = Math.floor(width / 20)
    const ypos = Array(cols).fill(0)

    const matrix = () => {
      ctx.fillStyle = "#FAFAFA20"
      ctx.fillRect(0, 0, width, height)
      
      ctx.fillStyle = "#00000008"
      ctx.font = "10pt monospace"

      ypos.forEach((y, ind) => {
        const text = String.fromCharCode(Math.random() * 128)
        const x = ind * 20
        ctx.fillText(text, x, y)
        
        if (y > 100 + Math.random() * 10000) ypos[ind] = 0
        else ypos[ind] = y + 20
      })
    }

    const interval = setInterval(matrix, 50)
    
    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    
    window.addEventListener("resize", handleResize)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none opacity-50"
    />
  )
}

