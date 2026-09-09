"use client"

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import HeartButton from './HeartButton'
import BrandIcon from './BrandIcon'
import ElasticStack from './ElasticStack'
import { getVisitorId } from '@/lib/visitor-id'
import {
  Instagram,
  Linkedin,
  Github,
  Music,
  MessageCircle,
  Send,
  Star,
  Mail,
  UserRound,
} from 'lucide-react'

const PORTFOLIO_REPO_URL = 'https://github.com/JustineDevs/Portfolio'
const PORTFOLIO_RELEASES_URL = `${PORTFOLIO_REPO_URL}/releases`
const PORTFOLIO_TAGS_URL = `${PORTFOLIO_REPO_URL}/tags`
const PORTFOLIO_STARGAZERS_URL = 'https://github.com/JustineDevs/portfolio/stargazers'

interface SocialLink {
  platform: 'instagram' | 'x' | 'linkedin' | 'github' | 'tiktok' | 'threads' | 'telegram' | 'email'
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
    case 'email':
      return `mailto:${cleanUsername}`
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
  telegram: 'Telegram',
  email: 'Email',
}

// X (Twitter) Icon Component
const XIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

type PublicationBrand = 'coderlegion' | 'peerlist' | 'devto' | 'medium'

const publicationLinks: { brand: PublicationBrand; label: string; href: string; src?: string }[] = [
  { brand: 'coderlegion', label: 'CoderLegion', href: 'https://coderlegion.com/user/JustineDevs' },
  { brand: 'peerlist', label: 'Peerlist', href: 'https://peerlist.io/jstndevs', src: 'https://cdn.brandfetch.io/idNU2eDEh8/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1781763714360' },
  { brand: 'devto', label: 'DEV.to', href: 'https://dev.to/justinedevs', src: 'https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fthepracticaldev.s3.amazonaws.com%2Fi%2F78hs31fax49uwy6kbxyw.png' },
  { brand: 'medium', label: 'Medium', href: 'https://medium.com/@justinedevs', src: 'https://logos-world.net/wp-content/uploads/2023/07/Medium-Logo.png' },
]

const viewerStack = [
  { id: 'viewer-1', name: 'Viewer', icon: <UserRound size={11} strokeWidth={2} aria-hidden /> },
  { id: 'viewer-2', name: 'Viewer', icon: <UserRound size={11} strokeWidth={2} aria-hidden /> },
  { id: 'viewer-3', name: 'Viewer', icon: <UserRound size={11} strokeWidth={2} aria-hidden /> },
]

function AnimatedCount({ value }: { value: number | null }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (value === null) return
    const startValue = displayValue
    const difference = value - startValue
    const startTime = performance.now()
    let frame = 0

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / 700, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(startValue + difference * eased))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return <>{value === null ? '' : displayValue.toLocaleString()}</>
}

