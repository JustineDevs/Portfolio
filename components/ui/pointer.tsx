"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  type HTMLMotionProps,
} from "framer-motion"

import { cn } from "@/lib/utils"

/** Magic UI-style pointer that follows the pointer while it is over its parent. */
export function Pointer({
  className,
  style,
  children,
  ...props
}: HTMLMotionProps<"div">): ReactNode {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isActive, setIsActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const parentElement = containerRef.current?.parentElement
    if (!parentElement) return

    const handleMouseMove = (event: MouseEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setIsActive(true)
    }

    const handleMouseEnter = (event: MouseEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setIsActive(true)
    }

    const handleMouseLeave = () => setIsActive(false)

    parentElement.style.cursor = "none"
    parentElement.addEventListener("mousemove", handleMouseMove)
    parentElement.addEventListener("mouseenter", handleMouseEnter)
    parentElement.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      parentElement.style.cursor = ""
      parentElement.removeEventListener("mousemove", handleMouseMove)
      parentElement.removeEventListener("mouseenter", handleMouseEnter)
      parentElement.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [x, y])

  return (
    <>
      <div ref={containerRef} />
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="pointer-events-none fixed z-[9999]"
            style={{ top: y, left: x, ...style }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            {...props}
          >
            {children || (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="1"
                viewBox="0 0 16 16"
                height="24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                className={cn("rotate-[-70deg] stroke-white text-black", className)}
              >
                <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
              </svg>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
