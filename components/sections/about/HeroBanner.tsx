"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import CornerDot from '@/components/ui/CornerDot'
import MarkdownContent from '@/components/content/MarkdownContent'
import { getRenderableImageUrl, isSvgAssetUrl, normalizeAssetUrl } from '@/lib/asset-urls'

interface HeroBannerProps {
  title?: string
  subtitle?: string
  bodyMarkdown?: string
  imageUrl?: string
}

export default function HeroBanner({
  title = "",
  subtitle = "",
  bodyMarkdown = "",
  imageUrl = "/Justinedevs_Banner.png",
}: HeroBannerProps) {
  const normalizedImageUrl = normalizeAssetUrl(imageUrl)
  const renderableImageUrl = getRenderableImageUrl(normalizedImageUrl)
  const [isScanning, setIsScanning] = useState(true)
  const [scanComplete, setScanComplete] = useState(false)

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('aboutPageVisited')
    if (hasVisited) {
      setIsScanning(false)
      setScanComplete(true)
      return
    }

    const scanTimer = setTimeout(() => {
      setIsScanning(false)
      setScanComplete(true)
      sessionStorage.setItem('aboutPageVisited', 'true')
    }, 2500)

    return () => clearTimeout(scanTimer)
  }, [])

  return (
    <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
      <CornerDot position="tl" className="hidden xs:block" />
      <CornerDot position="tr" className="hidden xs:block" />
      
      <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12">
        <h1 className="text-[28px] xs:text-[36px] sm:text-[42px] md:text-[48px] lg:text-[64px] font-bold text-[#424242] tracking-tight mb-4 xs:mb-5 sm:mb-6 leading-tight">
          {title}
        </h1>
        
        <p className="text-[14px] xs:text-[16px] sm:text-[18px] lg:text-[20px] text-[#666666] mb-5 xs:mb-6 sm:mb-8 italic">
          {subtitle}
        </p>

        {bodyMarkdown.trim() ? (
          <div className="mb-5 xs:mb-6 sm:mb-8 max-w-3xl text-[#555555]">
            <MarkdownContent
              markdown={bodyMarkdown}
              className="[&_p]:text-[13px] xs:[&_p]:text-[14px] sm:[&_p]:text-[15px] [&_p]:leading-[1.9]"
            />
          </div>
        ) : null}

        <div className="relative w-full aspect-[3/1] rounded-lg overflow-hidden border border-[#d5d5d5] bg-black">
          <div 
            className={`absolute inset-0 transition-opacity duration-1000 ${scanComplete ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={renderableImageUrl}
              alt="Justine Devs Banner"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 375px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1500px"
              unoptimized={isSvgAssetUrl(normalizedImageUrl) || renderableImageUrl.startsWith("/api/image/resolve")}
            />
          </div>

          {isScanning && (
            <>
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 2px,
                      rgba(0, 255, 255, 0.03) 2px,
                      rgba(0, 255, 255, 0.03) 4px
                    )
                  `,
                }}
              />

              <div 
                className="absolute left-0 right-0 h-[2px] pointer-events-none animate-scan-line"
                style={{
                  background: 'linear-gradient(90deg, transparent, #00ffff, #00ffff, transparent)',
                  boxShadow: '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px rgba(0, 255, 255, 0.5)',
                }}
              />

              <div 
                className="absolute inset-0 pointer-events-none animate-edge-scan"
                style={{
                  border: '2px solid transparent',
                  borderImage: 'linear-gradient(var(--angle, 0deg), #00ffff, transparent, transparent, transparent) 1',
                }}
              />

              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ffff" stopOpacity="1">
                      <animate attributeName="offset" values="0;1;0" dur="2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="#00ffff" stopOpacity="0">
                      <animate attributeName="offset" values="0.5;1.5;0.5" dur="2s" repeatCount="indefinite" />
                    </stop>
                  </linearGradient>
                </defs>
                <rect 
                  x="1" 
                  y="1" 
                  width="calc(100% - 2px)" 
                  height="calc(100% - 2px)" 
                  fill="none" 
                  stroke="url(#edgeGradient)" 
                  strokeWidth="2"
                  className="animate-edge-trace"
                  style={{
                    strokeDasharray: '1000',
                    strokeDashoffset: '1000',
                  }}
                />
              </svg>

              <div className="absolute bottom-4 left-4 font-mono text-xs text-cyan-400 animate-pulse">
                <span className="opacity-80">SCANNING...</span>
              </div>

              <div className="absolute top-4 right-4 font-mono text-xs text-cyan-400">
                <span className="animate-blink">●</span> PROCESSING
              </div>

              <div 
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />
            </>
          )}

          {!isScanning && !scanComplete && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="font-mono text-cyan-400 text-sm animate-pulse">
                DECODING...
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scan-line {
          0% {
            top: 0%;
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 1;
          }
        }

        @keyframes edge-trace {
          0% {
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }

        :global(.animate-scan-line) {
          animation: scan-line 1.5s ease-in-out infinite;
        }

        :global(.animate-edge-trace) {
          animation: edge-trace 2s ease-out forwards;
        }

        :global(.animate-blink) {
          animation: blink 1s infinite;
        }
      `}</style>
    </section>
  )
}
