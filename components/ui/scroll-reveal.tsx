"use client"

import { useRef, useEffect, ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
  stagger?: number
  start?: string
  end?: string
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  direction = "up",
  stagger = 0,
  start = "top 80%",
  end = "top 20%",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      const getInitialProps = () => {
        switch (direction) {
          case "up":
            return { y: 60, opacity: 0 }
          case "down":
            return { y: -60, opacity: 0 }
          case "left":
            return { x: 60, opacity: 0 }
          case "right":
            return { x: -60, opacity: 0 }
          case "fade":
            return { opacity: 0 }
          default:
            return { y: 60, opacity: 0 }
        }
      }

      const elements = stagger > 0 && ref.current?.children
        ? Array.from(ref.current.children)
        : [ref.current]

      elements.forEach((element, index) => {
        gsap.fromTo(
          element,
          getInitialProps(),
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration,
            delay: delay + index * stagger,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start,
              end,
              toggleActions: "play none none reverse",
            },
          }
        )
      })
    }, ref)

    return () => ctx.revert()
  }, [delay, duration, direction, stagger, start, end])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

