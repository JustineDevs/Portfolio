"use client"

import * as React from "react"
import Image from "next/image"
import { motion, type Transition, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface DiagonalCarouselItem { src: string; title: string; alt?: string; layoutId?: string }
export interface DiagonalCarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: DiagonalCarouselItem[]
  activeIndex?: number
  defaultActiveIndex?: number
  onActiveIndexChange?: (index: number) => void
  onActiveItemClick?: (index: number) => void
  activeItemExpanded?: boolean
  loop?: boolean
  slideSize?: number
  rotationStep?: number
  verticalStep?: number
  inactiveScale?: number
  transition?: Transition
  showControls?: boolean
  showDots?: boolean
  viewportClassName?: string
  imageClassName?: string
  labelClassName?: string
  controlsClassName?: string
}

const DEFAULT_TRANSITION: Transition = { type: "spring", bounce: 0.16, duration: 0.85 }
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export function DiagonalCarousel({
  items, activeIndex, defaultActiveIndex = 0, onActiveIndexChange, onActiveItemClick,
  activeItemExpanded = false,
  loop = false, slideSize = 260, rotationStep = 30, verticalStep = 120,
  inactiveScale = 0.6, transition = DEFAULT_TRANSITION, showControls = true,
  showDots = true, viewportClassName, imageClassName, labelClassName, controlsClassName,
  className, onKeyDown, tabIndex, ...props
}: DiagonalCarouselProps) {
  const maxIndex = Math.max(0, items.length - 1)
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(() => clamp(defaultActiveIndex, 0, maxIndex))
  const currentIndex = clamp(activeIndex ?? uncontrolledIndex, 0, maxIndex)
  const prefersReducedMotion = useReducedMotion()
  const safeSlideSize = Math.max(120, slideSize)
  const safeInactiveScale = clamp(inactiveScale, 0.35, 1)
  const resolvedTransition = prefersReducedMotion ? { duration: 0 } : transition
  const selectSlide = React.useCallback((nextIndex: number) => {
    if (!items.length) return
    const resolvedIndex = loop ? (nextIndex + items.length) % items.length : clamp(nextIndex, 0, maxIndex)
    if (activeIndex === undefined) setUncontrolledIndex(resolvedIndex)
    onActiveIndexChange?.(resolvedIndex)
  }, [activeIndex, items.length, loop, maxIndex, onActiveIndexChange])
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === "ArrowLeft") { event.preventDefault(); selectSlide(currentIndex - 1) }
    if (event.key === "ArrowRight") { event.preventDefault(); selectSlide(currentIndex + 1) }
    if ((event.key === "Enter" || event.key === " ") && onActiveItemClick) {
      event.preventDefault()
      onActiveItemClick(currentIndex)
    }
  }
  if (!items.length) return null
  const isPreviousDisabled = !loop && currentIndex === 0
  const isNextDisabled = !loop && currentIndex === maxIndex

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Diagonal project carousel" tabIndex={tabIndex ?? 0} onKeyDown={handleKeyDown} className={cn("relative isolate h-full w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1342FF] focus-visible:ring-inset", className)} {...props}>
      <div className={cn("absolute inset-0 overflow-hidden", viewportClassName)}>
        <motion.div className="absolute left-1/2 top-[18%] flex w-fit" animate={{ x: -(currentIndex * safeSlideSize + safeSlideSize / 2) }} transition={resolvedTransition}>
          {items.map((item, index) => {
            const isActive = currentIndex === index
            const distance = index - currentIndex
            return (
              <motion.div key={`${item.src}-${index}`} className="flex shrink-0 flex-col items-center gap-3 will-change-transform" style={{ width: safeSlideSize }} animate={{ rotate: distance * rotationStep, scale: isActive ? 1 : safeInactiveScale, y: distance * verticalStep }} transition={resolvedTransition}>
                <motion.p className={cn("whitespace-nowrap text-sm font-medium", labelClassName)} animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.7 }} transition={{ duration: 0.3 }}>{item.title}</motion.p>
                <motion.button layoutId={item.layoutId} animate={{ opacity: isActive && !activeItemExpanded ? 1 : 0 }} type="button" aria-label={`Show ${item.title}`} aria-current={isActive ? "true" : undefined} className="aspect-square w-full cursor-pointer touch-manipulation rounded-2xl focus:outline-none focus-visible:outline-none" onClick={() => { if (!isActive) selectSlide(index); onActiveItemClick?.(index) }}>
                  <Image src={item.src} alt={item.alt ?? item.title} width={safeSlideSize} height={safeSlideSize} draggable={false} className={cn("h-full w-full select-none rounded-2xl object-cover shadow-xl", imageClassName)} unoptimized />
                </motion.button>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
      {showControls ? <div className={cn("absolute inset-x-4 bottom-48 z-10 mx-auto flex w-fit items-center justify-center gap-3 rounded-full border border-neutral-300/80 bg-neutral-200/80 px-2 text-neutral-700 shadow-sm backdrop-blur-sm", controlsClassName)}>
        <button type="button" aria-label="Show previous slide" disabled={isPreviousDisabled} className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1342FF] disabled:cursor-not-allowed disabled:opacity-35" onClick={() => selectSlide(currentIndex - 1)}><ChevronLeft className="size-5" /></button>
        {showDots ? <div className="flex items-center justify-center gap-2">{items.map((item, index) => <button key={`${item.title}-${index}`} type="button" aria-label={`Show slide ${index + 1}: ${item.title}`} aria-current={currentIndex === index ? "true" : undefined} className={cn("h-2 rounded-full bg-current transition-[width,opacity] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1342FF]", currentIndex === index ? "w-7 opacity-100" : "w-2 opacity-30")} onClick={() => selectSlide(index)} />)}</div> : null}
        <button type="button" aria-label="Show next slide" disabled={isNextDisabled} className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1342FF] disabled:cursor-not-allowed disabled:opacity-35" onClick={() => selectSlide(currentIndex + 1)}><ChevronRight className="size-5" /></button>
      </div> : null}
    </div>
  )
}
