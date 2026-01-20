"use client"
import { useEffect } from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"

export default function PixelCursor() {
  const cursorSize = 12
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 300 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const trailConfig = { damping: 40, stiffness: 200 }
  const trailX = useSpring(mouseX, trailConfig)
  const trailY = useSpring(mouseY, trailConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - cursorSize / 2)
      mouseY.set(e.clientY - cursorSize / 2)
    }
    window.addEventListener("mousemove", moveCursor)
    return () => window.removeEventListener("mousemove", moveCursor)
  }, [mouseX, mouseY])

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        className="fixed top-0 left-0 bg-black pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: cursorSize,
          height: cursorSize,
          x: springX,
          y: springY,
        }}
      />
      {/* Trailing Pixel (Delayed) */}
      <motion.div
        className="fixed top-0 left-0 bg-black/50 pointer-events-none z-[9998]"
        style={{
          width: cursorSize,
          height: cursorSize,
          x: trailX,
          y: trailY,
        }}
      />
    </>
  )
}

