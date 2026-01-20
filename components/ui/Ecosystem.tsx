"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface EcosystemProps {
  className?: string
  mainCircleSize?: number
  mainCircleOpacity?: number
  numCircles?: number
  children?: React.ReactNode
}

function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className,
}: {
  mainCircleSize?: number
  mainCircleOpacity?: number
  numCircles?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_bottom,white,transparent)]",
        className
      )}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70
        const opacity = mainCircleOpacity - i * 0.03
        const animationDelay = `${i * 0.06}s`
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid"
        const borderOpacity = 5 + i * 5

        return (
          <div
            key={i}
            className={cn(
              "absolute animate-ripple rounded-full bg-foreground/25 shadow-xl border",
              `[--i:${i}]`
            )}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              animationDelay,
              borderStyle,
              borderWidth: "1px",
              borderColor: `rgba(255, 255, 255, ${borderOpacity / 100})`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(1)",
            }}
          />
        )
      })}
    </div>
  )
}

interface OrbitingCirclesProps {
  className?: string
  children?: React.ReactNode
  reverse?: boolean
  duration?: number
  delay?: number
  radius?: number
  path?: boolean
  iconSize?: number
}

function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 160,
  path = true,
  iconSize = 30,
}: OrbitingCirclesProps) {
  const childCount = React.Children.count(children)
  const calculatedDelay = delay || (duration / childCount)
  
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-white/10 stroke-1"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      {React.Children.map(children, (child, index) => {
        const animationDelay = `-${(index / childCount) * duration}s`
        return (
          <div
            style={{
              "--duration": `${duration}s`,
              "--radius": `${radius}px`,
              "--icon-size": `${iconSize}px`,
              animationDelay,
            } as React.CSSProperties}
            className={cn(
              "absolute flex size-[var(--icon-size)] transform-gpu animate-orbit items-center justify-center rounded-full",
              { "[animation-direction:reverse]": reverse },
              className
            )}
          >
            {child}
          </div>
        )
      })}
    </>
  )
}

export default function Ecosystem({
  className,
  mainCircleSize = 80,
  mainCircleOpacity = 0.15,
  numCircles = 6,
  children,
}: EcosystemProps) {
  return (
    <div className={cn("relative w-full h-full", className)}>
      <Ripple
        mainCircleSize={mainCircleSize}
        mainCircleOpacity={mainCircleOpacity}
        numCircles={numCircles}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export { Ripple, OrbitingCircles }
