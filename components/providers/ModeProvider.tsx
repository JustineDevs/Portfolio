"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Mode = 'personal' | 'professional'

interface ModeContextType {
  mode: Mode
  setMode: (mode: Mode, currentPath?: string) => string | null
  saveCurrentPage: (path: string) => void
  getLastVisitedPage: (mode: Mode) => string | null
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

// Valid pages that can be tracked
const VALID_PAGES = ['/', '/about', '/projects', '/experience']

function isValidPage(path: string): boolean {
  return VALID_PAGES.includes(path) || path.startsWith('/projects/')
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('personal')

  useEffect(() => {
    // Load from localStorage on mount
    const savedMode = localStorage.getItem('portfolio-mode') as Mode
    if (savedMode === 'personal' || savedMode === 'professional') {
      setModeState(savedMode)
    }
  }, [])

  // Save current page for the current mode
  const saveCurrentPage = (path: string) => {
    if (!isValidPage(path)) return
    
    try {
      const savedPages = JSON.parse(
        localStorage.getItem('portfolio-mode-pages') || '{}'
      )
      savedPages[mode] = path
      localStorage.setItem('portfolio-mode-pages', JSON.stringify(savedPages))
    } catch (error) {
      console.error('Failed to save current page:', error)
    }
  }

  // Get last visited page for a specific mode
  const getLastVisitedPage = (targetMode: Mode): string | null => {
    try {
      const savedPages = JSON.parse(
        localStorage.getItem('portfolio-mode-pages') || '{}'
      )
      const lastPage = savedPages[targetMode]
      return lastPage && isValidPage(lastPage) ? lastPage : null
    } catch (error) {
      console.error('Failed to get last visited page:', error)
      return null
    }
  }

  // Set mode and return the last visited page for the new mode
  const setMode = (newMode: Mode, currentPath?: string): string | null => {
    // Save current page before switching
    if (currentPath && mode !== newMode) {
      saveCurrentPage(currentPath)
    }

    // Update mode
    setModeState(newMode)
    localStorage.setItem('portfolio-mode', newMode)

    // Return the last visited page for the new mode
    return getLastVisitedPage(newMode)
  }

  return (
    <ModeContext.Provider value={{ mode, setMode, saveCurrentPage, getLastVisitedPage }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const context = useContext(ModeContext)
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}

