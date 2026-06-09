"use client"

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { getRenderableImageUrl, isHttpAssetUrl, isSvgAssetUrl, normalizeAssetUrl } from '@/lib/asset-urls'

interface LiquidImageProps {
  src: string
  alt: string
  className?: string
  strength?: number
  speed?: number
  size?: number
  priority?: boolean
}

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean
  }
}

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uStrength;
  varying vec2 vUv;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float dist = distance(uv, uMouse);
    float wave = sin(uTime * 3.0 + dist * 15.0) * (1.0 - smoothstep(0.0, 0.5, dist));
    float disp = wave * uHover * uStrength * 0.15;
    disp += noise(uv * 8.0 + uTime * 0.5) * uHover * uStrength * 0.03;
    pos.z += disp;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uSize;
  varying vec2 vUv;

  float grayscale(vec3 col) {
    return dot(col, vec3(0.299, 0.587, 0.114));
  }

  void main() {
    vec2 uv = vUv;

    float dist = distance(uv, uMouse);
    float revealRadius = uSize * (0.4 + sin(uTime * 2.0) * 0.05);
    float mask = smoothstep(revealRadius, revealRadius * 0.3, dist) * uHover;

    vec2 dispOffset = vec2(
      sin(uTime * 2.0 + uv.y * 10.0) * 0.003,
      cos(uTime * 2.0 + uv.x * 10.0) * 0.003
    ) * uHover;
    
    vec3 color = texture2D(uTexture, uv + dispOffset).rgb;
    float gray = grayscale(color);
    vec3 grayColor = vec3(gray);

    vec3 finalColor = mix(grayColor, color, mask);

    float rim = smoothstep(revealRadius * 0.9, revealRadius, dist) * uHover * 0.3;
    finalColor += rim * vec3(1.0);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

interface LiquidMeshProps {
  texture: THREE.Texture
  strength: number
  speed: number
  size: number
}

function LiquidMesh({ texture, strength, speed, size }: LiquidMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport, size: canvasSize } = useThree()
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const targetHover = useRef(0)
  const currentHover = useRef(0)

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHover: { value: 0 },
    uStrength: { value: strength },
    uSize: { value: size },
  }), [texture, strength, size])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime * speed
      
      currentHover.current += (targetHover.current - currentHover.current) * 0.1
      materialRef.current.uniforms.uHover.value = currentHover.current
      
      const currentMouse = materialRef.current.uniforms.uMouse.value
      currentMouse.x += (mouseRef.current.x - currentMouse.x) * 0.1
      currentMouse.y += (mouseRef.current.y - currentMouse.y) * 0.1
    }
  })

  const handlePointerMove = (e: THREE.Event) => {
    if (meshRef.current) {
      const intersect = e as unknown as { uv?: THREE.Vector2 }
      if (intersect.uv) {
        mouseRef.current.x = intersect.uv.x
        mouseRef.current.y = intersect.uv.y
      }
    }
  }

  return (
    <mesh
      ref={meshRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => { targetHover.current = 1 }}
      onPointerLeave={() => { targetHover.current = 0 }}
    >
      <planeGeometry args={[viewport.width, viewport.height, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

function LiquidScene({ src, strength, speed, size }: { src: string; strength: number; speed: number; size: number }) {
  const texture = useTexture(src)
  
  useEffect(() => {
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
  }, [texture])

  return <LiquidMesh texture={texture} strength={strength} speed={speed} size={size} />
}

export default function LiquidImage({
  src,
  alt,
  className = '',
  strength = 0.5,
  speed = 0.8,
  size = 0.5,
  priority = false,
}: LiquidImageProps) {
  const [isClient, setIsClient] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isTextureReady, setIsTextureReady] = useState(false)
  const [webglEnabled, setWebglEnabled] = useState(false)
  const normalizedSrc = useMemo(() => normalizeAssetUrl(src), [src])
  const renderableSrc = useMemo(() => getRenderableImageUrl(normalizedSrc), [normalizedSrc])
  const fallbackSrc = '/v2/showcase/banner.png'
  const shouldUseCanvas =
    isClient &&
    webglEnabled &&
    !hasError &&
    isTextureReady &&
    !isSvgAssetUrl(normalizedSrc) &&
    !isHttpAssetUrl(normalizedSrc) &&
    !renderableSrc.startsWith('/api/image/resolve')

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isSmallScreen = window.matchMedia('(max-width: 767px)').matches
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true

    if (prefersReducedMotion || isSmallScreen || saveData) {
      setWebglEnabled(false)
      return
    }

    const canvas = document.createElement('canvas')
    const context =
      canvas.getContext('webgl2', { antialias: false }) ||
      canvas.getContext('webgl', { antialias: false }) ||
      canvas.getContext('experimental-webgl', { antialias: false })

    setWebglEnabled(Boolean(context))
  }, [])

  useEffect(() => {
    if (!isClient) return

    setHasError(false)
    setIsTextureReady(false)

    if (!normalizedSrc) {
      setHasError(true)
      return
    }

    if (isSvgAssetUrl(normalizedSrc) || !webglEnabled) {
      setIsTextureReady(true)
      return
    }

    let cancelled = false
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.decoding = 'async'
    image.onload = () => {
      if (!cancelled) {
        setIsTextureReady(true)
      }
    }
    image.onerror = () => {
      if (!cancelled) {
        setHasError(true)
      }
    }
    image.src = renderableSrc

    return () => {
      cancelled = true
      image.onload = null
      image.onerror = null
    }
  }, [isClient, normalizedSrc, renderableSrc, webglEnabled])

  if (!shouldUseCanvas) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <img
          src={hasError ? fallbackSrc : renderableSrc}
          alt={alt}
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
          onError={(event) => {
            if (event.currentTarget.src !== new URL(fallbackSrc, window.location.origin).toString()) {
              event.currentTarget.src = fallbackSrc
            }
            setHasError(true)
          }}
        />
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
        onError={() => setHasError(true)}
      >
        <React.Suspense fallback={null}>
          <LiquidScene src={renderableSrc} strength={strength} speed={speed} size={size} />
        </React.Suspense>
      </Canvas>
    </div>
  )
}
