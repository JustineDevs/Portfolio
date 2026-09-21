'use client'

import { useState, type HTMLAttributes, type ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ElasticStackItem {
  id: string | number
  image?: string
  name?: string
  icon?: ReactNode
}

interface ElasticStackProps extends HTMLAttributes<HTMLDivElement> {
  items: ElasticStackItem[]
  itemSize?: number
  overlap?: number
  pushForce?: number
}

export default function ElasticStack({
  items,
  itemSize = 20,
  overlap = 8,
  pushForce = 4,
  className,
  ...props
}: ElasticStackProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div
      className={cn('inline-flex items-center py-1', className)}
      onMouseLeave={() => setHoveredIndex(null)}
      {...props}
    >
      {items.map((item, index) => {
        const isHovered = hoveredIndex === index
        const translateX = hoveredIndex === null
          ? 0
          : index > hoveredIndex
            ? Math.min(pushForce * (items.length - index - 1), overlap)
            : index < hoveredIndex
              ? -Math.min(pushForce * index, overlap)
              : 0

        return (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredIndex(index)}
            className={cn(
              'relative isolate flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white bg-[#424242] text-[8px] font-semibold text-white shadow-sm transition-[transform,box-shadow] duration-300',
              isHovered && 'shadow-md'
            )}
            style={{
              width: itemSize,
              height: itemSize,
              marginLeft: index === 0 ? 0 : -overlap,
              transform: `translateX(${translateX}px) scale(${isHovered ? 1.2 : 1})`,
              zIndex: isHovered ? 100 : index,
            }}
          >
            {item.icon ? (
              item.icon
            ) : item.image ? (
              <Image src={item.image} alt={item.name || ''} width={itemSize} height={itemSize} unoptimized className="h-full w-full object-cover" />
            ) : (
              item.name?.charAt(0).toUpperCase() || index + 1
            )}
          </div>
        )
      })}
    </div>
  )
}
