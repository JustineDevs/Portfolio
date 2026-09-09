'use client'

import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { List, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface AwwwardsNavLink {
  label: string
  href: string
}

export interface AwwwardsNavColumn {
  title: string
  links: AwwwardsNavLink[]
}

export interface AwwwardsNavProps {
  items?: AwwwardsNavLink[]
  columns?: AwwwardsNavColumn[]
  moreLabel?: string
  locked?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

const DEFAULT_ITEMS: AwwwardsNavLink[] = [
  { label: 'Home', href: '#' },
  { label: 'Nominees', href: '#' },
  { label: 'Directory', href: '#' },
  { label: 'Collections', href: '#' },
]

const DEFAULT_COLUMNS: AwwwardsNavColumn[] = [
  {
    title: 'Awards',
    links: [
      { label: 'Winners', href: '#' },
      { label: 'Site of the Day', href: '#' },
      { label: 'Nominees', href: '#' },
    ],
  },
  {
    title: 'Inspiration',
    links: [
      { label: 'Collections', href: '#' },
      { label: 'Elements', href: '#' },
      { label: 'Resources', href: '#' },
    ],
  },
  {
    title: 'Directory',
    links: [
      { label: 'Professionals', href: '#' },
      { label: 'Agencies', href: '#' },
      { label: 'Freelancers', href: '#' },
    ],
  },
  {
    title: 'Market',
    links: [
      { label: 'Jobs', href: '#' },
      { label: 'New Events', href: '#' },
      { label: 'Products', href: '#' },
    ],
  },
]

const COLLAPSED_HEIGHT = 60
const EXPANDED_HEIGHT = 370

export function AwwwardsNav({
  items = DEFAULT_ITEMS,
  columns = DEFAULT_COLUMNS,
  moreLabel = 'More',
  locked = false,
  onOpenChange,
  className,
}: AwwwardsNavProps) {
  const navRef = useRef<HTMLElement>(null)
  const navTopRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<HTMLDivElement>(null)
  const navHomeRef = useRef<HTMLDivElement>(null)
  const openRef = useRef(false)
  const animatingRef = useRef(false)
  const [showClose, setShowClose] = useState(false)
  const onOpenChangeRef = useRef(onOpenChange)

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange
  }, [onOpenChange])

  useEffect(() => {
    const nav = navRef.current
    const navTop = navTopRef.current
    const navItems = navItemsRef.current
    const navHome = navHomeRef.current
    if (!nav || !navTop || !navItems || !navHome) return

    gsap.set(nav, { height: COLLAPSED_HEIGHT })
    gsap.set(navTop, { opacity: 0, scale: 0.9, display: 'none' })
    gsap.set(navItems, { opacity: 1, display: 'flex' })
    gsap.set(navHome, { flexGrow: 0 })

    return () => {
      gsap.killTweensOf([nav, navTop, navItems, navHome])
    }
  }, [])

  const toggle = () => {
    const nav = navRef.current
    const navTop = navTopRef.current
    const navItems = navItemsRef.current
    const navHome = navHomeRef.current
    if (locked || !nav || !navTop || !navItems || !navHome || animatingRef.current) return

    animatingRef.current = true
    const opening = !openRef.current
    openRef.current = opening
    onOpenChangeRef.current?.(opening)

    if (opening) {
      gsap.to(nav, { height: EXPANDED_HEIGHT, duration: 0.75, ease: 'power4.inOut' })
      gsap.to(navItems, {
        opacity: 0,
        duration: 0.1,
        onComplete: () => gsap.set(navItems, { display: 'none' }),
      })
      gsap.to(navHome, {
        flexGrow: 1,
        duration: 0.2,
        ease: 'power4.inOut',
        onComplete: () => setShowClose(true),
      })
      gsap.to(navTop, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        delay: 0.5,
        onStart: () => gsap.set(navTop, { display: 'block' }),
        onComplete: () => {
          animatingRef.current = false
        },
      })
    } else {
      gsap.to(nav, { height: COLLAPSED_HEIGHT, duration: 0.75, ease: 'power4.inOut', delay: 0.2 })
      gsap.to(navTop, {
        opacity: 0,
        scale: 0.9,
        duration: 0.2,
        onComplete: () => gsap.set(navTop, { display: 'none' }),
      })
      gsap.to(navHome, {
        flexGrow: 0,
        duration: 0.2,
        ease: 'power4.inOut',
        onComplete: () => setShowClose(false),
      })
      gsap.to(navItems, {
        opacity: 1,
        duration: 0.2,
        delay: 0.5,
        onStart: () => gsap.set(navItems, { display: 'flex' }),
        onComplete: () => {
          animatingRef.current = false
        },
      })
    }
  }

  const handleItemClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return

    const target = document.querySelector(href)
    if (!target) return

    event.preventDefault()
    const panel = target.closest<HTMLElement>('.horizontal-page__panel')
    const panelIndex = panel ? Array.from(document.querySelectorAll('.horizontal-page__panel')).indexOf(panel) : -1

    if (panelIndex >= 0) {
      window.scrollTo({ left: panelIndex * window.innerWidth, behavior: 'smooth' })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navRef}
      className={cn(
        'fixed bottom-6 left-1/2 z-50 h-[60px] w-[min(680px,92vw)] -translate-x-1/2 overflow-hidden rounded-xl border backdrop-blur-xl',
        'border-black/10 bg-white/70 dark:border-white/25 dark:bg-black/75',
        className,
      )}
    >
      <div ref={navTopRef} className="absolute inset-x-0 bottom-[60px] top-0 hidden p-2.5">
        <div className="flex h-full w-full gap-0 rounded-[10px] border border-black/[0.06] bg-black/[0.03] p-5 dark:border-white/[0.06] dark:bg-white/[0.04]">
          {columns.map((column, columnIndex) => (
            <div
              key={column.title}
              className={cn(
                'flex flex-1 flex-col gap-1',
                columnIndex > 0 && 'border-l border-dashed border-black/15 pl-4 dark:border-white/20',
              )}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1 w-1 shrink-0 rounded-full bg-black dark:bg-white" />
                <p className="text-sm text-black/70 dark:text-white/75">{column.title}</p>
              </div>
              {column.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block py-2 text-sm text-black transition-colors hover:text-black/50 dark:text-white dark:hover:text-white/60"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex h-[60px] gap-1.5 p-2.5">
        <div
          ref={navHomeRef}
          role="button"
          tabIndex={locked ? -1 : 0}
          aria-disabled={locked}
          aria-expanded={showClose}
          aria-label={locked ? 'Menu locked' : showClose ? 'Close menu' : 'Open menu'}
          onClick={locked ? undefined : toggle}
          onKeyDown={(event) => {
            if (locked) return
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              toggle()
            }
          }}
          className={cn(
            'flex shrink-0 select-none items-center justify-center gap-2.5 rounded-[10px] border px-5 text-sm transition-colors',
            'border-black/10 bg-black/[0.04] text-neutral-600 hover:bg-black/[0.08] hover:text-black',
            'dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-300 dark:hover:bg-white/[0.12] dark:hover:text-white',
            showClose && 'bg-black/[0.08] text-black dark:bg-white/[0.12] dark:text-white',
            locked && 'cursor-not-allowed opacity-60 hover:bg-black/[0.04] hover:text-neutral-600 dark:hover:bg-white/[0.06] dark:hover:text-neutral-300',
          )}
        >
          {showClose ? <X weight="light" className="h-4 w-4" /> : <List weight="light" className="h-4 w-4" />}
          <span>{moreLabel}</span>
        </div>

        <div ref={navItemsRef} className="flex min-w-0 flex-[4] items-center gap-1.5">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(event) => handleItemClick(event, item.href)}
              className="flex h-full flex-1 cursor-pointer items-center justify-center rounded-[10px] border border-black/15 text-center text-sm text-neutral-600 transition-colors hover:border-black/40 hover:text-black dark:border-white/20 dark:text-neutral-400 dark:hover:border-white/50 dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default AwwwardsNav
