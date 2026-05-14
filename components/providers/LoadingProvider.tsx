"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface LoadingContextType {
  isLoading: boolean
}

const LoadingContext = createContext<LoadingContextType>({ isLoading: true })

export function useLoading() {
  return useContext(LoadingContext)
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // State 1: Dark background with "JUSTINE"
    setTimeout(() => {
      // Still loading
    }, 800)

    // State 2: Light background with "JSTN"
    setTimeout(() => {
      // Still loading
    }, 2000)

    // Hide after both states
    setTimeout(() => {
      setIsLoading(false)
    }, 3500)
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

