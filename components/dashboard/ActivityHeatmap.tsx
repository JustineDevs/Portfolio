"use client"
import { useState, useMemo } from "react"
import activityData from '@/public/JustineDevs_Activity_History.json'

interface CellData {
  level: number
  contributions: number
  date: Date
  isEmpty?: boolean
}

export default function ActivityHeatmap() {
  const [year, setYear] = useState(2026)

  const { totalContributions } = useMemo(() => {
    const total = activityData.profile_statistics.contributions_last_year
    return { totalContributions: total }
  }, [])

  const { gridData, monthLabels } = useMemo(() => {
    const grid: CellData[][] = []
    const labels: { month: string; weekIndex: number }[] = []
    
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)
    
    const startDayOfWeek = startDate.getDay()
    
    const adjustedStart = new Date(startDate)
    adjustedStart.setDate(adjustedStart.getDate() - startDayOfWeek)
    
    const endDayOfWeek = endDate.getDay()
    const adjustedEnd = new Date(endDate)
    adjustedEnd.setDate(adjustedEnd.getDate() + (6 - endDayOfWeek))
    
    const totalDays = Math.ceil((adjustedEnd.getTime() - adjustedStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const totalWeeks = Math.ceil(totalDays / 7)

    const timeline = activityData.contribution_activity_timeline as Record<string, Record<string, { status?: string; highlights?: string[] }>>
    const yearData = timeline[year.toString()]
    const currentYearStats = (activityData.yearly_statistics as any)?.[year.toString()]
    const totalYearlyContributions = currentYearStats?.total_contributions || 0

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

        const seed = (week * 7 + dayOfWeek) * 9301 + 49297 + year + cellDate.getDate()
        const val = (seed % 233280) / 233280
        
        let level = 0
        let contributions = 0

        if (totalYearlyContributions > 0 && totalYearlyContributions <= 10) {
          // Accuracy fix for low activity years (2023: 2, 2024: 1)
          if (val > 0.995) {
            level = 1
            contributions = 1
          }
        } else if (year === 2025 && month === 10) {
          // November 2025 peak
          if (val > 0.1) {
            level = val > 0.7 ? 3 : val > 0.4 ? 2 : 1
            contributions = level === 3 ? Math.floor(val * 15) + 10 : level === 2 ? Math.floor(val * 8) + 4 : Math.floor(val * 4) + 1
          }
        } else if (year === 2026 && cellDate <= new Date(2026, 0, 20)) {
          // 2026 peak
          level = val > 0.6 ? 3 : val > 0.3 ? 2 : 1
          contributions = level === 3 ? Math.floor(val * 20) + 10 : level === 2 ? Math.floor(val * 10) + 5 : Math.floor(val * 5) + 1
        } else if (year === 2025) {
          // 2025 high activity
          if (val > 0.15) {
            level = val > 0.7 ? 3 : val > 0.4 ? 2 : 1
            contributions = level === 3 ? Math.floor(val * 20) + 15 : level === 2 ? Math.floor(val * 10) + 5 : Math.floor(val * 4) + 1
          }
        } else if (!yearData) {
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
  }, [year])

  const getColor = (level: number, isEmpty?: boolean) => {
    if (isEmpty) return 'bg-transparent'
    if (level === 0) return 'bg-neutral-100'
    if (level === 1) return 'bg-green-200'
    if (level === 2) return 'bg-green-400'
    return 'bg-green-700'
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-medium text-[#111111]">Activity</h3>
        <span className="text-sm font-semibold text-[#111111]">Heatmap</span>
        <p className="text-[10px] text-[#666666] max-w-lg leading-relaxed mt-1">
          {activityData.profile.full_name}'s contribution activity. {activityData.profile_statistics.contributions_last_year.toLocaleString()} contributions in the last year across {activityData.profile_statistics.total_repositories} repositories.
        </p>
      </div>

      <div className="flex gap-8 items-end border border-neutral-100 rounded-sm px-8 py-6 mt-6">
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="flex ml-7 mb-2 relative h-4">
              {monthLabels.map((label, i) => (
                <span 
                  key={i} 
                  className="text-[9px] text-[#999999] font-mono uppercase tracking-wider absolute"
                  style={{ left: `${label.weekIndex * 11.5}px` }}
                >
                  {label.month}
                </span>
              ))}
            </div>
            <div className="flex gap-[1px]">
              <div className="flex flex-col gap-[1px] mr-1 w-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                  <span 
                    key={i} 
                    className={`text-[8px] text-[#999999] h-[10px] leading-none font-mono ${i % 2 === 0 ? 'opacity-0' : ''}`}
                  >
                    {day}
                  </span>
                ))}
              </div>
              <div className="flex gap-[2px]">
                {gridData.map((column, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-[2px]">
                    {column.map((cell, rowIdx) => (
                      <div 
                        key={rowIdx} 
                        className={`w-[10px] h-[10px] rounded-[1px] ${getColor(cell.level, cell.isEmpty)}`} 
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 justify-end mt-2 text-[9px] text-[#999999]">
              <span>Less</span>
              <div className="w-2 h-2 bg-neutral-100 rounded-[1px]" />
              <div className="w-2 h-2 bg-green-200 rounded-[1px]" />
              <div className="w-2 h-2 bg-green-400 rounded-[1px]" />
              <div className="w-2 h-2 bg-green-700 rounded-[1px]" />
              <span>More</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[60px] border-l border-neutral-200 pl-4">
          {[2026, 2025, 2024, 2023].map((y) => (
            <button 
              key={y}
              onClick={() => setYear(y)}
              className={`text-[10px] py-1.5 px-4 rounded-full font-medium transition-all w-full text-center ${
                year === y 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-[#999999] hover:bg-neutral-50 hover:text-neutral-600'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
