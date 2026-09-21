'use client'

import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

interface CrowdCanvasProps {
  src: string
  rows?: number
  cols?: number
}
type Peep = {
  image: HTMLImageElement
  rect: [number, number, number, number]
  width: number
  height: number
  x: number
  y: number
  anchorY: number
  scaleX: number
  walk: gsap.core.Timeline | null
  render: (context: CanvasRenderingContext2D) => void
}

const randomRange = (min: number, max: number) => min + Math.random() * (max - min)

export function CrowdCanvas({ src, rows = 15, cols = 7 }: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const image = new Image()
    image.crossOrigin = 'anonymous'

    const stage = { width: 0, height: 0 }
    const allPeeps: Peep[] = []
    const availablePeeps: Peep[] = []
    const crowd: Peep[] = []

    const createPeep = (rect: [number, number, number, number]): Peep => {
      const peep: Peep = {
        image,
        rect,
        width: rect[2],
        height: rect[3],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        render: (renderContext) => {
          renderContext.save()
          renderContext.translate(peep.x, peep.y)
          renderContext.scale(peep.scaleX, 1)
          renderContext.drawImage(image, ...peep.rect, 0, 0, peep.width, peep.height)
          renderContext.restore()
        },
      }
      return peep
    }

    const resetPeep = (peep: Peep) => {
      const direction = Math.random() > 0.5 ? 1 : -1
      const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random())
      const startY = stage.height - peep.height + offsetY

      peep.x = direction === 1 ? -peep.width : stage.width + peep.width
      peep.y = startY
      peep.anchorY = startY
      peep.scaleX = direction

      return { endX: direction === 1 ? stage.width : 0, startY }
    }

    const removePeep = (peep: Peep) => {
      const index = crowd.indexOf(peep)
      if (index !== -1) crowd.splice(index, 1)
      availablePeeps.push(peep)
    }

    const addPeep = () => {
      if (!availablePeeps.length) return
      const peep = availablePeeps.splice(Math.floor(Math.random() * availablePeeps.length), 1)[0]
      const { endX, startY } = resetPeep(peep)
      const duration = randomRange(7, 12)
      const walk = gsap.timeline({
        onComplete: () => {
          removePeep(peep)
          addPeep()
        },
      })

      walk.to(peep, { duration, x: endX, ease: 'none' }, 0)
      walk.to(peep, { duration: 0.25, repeat: Math.round(duration / 0.25), yoyo: true, y: startY - 10 }, 0)
      peep.walk = walk
      crowd.push(peep)
      crowd.sort((first, second) => first.anchorY - second.anchorY)
    }

    const resize = () => {
      stage.width = canvas.clientWidth
      stage.height = canvas.clientHeight
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.max(1, Math.round(stage.width * ratio))
      canvas.height = Math.max(1, Math.round(stage.height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      crowd.forEach((peep) => peep.walk?.kill())
      crowd.length = 0
      availablePeeps.length = 0
      availablePeeps.push(...allPeeps)
      while (availablePeeps.length) addPeep()
    }

    const render = () => {
      context.clearRect(0, 0, stage.width, stage.height)
      crowd.forEach((peep) => peep.render(context))
    }

    const initialize = () => {
      const rectWidth = image.naturalWidth / rows
      const rectHeight = image.naturalHeight / cols
      for (let index = 0; index < rows * cols; index += 1) {
        allPeeps.push(createPeep([
          (index % rows) * rectWidth,
          Math.floor(index / rows) * rectHeight,
          rectWidth,
          rectHeight,
        ]))
      }
      resize()
      gsap.ticker.add(render)
    }

    image.onload = initialize
    image.src = src
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      gsap.ticker.remove(render)
      crowd.forEach((peep) => peep.walk?.kill())
    }
  }, [cols, rows, src])

  return <canvas ref={canvasRef} aria-hidden="true" className="site-onboarding__crowd-canvas" />
}
