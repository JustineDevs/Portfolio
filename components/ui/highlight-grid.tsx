'use client'

import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface HighlightGridItem {
  label: string
}

interface HighlightGridProps extends HTMLAttributes<HTMLDivElement> {
  rows?: HighlightGridItem[][]
  preview?: ReactNode
  children?: ReactNode
}

function HighlightGrid({ rows = [], preview, children, className, ...props }: HighlightGridProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!isExpanded) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isExpanded])

  const content = (
    <div className="relative">
      {rows.length > 0 && (
        <div
          className="pointer-events-none absolute inset-0 bg-[#1342FF]/[0.035] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
      )}
      <div className="relative">{preview ?? children}</div>
      <span className="pointer-events-none absolute right-4 top-4 text-[10px] font-medium uppercase tracking-[0.16em] text-[#999] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        Expand
      </span>
    </div>
  )

  return (
    <>
      <div
        className={cn('group relative cursor-pointer', className)}
        role="button"
        tabIndex={0}
        aria-label="Expand section"
        onClick={() => setIsExpanded(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsExpanded(true)
          }
        }}
        {...props}
      >
        {content}
      </div>

      {isExpanded && typeof document !== 'undefined' && createPortal(
        <div
          className="highlight-grid-expanded fixed inset-0 z-[200] overflow-y-auto bg-white/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded section"
          onClick={() => setIsExpanded(false)}
        >
          <button
            type="button"
            className="fixed right-5 top-5 z-10 rounded-full border border-[#d5d5d5] bg-white px-4 py-2 text-xs font-semibold text-[#424242] shadow-sm transition-colors hover:bg-[#f5f5f5]"
            onClick={() => setIsExpanded(false)}
          >
            Close <span className="ml-1 text-[#888]">Esc</span>
          </button>
          <div className="mx-auto min-h-screen w-full max-w-[1200px] px-6 py-16 sm:px-10" onClick={(event) => event.stopPropagation()}>
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default HighlightGrid
