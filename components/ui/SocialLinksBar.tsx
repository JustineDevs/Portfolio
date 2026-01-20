"use client"

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import HeartButton from './HeartButton'
import { 
  Instagram, 
  Linkedin, 
  Github,
  Music,
  MessageCircle,
  Send
} from 'lucide-react'

interface SocialLink {
  platform: 'instagram' | 'x' | 'linkedin' | 'github' | 'tiktok' | 'threads' | 'telegram'
  username: string
  enabled: boolean
}

interface SocialLinksBarProps {
  links?: SocialLink[]
  iconColor?: string
  hoverColor?: string
  blurIntensity?: number
}

// Smart URL Logic: Converts handles to full URLs
const buildSocialUrl = (platform: string, username: string): string => {
  const cleanUsername = username.replace(/^@/, '') // Remove @ if present
  
  switch (platform) {
    case 'instagram':
      return `https://instagram.com/${cleanUsername}`
    case 'x':
      return `https://x.com/${cleanUsername}`
    case 'linkedin':
      return `https://linkedin.com/in/${cleanUsername}`
    case 'github':
      return `https://github.com/${cleanUsername}`
    case 'tiktok':
      return `https://tiktok.com/@${cleanUsername}`
    case 'threads':
      return `https://threads.net/@${cleanUsername}`
    case 'telegram':
      return `https://t.me/${cleanUsername}`
    default:
      return '#'
  }
}

// Platform labels for tooltips
const platformLabels: Record<string, string> = {
  instagram: 'Instagram',
  x: 'X (Twitter)',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  tiktok: 'TikTok',
  threads: 'Threads',
  telegram: 'Telegram'
}

// X (Twitter) Icon Component
const XIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// Icon components mapping
const iconComponents: Record<string, React.ComponentType<any>> = {
  instagram: Instagram,
  x: XIcon,
  linkedin: Linkedin,
  github: Github,
  tiktok: Music,
  threads: MessageCircle,
  telegram: Send
}

export default function SocialLinksBar({ 
  links,
  iconColor = '#9CA3AF',
  hoverColor = '#424242',
  blurIntensity = 3
}: SocialLinksBarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0, width: 0 })
  const [mounted, setMounted] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Default social links if none provided
  const defaultLinks: SocialLink[] = [
    { platform: 'x', username: 'Trader2G', enabled: true },
    { platform: 'linkedin', username: 'justine-lupasi-444608295', enabled: true },
    { platform: 'telegram', username: 'TraderGOfficial', enabled: true },
    { platform: 'github', username: 'justinedevs', enabled: false },
    { platform: 'instagram', username: 'justinedevs', enabled: false },
    { platform: 'tiktok', username: 'justinedevs', enabled: false },
    { platform: 'threads', username: 'justinedevs', enabled: false },
  ]

  const socialLinks = links || defaultLinks
  const enabledLinks = socialLinks.filter(link => link.enabled)

  const handleMouseEnter = (index: number, event: React.MouseEvent<HTMLAnchorElement>) => {
    setHoveredIndex(index)
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 2,
      width: rect.width
    })
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
  }

  const hoveredLink = hoveredIndex !== null ? enabledLinks[hoveredIndex] : null
  const hoveredLabel = hoveredLink ? platformLabels[hoveredLink.platform] || hoveredLink.platform : ''

  return (
    <>
      <div className="h-[32px] xs:h-[36px] border-b border-[#d5d5d5] bg-white relative overflow-visible z-[100]">
        <div className="w-[95%] xs:w-[92%] sm:w-[90%] md:w-[88%] lg:w-[82%] xl:w-[75%] 2xl:w-[70%] 3xl:max-w-[1600px] mx-auto h-full flex justify-end items-center gap-2 xs:gap-3 flex-wrap relative overflow-visible px-2 xs:px-0">
          <div className="flex items-center gap-1.5 xs:gap-2 pr-1.5 xs:pr-2 border-r border-[#e5e5e5] mr-1.5 xs:mr-2">
            <HeartButton />
          </div>
          {enabledLinks.map((link, index) => {
            const Icon = iconComponents[link.platform]
            const url = buildSocialUrl(link.platform, link.username)
            const isHovered = hoveredIndex === index
            const hasAnyHover = hoveredIndex !== null
            const shouldBlur = hasAnyHover && !isHovered

            return (
               <motion.a
                 key={`${link.platform}-${index}`}
                 ref={(el) => { linkRefs.current[index] = el }}
                 href={url}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="relative flex items-center justify-center group z-[100]"
                 onMouseEnter={(e) => handleMouseEnter(index, e)}
                 onMouseLeave={handleMouseLeave}
                 whileHover={{ scale: 1.1 }}
                 transition={{ duration: 0.2 }}
               >

                {/* Icon */}
                <motion.div
                  style={{
                    color: isHovered ? hoverColor : iconColor,
                    filter: shouldBlur ? `blur(${blurIntensity}px)` : 'blur(0px)',
                    opacity: shouldBlur ? 0.5 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  {Icon && <Icon size={14} className="transition-colors duration-200" />}
                </motion.div>
              </motion.a>
            )
          })}
        </div>
      </div>
      
      {/* Tooltip - Rendered via Portal (Single portal for all tooltips) */}
      {mounted && createPortal(
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.2 }}
              className="fixed px-2 py-1 bg-[#424242] text-white text-[10px] font-medium rounded whitespace-nowrap pointer-events-none z-[9999] shadow-lg"
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                transform: 'translateX(-50%)',
              }}
            >
              {hoveredLabel}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[4px] border-transparent border-b-[#424242]" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
