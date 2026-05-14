/**
 * Visitor ID Utility
 * Generates and stores a unique visitor ID in localStorage
 * This allows us to track anonymous likes without authentication
 */

const VISITOR_ID_KEY = 'portfolio-visitor-id'

/**
 * Generates a unique visitor ID
 * Format: timestamp-randomstring
 */
function generateVisitorId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 11)
  return `${timestamp}-${random}`
}

/**
 * Gets or creates a visitor ID
 * Stores it in localStorage for persistence across sessions
 */
export function getVisitorId(): string {
  if (typeof window === 'undefined') {
    // Server-side: return a temporary ID (shouldn't be used)
    return 'server-temp-id'
  }

  let visitorId = localStorage.getItem(VISITOR_ID_KEY)

  if (!visitorId) {
    visitorId = generateVisitorId()
    localStorage.setItem(VISITOR_ID_KEY, visitorId)
  }

  return visitorId
}

/**
 * Checks if visitor ID exists (for testing/debugging)
 */
export function hasVisitorId(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem(VISITOR_ID_KEY)
}

