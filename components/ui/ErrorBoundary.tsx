'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component to catch and display errors gracefully
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-[#d5d5d5] rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#424242] mb-2">
                  Something went wrong
                </h2>
                <p className="text-sm text-[#666666] mb-4">
                  We encountered an unexpected error. Please try refreshing the page.
                </p>
                {this.state.error && process.env.NODE_ENV === 'development' && (
                  <details className="mt-4">
                    <summary className="text-xs text-[#666666] cursor-pointer mb-2">
                      Error details (development only)
                    </summary>
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                  </details>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-[#424242] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-[#383838] transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