// Icon components mapping
const iconComponents: Record<string, React.ComponentType<any>> = {
  instagram: Instagram,
  x: XIcon,
  linkedin: Linkedin,
  github: Github,
  tiktok: Music,
  threads: MessageCircle,
  telegram: Send,
  email: Mail,
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
  const [siteViews, setSiteViews] = useState<number>(0)
  const [repoStars, setRepoStars] = useState<number>(0)
  const [showViewerReminder, setShowViewerReminder] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (typeof window !== 'undefined') {
          if (sessionStorage.getItem('portfolio_site_view_recorded') !== '1') {
            sessionStorage.setItem('portfolio_site_view_recorded', '1')
            void fetch('/api/engagement', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type: 'view' }),
            }).catch(() => undefined)
          }
        }
        const vid = typeof window !== 'undefined' ? getVisitorId() : ''
        const controller = new AbortController()
        const timeout = window.setTimeout(() => controller.abort(), 5000)
        let res: Response
        try {
          res = await fetch(
            `/api/engagement?visitorId=${encodeURIComponent(vid)}`,
            { cache: 'no-store', signal: controller.signal }
          )
        } finally {
          window.clearTimeout(timeout)
        }
        if (!res.ok) throw new Error(`Engagement request failed: ${res.status}`)
        const data = await res.json()
        if (cancelled) return
        setSiteViews(typeof data.views === 'number' ? data.views : 0)
        setRepoStars(typeof data.stars === 'number' ? data.stars : 0)
        setShowViewerReminder(true)
      } catch {
        if (!cancelled) {
          setSiteViews(0)
          setRepoStars(0)
          setShowViewerReminder(true)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!showViewerReminder) return
    const timeout = window.setTimeout(() => setShowViewerReminder(false), 5000)
    return () => window.clearTimeout(timeout)
  }, [showViewerReminder])

  // Default social links if none provided
  const defaultLinks: SocialLink[] = [
    { platform: 'x', username: 'Trader2G', enabled: true },
    { platform: 'linkedin', username: 'justine-lupasi-444608295', enabled: true },
    { platform: 'telegram', username: 'TraderGOfficial', enabled: true },
    { platform: 'email', username: 'JustineDevs@jstn.site', enabled: true },
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
      <div className="h-[52px] xs:h-[56px] border-b border-[#d5d5d5] bg-white relative overflow-visible z-[100]">
        <div className="w-[95%] xs:w-[92%] sm:w-[90%] md:w-[88%] lg:w-[82%] xl:w-[75%] 2xl:w-[70%] 3xl:max-w-[1600px] mx-auto h-full flex items-center justify-between gap-2 xs:gap-3 flex-wrap relative overflow-visible px-2 xs:px-0">
          <a
            href="https://www.producthunt.com/@justindevs/submitted"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-4 inline-flex shrink-0 items-center rounded-md px-1 py-0.5 text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#424242] focus-visible:ring-offset-1"
            aria-label="Open JustineDevs on Product Hunt"
            title="Product Hunt submissions"
          >
            <BrandIcon src="https://ph-static.imgix.net/ph-logo-1.png?auto=format" alt="Product Hunt logo" width={66} height={40} className="h-10 w-auto max-w-none object-contain" />
          </a>
          <div className="flex shrink-0 items-center gap-2.5 border-l border-[#e5e5e5] pl-3" aria-label="Writing profiles">
            {publicationLinks.map(({ brand, label, href, src }) => (
              <a
                key={brand}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-14 shrink-0 items-center justify-center text-[#666666] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#424242] focus-visible:ring-offset-1"
                aria-label={`Open ${label} profile`}
                title={label}
              >
                {brand === 'coderlegion' ? (
                  <span className="flex items-center text-[10px] font-black leading-none tracking-[-0.1em]" aria-label="CoderLegion logo">
                    <span>CODER</span><span className="text-[#b43727]">LEGION</span>
                  </span>
                ) : brand === 'devto' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-7 w-7" aria-label="DEV.to logo">
                    <path d="M14.5 3.5H1.5A1 1 0 0 0 .5 4.5v7a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V4.5a1 1 0 0 0-1-1Zm0 8H1.5V4.5h13v7Zm-6.5-5v1h.5a.5.5 0 0 1 0 1H8v1h1a.5.5 0 0 1 0 1H7.5a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5H9a.5.5 0 0 1 0 1H8Zm5.48125-.364375-1.125 4a.5.5 0 0 1-.9625 0l-1.125-4a.5.5 0 0 1 .9625-.27125l.64375 2.28875.64375-2.28875a.5.5 0 1 1 .9625.27125ZM4 5.5h-.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5H4a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2Zm1 3a1 1 0 0 1-1 1v-3a1 1 0 0 1 1 1v1Z" />
                  </svg>
                ) : (
                  <BrandIcon src={src} alt={`${label} logo`} width={56} height={32} className="max-h-8 max-w-14 object-contain" />
                )}
              </a>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 xs:gap-2.5">
          <div className="flex items-center gap-2 xs:gap-2.5 pr-1.5 xs:pr-2 border-r border-[#e5e5e5] mr-1.5 xs:mr-2">
            <div
              className="flex items-center gap-1.5 text-gray-400"
              title="GitHub releases and tags. Site visit count."
            >
              <span className="inline-flex items-center gap-1 text-[8px] xs:text-[9px] font-semibold text-[#666666] leading-none">
                <a
                  href={PORTFOLIO_RELEASES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[14px] min-h-[14px] items-center justify-center rounded tabular-nums transition-colors hover:text-[#424242] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#424242] focus-visible:ring-offset-1"
                  title="View GitHub releases"
                  aria-label="Portfolio releases on GitHub (opens in a new tab)"
                >
                  releases
                </a>
                <span aria-hidden>/</span>
                <a
                  href={PORTFOLIO_TAGS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[14px] min-h-[14px] items-center justify-center rounded tabular-nums transition-colors hover:text-[#424242] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#424242] focus-visible:ring-offset-1"
                  title="View GitHub tags"
                  aria-label="Portfolio tags on GitHub (opens in a new tab)"
                >
                  tags
                </a>
              </span>
              <div
                className="group/viewers relative flex items-center"
                tabIndex={0}
                aria-label="Total viewers"
                onMouseEnter={() => setShowViewerReminder(true)}
                onMouseLeave={() => setShowViewerReminder(false)}
                onFocus={() => setShowViewerReminder(true)}
                onBlur={() => setShowViewerReminder(false)}
              >
                <ElasticStack
                  items={viewerStack}
                  itemSize={18}
                  overlap={7}
                  pushForce={4}
                  role="img"
                  aria-label="Recent site viewers"
                />
                <AnimatePresence>
                  {showViewerReminder && (
                    <motion.div
                      initial={{ opacity: 0, y: -3, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -3, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="pointer-events-none absolute right-0 top-full z-[120] mt-2 rounded-md bg-[#424242] px-2 py-1.5 text-[10px] font-medium leading-none text-white shadow-lg"
                      role="status"
                    >
                      <span className="whitespace-nowrap">Total viewers</span>
                      <span className="ml-1 text-white/70">{siteViews.toLocaleString()}</span>
                      <span className="absolute bottom-full right-2 border-x-[4px] border-b-[4px] border-x-transparent border-b-[#424242]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span
                className="inline-flex h-[14px] min-h-[14px] items-center text-[11px] text-[#666666] font-medium tabular-nums leading-none min-w-[1.25rem]"
                aria-label={`Site visits: ${siteViews}`}
              >
                <AnimatedCount value={siteViews} />
              </span>
            </div>
            <div className="hidden xs:block w-px h-3.5 bg-[#e5e5e5]" aria-hidden />
            <HeartButton showReminderPopup reminderPlacement="below" />
            <div className="hidden xs:block w-px h-3.5 bg-[#e5e5e5]" aria-hidden />
            <a
              href={PORTFOLIO_STARGAZERS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-md px-0.5 py-0.5 text-gray-400 transition-colors hover:text-[#424242] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#424242] focus-visible:ring-offset-1"
              title="View repo stargazers on GitHub"
              aria-label={`Portfolio stargazers on GitHub, ${repoStars} stargazers`}
            >
              <Star size={14} className="shrink-0" aria-hidden />
              <span className="text-[11px] text-[#666666] font-medium tabular-nums min-w-[1rem]">
                {repoStars.toLocaleString()}
              </span>
            </a>
          </div>
          {enabledLinks.map((link, index) => {
            const Icon = iconComponents[link.platform]
            const url = buildSocialUrl(link.platform, link.username)
            const isMailto = url.startsWith('mailto:')
            const isHovered = hoveredIndex === index
            const hasAnyHover = hoveredIndex !== null
            const shouldBlur = hasAnyHover && !isHovered

            return (
               <motion.a
                 key={`${link.platform}-${index}`}
                 ref={(el) => { linkRefs.current[index] = el }}
                 href={url}
                 aria-label={platformLabels[link.platform] || link.platform}
                 title={platformLabels[link.platform] || link.platform}
                 {...(isMailto
                   ? {}
                   : { target: '_blank', rel: 'noopener noreferrer' })}
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
