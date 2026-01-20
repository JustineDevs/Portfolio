"use client"

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import CornerDot from '@/components/ui/CornerDot'
import ActivitySection from '@/components/sections/ActivitySection'

interface CellData {
  level: number
  contributions: number
  date: Date
}

export default function TimelineHeatmapSection() {
  const [activeStage, setActiveStage] = useState(0)
  const [selectedYear, setSelectedYear] = useState(2026)
  const [hoveredCell, setHoveredCell] = useState<{ date: Date; contributions: number; x: number; y: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    
    const drawCanvas = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (ctx) {
          // Set canvas size based on container
          const rect = canvas.getBoundingClientRect()
          canvas.width = rect.width
          canvas.height = rect.height
          
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          
          // Draw background gradient
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
          gradient.addColorStop(0, '#F8F8F8')
          gradient.addColorStop(1, '#FFFFFF')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          // Add subtle grid pattern
          ctx.strokeStyle = '#E5E5E5'
          ctx.lineWidth = 1
          const gridSize = 40
          
          for (let i = 0; i < canvas.width; i += gridSize) {
            ctx.beginPath()
            ctx.moveTo(i, 0)
            ctx.lineTo(i, canvas.height)
            ctx.stroke()
          }
          
          for (let i = 0; i < canvas.height; i += gridSize) {
            ctx.beginPath()
            ctx.moveTo(0, i)
            ctx.lineTo(canvas.width, i)
            ctx.stroke()
          }
        }
      }
    }
    
    // Initial draw
    drawCanvas()
    
    // Handle resize
    const handleResize = () => {
      drawCanvas()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const stages = [
    {
      id: 'founder',
      title: 'The Founder (Present)',
      period: '2026 - Present',
      description: 'Building the Future',
      workflow: 'Workflow & Designing: N8N, | ComfyUI | Framer | Figma | Rust (Solana) | Move (Sui)',
      vision: 'Multi-chain infrastructure at scale ($100k ARR target)',
      question: "Now I'm asking: 'What impact do I create?'",
      tools: ['N8N', 'Framer', 'Figma', 'Rust', 'Move'],
    },
    {
      id: 'pivot',
      title: 'The Pivot',
      period: 'The Transition',
      description: 'Transitioned from community moderator to professional developer',
      workflow: 'Balancing community engagement with technical development',
      tools: ['JavaScript', 'React', 'Web3', 'Community Tools'],
    },
    {
      id: 'breakthrough',
      title: 'The Breakthrough',
      period: 'The "Proof"',
      description: 'Achieved first hackathon victory with HyperionKit',
      workflow: 'Working in 3-member teams, learning through doing',
      tools: ['Solidity', 'React', 'Node.js', 'Ethers.js'],
    },
    {
      id: 'foundation',
      title: 'The Foundation',
      period: 'The Origin',
      description: 'Started as Web3 community moderator in 2022',
      workflow: 'Volunteer roles, learning through engagement',
      tools: ['Communication', 'Community Management', 'Web3 Basics'],
    },
  ]

  // Generate grid data for heatmap
  const gridData = useMemo(() => {
    const grid: CellData[][] = []
    const startDate = new Date(selectedYear, 0, 1)
    const endDate = new Date(selectedYear, 11, 31)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const weeks = Math.ceil(daysDiff / 7)

    for (let col = 0; col < weeks; col++) {
      const column: CellData[] = []
      for (let row = 0; row < 7; row++) {
        const dayOffset = col * 7 + row
        const cellDate = new Date(startDate)
        cellDate.setDate(startDate.getDate() + dayOffset)

        if (cellDate > endDate) {
          column.push({ level: 0, contributions: 0, date: cellDate })
          continue
        }

        const seed = (col * 7 + row) * 9301 + 49297 + selectedYear
        const val = (seed % 233280) / 233280
        let level = 0
        let contributions = 0

        if (val > 0.85) {
          level = 3
          contributions = Math.floor(Math.random() * 20) + 15
        } else if (val > 0.65) {
          level = 2
          contributions = Math.floor(Math.random() * 10) + 5
        } else if (val > 0.4) {
          level = 1
          contributions = Math.floor(Math.random() * 4) + 1
        }

        column.push({ level, contributions, date: cellDate })
      }
      grid.push(column)
    }
    return grid
  }, [selectedYear])

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
  const days = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleCellHover = (cell: CellData, event: React.MouseEvent<HTMLDivElement>) => {
    if (cell.contributions > 0) {
      const rect = event.currentTarget.getBoundingClientRect()
      setHoveredCell({
        date: cell.date,
        contributions: cell.contributions,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      })
    }
  }

  const handleCellLeave = () => {
    setHoveredCell(null)
  }

  const getColorForLevel = (level: number) => {
    switch (level) {
      case 0:
        return '#EBEDF0'
      case 1:
        return '#9BE9A8'
      case 2:
        return '#30A14E'
      case 3:
        return '#216E39'
      default:
        return '#EBEDF0'
    }
  }

  return (
    <>
      {/* Canvas Visualization Section - Full Width */}
      <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white overflow-hidden">
        <CornerDot position="tl" />
        <CornerDot position="tr" />
        
        <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[754px]">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ width: '100%', height: '100%', display: 'block', cursor: 'none' }}
          />
        </div>
      </section>

      {/* Timeline & Heatmap Combined Section */}
      <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
        <CornerDot position="bl" />
        <CornerDot position="br" />
        
        <div className="p-4 sm:p-6 md:p-8 lg:p-12">
          {/* Timeline Stages */}
          <div className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stages.map((stage, index) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(index)}
                  className={`text-left p-4 sm:p-6 rounded-lg border transition-all ${
                    activeStage === index
                      ? 'border-[#424242] bg-[#F8F8F8]'
                      : 'border-[#d5d5d5] bg-white hover:border-[#424242]/50 hover:bg-[#F8F8F8]/50'
                  }`}
                >
                  <h3 className="text-[clamp(16px,2vw,18px)] font-bold text-[#424242] mb-2 tracking-tight">
                    {stage.title}
                  </h3>
                  <p className="text-[clamp(12px,1.2vw,14px)] text-[#666666]">
                    {stage.period}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Stage Details */}
          <div className="mb-12 p-6 sm:p-8 rounded-lg border border-[#d5d5d5] bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[clamp(18px,2vw,20px)] font-bold text-[#424242] mb-4">
                  {stages[activeStage].title}
                </h4>
                <p className="text-[clamp(14px,1.5vw,16px)] leading-[1.7] text-[#555555] mb-4">
                  {stages[activeStage].description}
                </p>
                {stages[activeStage].workflow && (
                  <p className="text-[clamp(13px,1.4vw,15px)] leading-[1.7] text-[#666666] mb-4">
                    {stages[activeStage].workflow}
                  </p>
                )}
                {stages[activeStage].question && (
                  <p className="text-[clamp(14px,1.5vw,16px)] leading-[1.7] text-[#1342FF] font-semibold mb-4">
                    {stages[activeStage].question}
                  </p>
                )}
                {stages[activeStage].vision && (
                  <p className="text-[clamp(13px,1.4vw,15px)] leading-[1.7] text-[#555555]">
                    <strong className="text-[#424242]">Vision:</strong> {stages[activeStage].vision}
                  </p>
                )}
              </div>
              
              <div>
                <h5 className="text-[clamp(14px,1.5vw,16px)] font-semibold text-[#424242] mb-4">Tools & Technologies</h5>
                <div className="flex flex-wrap gap-2">
                  {stages[activeStage].tools.map((tool, toolIndex) => (
                    <div
                      key={toolIndex}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-[#d5d5d5] bg-white text-[clamp(11px,1.2vw,12px)] font-medium text-[#424242]"
                    >
                      {tool}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Heatmap Section */}
          <div className="border-t border-[#d5d5d5] pt-8 sm:pt-10 md:pt-12">
            <div className="mb-6">
              <h3 className="text-[clamp(18px,2vw,20px)] font-bold text-[#424242] mb-2 tracking-[-0.01em]">
                Heatmap
              </h3>
              <p className="text-[clamp(12px,1.2vw,14px)] text-[#666666] leading-relaxed">
                a visual representation on a user&apos;s profile page that shows their activity levels over the past year.
                Each square in the grid represents a day, and its color intensity indicates the number of contributions made on that specific day,
                such as commits, pull requests, and issues opened.
              </p>
            </div>

            {/* Year Selector */}
            <div className="flex flex-row lg:flex-col gap-1.5 mb-6 w-full lg:w-[80px] shrink-0">
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

            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
              <div className="flex gap-1.5 min-w-max">
                {/* Month Labels */}
                <div className="flex flex-col gap-1.5 mr-2">
                  <div className="h-4"></div>
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className="h-[10px] sm:h-[11px] text-[clamp(9px,1vw,10px)] text-[#666666] flex items-center"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grid Columns */}
                <div className="flex gap-1.5">
                  {gridData.map((column, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-1.5">
                      {/* Month label at top */}
                      {colIndex % 4 === 0 && colIndex < months.length * 4 && (
                        <div className="h-4 text-[clamp(9px,1vw,10px)] text-[#666666]">
                          {months[Math.floor(colIndex / 4)]}
                        </div>
                      )}
                      {colIndex % 4 !== 0 && colIndex < months.length * 4 && <div className="h-4"></div>}
                      
                      {/* Day cells */}
                      {column.map((cell, rowIndex) => (
                        <div
                          key={rowIndex}
                          className={`w-[10px] sm:w-[11px] h-[10px] sm:h-[11px] rounded-[2px] cursor-pointer transition-all hover:ring-2 hover:ring-[#424242] hover:ring-offset-1`}
                          style={{ backgroundColor: getColorForLevel(cell.level) }}
                          onMouseEnter={(e) => handleCellHover(cell, e)}
                          onMouseLeave={handleCellLeave}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
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
      </section>

      {/* Tooltip Portal */}
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

