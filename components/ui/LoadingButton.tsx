'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface LoadingButtonProps {
  children: ReactNode
  isLoading?: boolean
  onClick?: () => void | Promise<void>
  disabled?: boolean
  className?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const variantClasses = {
  primary: 'bg-[#424242] text-white hover:bg-[#383838]',
  secondary: 'bg-white border border-[#d5d5d5] text-[#424242] hover:bg-gray-50',
  outline: 'border border-[#424242] text-[#424242] hover:bg-[#424242] hover:text-white',
}

const sizeClasses = {
  sm: 'px-4 py-1.5 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function LoadingButton({
  children,
  isLoading = false,
  onClick,
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
}: LoadingButtonProps) {
  const handleClick = async () => {
    if (isLoading || disabled || !onClick) return
    await onClick()
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={`${variantClasses[variant]} ${sizeClasses[size]} font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2 ${className}`}
      whileHover={!isLoading && !disabled ? { scale: 1.02 } : {}}
      whileTap={!isLoading && !disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {children}
      </span>
    </motion.button>
  )
}

