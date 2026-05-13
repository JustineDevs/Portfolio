"use client"

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import HeartButton from './HeartButton'
import { getVisitorId } from '@/lib/visitor-id'
import {
  Instagram,
  Linkedin,
  Github,
  Music,
  MessageCircle,
  Send,
  Eye,
  Star,
  Mail,
  Activity,
} from 'lucide-react'

const PORTFOLIO_REPO_URL = 'https://github.com/JustineDevs/Portfolio'
const PORTFOLIO_RELEASES_URL = `${PORTFOLIO_REPO_URL}/releases`
const PORTFOLIO_TAGS_URL = `${PORTFOLIO_REPO_URL}/tags`
const PORTFOLIO_STARGAZERS_URL = 'https://github.com/JustineDevs/portfolio/stargazers'

type BackendHealth = 'loading' | 'up' | 'down'

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
  const [siteViews, setSiteViews] = useState<number | null>(null)
  const [repoStars, setRepoStars] = useState<number | null>(null)
  const [backendHealth, setBackendHealth] = useState<BackendHealth>('loading')
  const [backendLatencyMs, setBackendLatencyMs] = useState<number | null>(null)
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
            await fetch('/api/engagement', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type: 'view' }),
            })
          }
        }
        const vid = typeof window !== 'undefined' ? getVisitorId() : ''
        const res = await fetch(
          `/api/engagement?visitorId=${encodeURIComponent(vid)}`,
          { cache: 'no-store' }
        )
        const data = await res.json()
        if (cancelled) return
        setSiteViews(typeof data.views === 'number' ? data.views : 0)
        setRepoStars(typeof data.stars === 'number' ? data.stars : null)
      } catch {
        if (!cancelled) {
          setSiteViews(0)
          setRepoStars(null)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const ping = async () => {
      const t0 = typeof performance !== 'undefined' ? performance.now() : 0
      try {
        const res = await fetch('/api/health', { cache: 'no-store' })
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean
          latencyMs?: number
        }
        if (cancelled) return
        if (res.ok && data.ok === true) {
          setBackendHealth('up')
          setBackendLatencyMs(
            typeof data.latencyMs === 'number'
              ? data.latencyMs
              : Math.round(performance.now() - t0)
          )
        } else {
          setBackendHealth('down')
          setBackendLatencyMs(null)
        }
      } catch {
        if (!cancelled) {
          setBackendHealth('down')
          setBackendLatencyMs(null)
        }
      }
    }
    void ping()
    const id = setInterval(ping, 120_000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

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

  const backendStatusTitle =
    backendHealth === 'loading'
      ? 'Checking backend (database)…'
      : backendHealth === 'up'
        ? `Backend OK — database reachable${
            backendLatencyMs !== null ? ` (${backendLatencyMs} ms)` : ''
          }`
        : 'Backend unreachable — database check failed'

  const backendStatusLabel =
    backendHealth === 'loading'
      ? 'Server status: checking'
      : backendHealth === 'up'
        ? 'Server status: backend OK'
        : 'Server status: backend unavailable'

  return (
    <>
      <div className="h-[32px] xs:h-[36px] border-b border-[#d5d5d5] bg-white relative overflow-visible z-[100]">
        <div className="w-[95%] xs:w-[92%] sm:w-[90%] md:w-[88%] lg:w-[82%] xl:w-[75%] 2xl:w-[70%] 3xl:max-w-[1600px] mx-auto h-full flex items-center justify-between gap-2 xs:gap-3 flex-wrap relative overflow-visible px-2 xs:px-0">
          <span
            role="status"
            aria-live="polite"
            aria-label={backendStatusLabel}
            title={backendStatusTitle}
            className="inline-flex shrink-0 cursor-default items-center gap-1.5 rounded-md py-0.5 pr-1 text-gray-400"
          >
            <span
              className={`size-1.5 shrink-0 rounded-full ${
                backendHealth === 'up'
                  ? 'bg-emerald-500'
                  : backendHealth === 'down'
                    ? 'bg-red-500'
                    : 'animate-pulse bg-gray-300'
              }`}
              aria-hidden
            />
            <Activity
              size={14}
              className={`shrink-0 ${
                backendHealth === 'down' ? 'text-red-500/90' : ''
              }`}
              aria-hidden
            />
            <span className="text-[11px] font-medium tabular-nums leading-none sm:hidden">Status</span>
            <span className="hidden text-[11px] font-medium leading-none sm:inline">Server status</span>
          </span>
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 xs:gap-2.5">
          <div className="flex items-center gap-2 xs:gap-2.5 pr-1.5 xs:pr-2 border-r border-[#e5e5e5] mr-1.5 xs:mr-2">
            <div
              className="flex items-center gap-1.5 text-gray-400"
              title="GitHub releases and tags. Site visit count."
            >
              <span className="inline-flex items-center gap-1 text-[8px] xs:text-[9px] font-semibold text-gray-400 leading-none">
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
              <Eye size={14} className="shrink-0 text-gray-400" aria-hidden />
              <span
                className="inline-flex h-[14px] min-h-[14px] items-center text-[11px] text-[#666666] font-medium tabular-nums leading-none min-w-[1.25rem]"
                aria-label={`Site visits: ${siteViews === null ? 'loading' : siteViews}`}
              >
                {siteViews === null ? '' : siteViews.toLocaleString()}
              </span>
            </div>
            <div className="hidden xs:block w-px h-3.5 bg-[#e5e5e5]" aria-hidden />
            <HeartButton />
            <div className="hidden xs:block w-px h-3.5 bg-[#e5e5e5]" aria-hidden />
            <a
              href={PORTFOLIO_STARGAZERS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-md px-0.5 py-0.5 text-gray-400 transition-colors hover:text-[#424242] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#424242] focus-visible:ring-offset-1"
              title="View repo stargazers on GitHub"
              aria-label={`Portfolio stargazers on GitHub${repoStars !== null ? `, ${repoStars} stargazers` : ''}`}
            >
              <Star size={14} className="shrink-0" aria-hidden />
              <span className="text-[11px] text-[#666666] font-medium tabular-nums min-w-[1rem]">
                {repoStars === null ? '' : repoStars.toLocaleString()}
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
