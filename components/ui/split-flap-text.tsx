"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useMemo, useState, useCallback, useEffect, useRef } from "react"

interface SplitFlapTextProps {
  text: string
  className?: string
  speed?: number
  skipEntrance?: boolean
}

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("")

function SplitFlapTextInner({ text, className = "", speed = 50, skipEntrance = false }: SplitFlapTextProps) {
  const chars = useMemo(() => text.split(""), [text])
  const [animationKey, setAnimationKey] = useState(0)
  const [hasInitialized, setHasInitialized] = useState(skipEntrance)

  const handleMouseEnter = useCallback(() => {
    setAnimationKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (skipEntrance) {
      setHasInitialized(true)
      return
    }
    const timer = setTimeout(() => {
      setHasInitialized(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [skipEntrance])

  return (
    <div
      className={`inline-flex gap-[0.08em] items-center ${className}`}
      aria-label={text}
      onMouseEnter={handleMouseEnter}
      style={{ perspective: "1000px", fontSize: "inherit" }}
    >
      {chars.map((char, index) => (
        <SplitFlapChar
          key={index}
          char={char.toUpperCase()}
          index={index}
          animationKey={animationKey}
          skipEntrance={hasInitialized}
          speed={speed}
        />
      ))}
    </div>
  )
}

export function SplitFlapText(props: SplitFlapTextProps) {
  return <SplitFlapTextInner {...props} />
}

interface SplitFlapCharProps {
  char: string
  index: number
  animationKey: number
  skipEntrance: boolean
  speed: number
}

function SplitFlapChar({ char, index, animationKey, skipEntrance, speed }: SplitFlapCharProps) {
  const displayChar = CHARSET.includes(char) ? char : " "
  const isSpace = char === " "
  const [currentChar, setCurrentChar] = useState(skipEntrance ? displayChar : " ")
  const [isSettled, setIsSettled] = useState(skipEntrance)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const tileDelay = 0.15 * index

  const bgColor = isSettled ? "#424242" : "rgba(66, 66, 66, 0.2)"
  const textColor = isSettled ? "#ffffff" : "#666666"

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (isSpace) {
      setCurrentChar(" ")
      setIsSettled(true)
      return
    }

    setIsSettled(false)
    setCurrentChar(CHARSET[Math.floor(Math.random() * CHARSET.length)])

    const baseFlips = 8
    const startDelay = skipEntrance ? tileDelay * 400 : tileDelay * 800
    let flipIndex = 0
    let hasStartedSettling = false

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        const settleThreshold = baseFlips + index * 3

        if (flipIndex >= settleThreshold && !hasStartedSettling) {
          hasStartedSettling = true
          if (intervalRef.current) clearInterval(intervalRef.current)
          setCurrentChar(displayChar)
          setIsSettled(true)
          return
        }
        setCurrentChar(CHARSET[Math.floor(Math.random() * CHARSET.length)])
        flipIndex++
      }, speed)
    }, startDelay)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [displayChar, isSpace, tileDelay, animationKey, skipEntrance, index, speed])

  if (isSpace) {
    return (
      <div
        style={{
          width: "0.3em",
        }}
      />
    )
  }

  return (
    <motion.div
      initial={skipEntrance ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: tileDelay, duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        fontSize: "1em",
        width: "0.65em",
        height: "1.05em",
        backgroundColor: bgColor,
        transformStyle: "preserve-3d",
        transition: "background-color 0.15s ease",
      }}
    >
      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/20 pointer-events-none z-10" />

      <div className="absolute inset-x-0 top-0 bottom-1/2 flex items-end justify-center overflow-hidden">
        <span
          className="block translate-y-[0.52em] leading-none transition-colors duration-150"
          style={{ color: textColor }}
        >
          {currentChar}
        </span>
      </div>

      <div className="absolute inset-x-0 top-1/2 bottom-0 flex items-start justify-center overflow-hidden">
        <span
          className="-translate-y-[0.52em] leading-none transition-colors duration-150"
          style={{ color: textColor }}
        >
          {currentChar}
        </span>
      </div>

      <motion.div
        key={`${animationKey}-${isSettled}`}
        initial={{ rotateX: -90 }}
        animate={{ rotateX: 0 }}
        transition={{
          delay: skipEntrance ? tileDelay * 0.5 : tileDelay + 0.15,
          duration: 0.25,
          ease: [0.22, 0.61, 0.36, 1],
        }}
        className="absolute inset-x-0 top-0 bottom-1/2 origin-bottom overflow-hidden"
        style={{
          backgroundColor: bgColor,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          transition: "background-color 0.15s ease",
        }}
      >
        <div className="flex h-full items-end justify-center">
          <span
            className="translate-y-[0.52em] leading-none transition-colors duration-150"
            style={{ color: textColor }}
          >
            {currentChar}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

