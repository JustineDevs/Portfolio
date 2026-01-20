"use client"

import { SmoothScroll } from "@/components/ui/smooth-scroll"

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return <SmoothScroll>{children}</SmoothScroll>
}

