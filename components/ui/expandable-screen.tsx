'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

type ExpandableScreenProps = {
  trigger: ReactNode
  content: ReactNode
  layoutId?: string
}

export default function ExpandableScreen({ trigger, content, layoutId = 'expandable-screen' }: ExpandableScreenProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!isExpanded) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isExpanded])

  return (
    <>
      <AnimatePresence initial={false}>
        {!isExpanded && (
          <motion.div layoutId={layoutId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span onClick={() => setIsExpanded(true)}>{trigger}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="expandable-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Contact form"
          >
            <motion.div layoutId={layoutId} className="expandable-screen__surface">
              <button className="expandable-screen__close" type="button" onClick={() => setIsExpanded(false)} aria-label="Close contact form">
                <X aria-hidden="true" />
              </button>
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
