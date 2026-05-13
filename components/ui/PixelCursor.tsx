"use client"
import { useEffect, useState } from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"
import { CURSOR_AVATAR_HOVER, type CursorAvatarHoverDetail } from "@/lib/cursor-avatar"

export default function PixelCursor() {
  const cursorSize = 12
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const [avatarHover, setAvatarHover] = useState(false)

  useEffect(() => {
    const onAvatarHover = (e: Event) => {
      const ce = e as CustomEvent<CursorAvatarHoverDetail>
      setAvatarHover(!!ce.detail?.over)
    }
    window.addEventListener(CURSOR_AVATAR_HOVER, onAvatarHover)
    return () => window.removeEventListener(CURSOR_AVATAR_HOVER, onAvatarHover)
  }, [])

  const trailConfig = { stiffness: 520, damping: 38, mass: 0.35 }
  const trailX = useSpring(mouseX, trailConfig)
  const trailY = useSpring(mouseY, trailConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      const half = cursorSize / 2
      mouseX.set(e.clientX - half)
      mouseY.set(e.clientY - half)
    }
    window.addEventListener("mousemove", moveCursor, { passive: true })
    return () => window.removeEventListener("mousemove", moveCursor)
  }, [mouseX, mouseY])

  const mainBlend = avatarHover ? "mix-blend-normal" : "mix-blend-difference"
  const mainBg = avatarHover ? "bg-[#424242]" : "bg-black"
  const trailBg = avatarHover ? "bg-[#424242]/45" : "bg-black/50"

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] ${mainBg} ${mainBlend}`}
        style={{
          width: cursorSize,
          height: cursorSize,
          x: mouseX,
          y: mouseY,
        }}
      />
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[9998] ${trailBg}`}
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

