"use client"

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import CornerDot from '@/components/ui/CornerDot'
import activityData from '@/public/JustineDevs_Activity_History.json'

interface CellData {
  level: number
  contributions: number
  date: Date
  isEmpty?: boolean
}

export default function ActivityHeatmapSection() {
  const [selectedYear, setSelectedYear] = useState(2026)
  const [hoveredCell, setHoveredCell] = useState<{ date: Date; contributions: number; x: number; y: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const profileName = activityData.profile.full_name
  const totalRepos = activityData.profile_statistics.total_repositories
  const yearlyContributions = activityData.profile_statistics.contributions_last_year

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  useEffect(() => {
    setMounted(true)
  }, [])

  const { gridData, monthLabels } = useMemo(() => {
    const grid: CellData[][] = []
    const labels: { month: string; weekIndex: number }[] = []
    
    const startDate = new Date(selectedYear, 0, 1)
    const endDate = new Date(selectedYear, 11, 31)
    
    const startDayOfWeek = startDate.getDay()
    
    const adjustedStart = new Date(startDate)
    adjustedStart.setDate(adjustedStart.getDate() - startDayOfWeek)
    
    const endDayOfWeek = endDate.getDay()
    const adjustedEnd = new Date(endDate)
    adjustedEnd.setDate(adjustedEnd.getDate() + (6 - endDayOfWeek))
    
    const totalDays = Math.ceil((adjustedEnd.getTime() - adjustedStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const totalWeeks = Math.ceil(totalDays / 7)

    const timeline = activityData.contribution_activity_timeline as Record<string, Record<string, { status?: string; highlights?: string[] }>>
    const yearData = timeline[selectedYear.toString()]

    const statusToActivity: Record<string, number> = {
      'Peak activity': 3,
      'High activity': 3,
      'Active development': 2,
      'Ongoing': 2,
      'Active': 1,
    }

    let lastMonth = -1

    for (let week = 0; week < totalWeeks; week++) {
      const column: CellData[] = []
      
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const dayOffset = week * 7 + dayOfWeek
        const cellDate = new Date(adjustedStart)
        cellDate.setDate(adjustedStart.getDate() + dayOffset)
        
        const isOutsideYear = cellDate < startDate || cellDate > endDate
        
        if (isOutsideYear) {
          column.push({ level: 0, contributions: 0, date: cellDate, isEmpty: true })
          continue
        }

        if (cellDate.getMonth() !== lastMonth && cellDate.getDate() <= 7) {
          lastMonth = cellDate.getMonth()
          labels.push({
            month: cellDate.toLocaleDateString('en-US', { month: 'short' }),
            weekIndex: week
          })
        }

        const month = cellDate.getMonth()
        const quarter = Math.floor(month / 3)
        const quarterKey = `q${quarter + 1}`
        const quarterData = yearData?.[quarterKey]
        const baseLevel = quarterData?.status ? (statusToActivity[quarterData.status] || 1) : 0
        const hasHighlights = quarterData?.highlights && quarterData.highlights.length > 0

        const seed = (week * 7 + dayOfWeek) * 9301 + 49297 + selectedYear + cellDate.getDate()
        const val = (seed % 233280) / 233280
        
        let level = 0
        let contributions = 0

        if (!yearData) {
          if (val > 0.9) {
            level = 1
            contributions = Math.floor(val * 3) + 1
          }
        } else if (baseLevel === 0) {
          if (val > 0.85) {
            level = 1
            contributions = Math.floor(val * 3) + 1
          }
        } else if (hasHighlights && val > 0.3) {
          level = Math.min(3, baseLevel + (val > 0.7 ? 1 : 0))
          contributions = level === 3 ? Math.floor(val * 20) + 15 : level === 2 ? Math.floor(val * 10) + 5 : Math.floor(val * 4) + 1
        } else if (val > 0.4) {
          level = baseLevel
          contributions = baseLevel === 3 ? Math.floor(val * 20) + 15 : baseLevel === 2 ? Math.floor(val * 10) + 5 : Math.floor(val * 4) + 1
        } else {
          level = Math.max(0, baseLevel - 1)
          contributions = level > 0 ? Math.floor(val * 4) + 1 : 0
        }

        column.push({ level, contributions, date: cellDate, isEmpty: false })
      }
      grid.push(column)
    }
    return { gridData: grid, monthLabels: labels }
  }, [selectedYear])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleCellHover = (cell: CellData, event: React.MouseEvent<HTMLDivElement>) => {
    if (cell.isEmpty || cell.contributions === 0) return
    const rect = event.currentTarget.getBoundingClientRect()
    setHoveredCell({
      date: cell.date,
      contributions: cell.contributions,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    })
  }

  const handleCellLeave = () => {
    setHoveredCell(null)
  }

  const getColorForLevel = (level: number, isEmpty?: boolean) => {
    if (isEmpty) return 'transparent'
    switch (level) {
      case 0: return '#EBEDF0'
      case 1: return '#9BE9A8'
      case 2: return '#30A14E'
      case 3: return '#216E39'
      default: return '#EBEDF0'
    }
  }

  return (
    <>
      <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
        <CornerDot position="bl" />
        <CornerDot position="br" />
        
        <div className="p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-[clamp(24px,3vw,32px)] font-bold text-[#424242] mb-2 tracking-tight">
                Activity
              </h2>
              
              <h3 className="text-[clamp(18px,2vw,20px)] font-bold text-[#424242] mb-4 tracking-[-0.01em]">
                Heatmap
              </h3>
              
              <p className="text-[clamp(12px,1.2vw,14px)] text-[#666666] leading-relaxed mb-8 max-w-2xl">
                {profileName}'s contribution activity. {yearlyContributions.toLocaleString()} contributions in the last year across {totalRepos} repositories.
              </p>

              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  <div className="flex ml-[36px] mb-2 relative h-4">
                    {monthLabels.map((label, i) => (
                      <span 
                        key={i} 
                        className="text-[clamp(9px,1vw,10px)] text-[#666666] font-medium absolute"
                        style={{ left: `${label.weekIndex * 14}px` }}
                      >
                        {label.month}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-[1px]">
                    <div className="flex flex-col gap-[1px] mr-2 w-8">
                      {days.map((day, i) => (
                        <span
                          key={i}
                          className={`text-[clamp(9px,1vw,10px)] text-[#666666] h-[11px] sm:h-[12px] leading-none font-medium flex items-center ${
                            i % 2 === 0 ? 'opacity-0' : ''
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-[3px]">
                      {gridData.map((column, colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-[3px]">
                          {column.map((cell, rowIndex) => (
                            <div
                              key={rowIndex}
                              className={`w-[10px] sm:w-[11px] h-[10px] sm:h-[11px] rounded-[2px] cursor-pointer transition-all ${
                                !cell.isEmpty && cell.contributions > 0 ? 'hover:ring-2 hover:ring-[#424242] hover:ring-offset-1' : ''
                              }`}
                              style={{ backgroundColor: getColorForLevel(cell.level, cell.isEmpty) }}
                              onMouseEnter={(e) => handleCellHover(cell, e)}
                              onMouseLeave={handleCellLeave}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end items-center gap-2">
                    <span className="text-[clamp(9px,1vw,10px)] text-[#666666] font-medium">Less</span>
                    <div className="flex gap-[3px]">
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#EBEDF0]" />
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#9BE9A8]" />
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#30A14E]" />
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#216E39]" />
                    </div>
                    <span className="text-[clamp(9px,1vw,10px)] text-[#666666] font-medium">More</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-col gap-1.5 w-full lg:w-[80px] shrink-0">
              {[2026, 2025, 2024, 2023].map((year) => (
                <motion.button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-center lg:text-left px-4 py-2 rounded-lg text-[clamp(11px,1.2vw,12px)] font-semibold transition-all whitespace-nowrap flex-1 lg:flex-none ${
                    year === selectedYear
                      ? 'bg-[#1342FF] text-white'
                      : 'text-[#666666] hover:bg-white hover:text-[#424242]'
                  }`}
                >
                  {year}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {mounted && hoveredCell && createPortal(
        <AnimatePresence>
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="fixed z-[10000] bg-[#424242] text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none"
            style={{
              left: `${hoveredCell.x}px`,
              top: `${hoveredCell.y}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-semibold">{hoveredCell.contributions} contributions</span>
              <span className="text-[10px] text-white/80">{formatDate(hoveredCell.date)}</span>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-[#424242]" />
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
