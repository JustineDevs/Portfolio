'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Calendar, Clock, Video } from 'lucide-react'
import AvailabilityCalendar from './AvailabilityCalendar'

interface ScheduleCallModalProps {
  isOpen: boolean
  onClose: () => void
  calendlyUrl?: string
}

const BUSY_DATES = [
  new Date(2026, 0, 25),
  new Date(2026, 0, 26),
  new Date(2026, 1, 14),
  new Date(2026, 1, 15),
]

export default function ScheduleCallModal({ 
  isOpen, 
  onClose, 
  calendlyUrl = 'https://calendly.com/your-username' 
}: ScheduleCallModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showCalendly, setShowCalendly] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      setSelectedDate(null)
      setShowCalendly(false)
    }
  }, [isOpen])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleBookWithCalendly = () => {
    if (selectedDate) {
      const month = selectedDate.getMonth() + 1
      const day = selectedDate.getDate()
      const year = selectedDate.getFullYear()
      const dateParam = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      window.open(`${calendlyUrl}?date=${dateParam}`, '_blank')
    } else {
      window.open(calendlyUrl, '_blank')
    }
  }

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            aria-hidden="true"
          />

          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-[480px] w-full max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col border border-[#d5d5d5]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="schedule-modal-title"
            >
              <div className="flex items-center justify-between p-4 xs:p-5 border-b border-[#d5d5d5] bg-[#FAFAFA]">
                <div>
                  <h2 id="schedule-modal-title" className="text-[18px] xs:text-[20px] font-bold text-[#424242] tracking-[-0.01em]">
                    Schedule a Call
                  </h2>
                  <p className="text-[11px] xs:text-[12px] text-[#666666] mt-0.5">
                    Select a date to book a meeting
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-[#666666] hover:text-[#424242] hover:bg-white border border-[#d5d5d5] rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 xs:p-5">
                <AvailabilityCalendar 
                  onDateSelect={handleDateSelect}
                  busyDates={BUSY_DATES}
                />

                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-[#F0F7FF] border border-[#1342FF]/20 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg border border-[#d5d5d5]">
                        <Calendar className="w-4 h-4 text-[#1342FF]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] xs:text-[11px] font-semibold text-[#1342FF] uppercase tracking-wider">
                          Selected Date
                        </p>
                        <p className="text-[14px] xs:text-[15px] font-bold text-[#424242] mt-0.5">
                          {formatSelectedDate(selectedDate)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="mt-4 pt-4 border-t border-[#d5d5d5]">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-4 h-4 text-[#666666]" />
                    <span className="text-[11px] xs:text-[12px] font-semibold text-[#666666]">
                      30-min Video Call
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-[#666666]" />
                    <span className="text-[11px] xs:text-[12px] text-[#666666]">
                      Asia/Manila timezone (PHT)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 xs:p-5 border-t border-[#d5d5d5] bg-[#FAFAFA]">
                <button
                  onClick={handleBookWithCalendly}
                  className={`
                    w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[13px] xs:text-[14px] font-medium transition-all
                    ${selectedDate 
                      ? 'bg-[#424242] text-white hover:opacity-90' 
                      : 'bg-[#424242]/80 text-white/80 hover:bg-[#424242] hover:text-white'
                    }
                  `}
                >
                  <span>{selectedDate ? 'Book This Date' : 'Open Calendly'}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-[#666666] text-center mt-2">
                  Opens Calendly to confirm your booking
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
