'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

interface AvailabilityCalendarProps {
  onDateSelect: (date: Date) => void
  busyDates?: Date[]
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function AvailabilityCalendar({ onDateSelect, busyDates = [] }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    let startDay = firstDay.getDay()
    startDay = startDay === 0 ? 6 : startDay - 1
    
    const days: { date: number | null; isToday: boolean; isPast: boolean; isBusy: boolean }[] = []
    
    for (let i = 0; i < startDay; i++) {
      days.push({ date: null, isToday: false, isPast: false, isBusy: false })
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day)
      currentDay.setHours(0, 0, 0, 0)
      
      const isToday = currentDay.getTime() === today.getTime()
      const isPast = currentDay < today
      const isBusy = busyDates.some(busyDate => {
        const busy = new Date(busyDate)
        busy.setHours(0, 0, 0, 0)
        return busy.getTime() === currentDay.getTime()
      })
      
      days.push({ date: day, isToday, isPast, isBusy })
    }
    
    const remainingCells = (7 - (days.length % 7)) % 7
    for (let i = 0; i < remainingCells; i++) {
      days.push({ date: null, isToday: false, isPast: false, isBusy: false })
    }
    
    return days
  }, [year, month, busyDates])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDateClick = (day: number | null, isPast: boolean, isBusy: boolean) => {
    if (!day || isPast || isBusy) return
    
    const selected = new Date(year, month, day)
    setSelectedDate(selected)
    onDateSelect(selected)
  }

  const isSelected = (day: number | null) => {
    if (!day || !selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#d5d5d5]">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#666666]" />
          <span className="text-[10px] xs:text-[11px] font-bold text-[#666666] tracking-wider uppercase">
            Availability
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 border border-[#d5d5d5] rounded-lg hover:bg-[#f5f5f5] transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4 text-[#424242]" />
          </button>
          <span className="text-[13px] xs:text-[14px] font-bold text-[#424242] min-w-[120px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 border border-[#d5d5d5] rounded-lg hover:bg-[#f5f5f5] transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4 text-[#424242]" />
          </button>
        </div>
      </div>

      <div className="border border-[#d5d5d5] rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 bg-[#FAFAFA] border-b border-[#d5d5d5]">
          {DAYS.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-[10px] xs:text-[11px] font-semibold text-[#666666] border-r border-[#d5d5d5] last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const isAvailable = day.date && !day.isPast && !day.isBusy
            const selected = isSelected(day.date)
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(day.date, day.isPast, day.isBusy)}
                className={`
                  relative min-h-[48px] xs:min-h-[56px] p-1.5 xs:p-2 border-b border-r border-[#d5d5d5]
                  last:border-r-0 [&:nth-child(7n)]:border-r-0 [&:nth-last-child(-n+7)]:border-b-0
                  transition-colors
                  ${!day.date ? 'bg-[#FAFAFA]' : ''}
                  ${day.isPast ? 'bg-[#FAFAFA] cursor-not-allowed' : ''}
                  ${day.isBusy ? 'bg-[#FFF5F5] cursor-not-allowed' : ''}
                  ${isAvailable && !selected ? 'bg-white hover:bg-[#F0F7FF] cursor-pointer' : ''}
                  ${selected ? 'bg-[#424242]' : ''}
                  ${day.isToday && !selected ? 'ring-2 ring-inset ring-[#1342FF]' : ''}
                `}
              >
                {day.date && (
                  <>
                    <span
                      className={`
                        text-[14px] xs:text-[16px] font-medium
                        ${day.isPast ? 'text-[#CCCCCC]' : ''}
                        ${day.isBusy ? 'text-[#FF6B6B]' : ''}
                        ${isAvailable && !selected ? 'text-[#424242]' : ''}
                        ${selected ? 'text-white' : ''}
                        ${day.isToday && !selected ? 'text-[#1342FF] font-bold' : ''}
                      `}
                    >
                      {day.date}
                    </span>
                    {day.isBusy && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-[#FF6B6B] font-medium">
                        Busy
                      </span>
                    )}
                    {isAvailable && !selected && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#22C55E]" />
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-[#d5d5d5]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="text-[10px] text-[#666666]">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF6B6B]" />
          <span className="text-[10px] text-[#666666]">Busy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1342FF]" />
          <span className="text-[10px] text-[#666666]">Today</span>
        </div>
      </div>
    </div>
  )
}
