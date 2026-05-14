'use client'

import { usePathname } from 'next/navigation'

/**
 * Skip to content link for accessibility
 * Allows keyboard users to skip navigation and go directly to main content
 */
export default function SkipToContent() {
  const pathname = usePathname()

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10001] focus:px-4 focus:py-2 focus:bg-[#424242] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2"
      aria-label="Skip to main content"
    >
      Skip to content
    </a>
  )
}

