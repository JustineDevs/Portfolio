/**
 * Color utilities for consistent styling
 * Based on design specifications from JSON.md
 */

export const colors = {
  theme: '#F8F8F8',
  background: {
    dark: '#424242',
    light: '#FFFFFF',
    accent: '#1342FF',
  },
  button: '#A8CEFF',
  icons: '#484848',
  font: '#383838',
  footerFont: '#2A2A2A',
} as const

/**
 * Get Tailwind-compatible color class names
 * Use with className like: className={colorClasses.font}
 */
export const colorClasses = {
  theme: 'bg-[#F8F8F8]',
  backgroundDark: 'bg-[#424242]',
  backgroundLight: 'bg-[#FFFFFF]',
  backgroundAccent: 'bg-[#1342FF]',
  button: 'bg-[#A8CEFF]',
  icons: 'text-[#484848]',
  font: 'text-[#383838]',
  footerFont: 'text-[#2A2A2A]',
  textFont: 'text-[#383838]',
  textIcons: 'text-[#484848]',
  textAccent: 'text-[#1342FF]',
} as const

