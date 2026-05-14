"use client"

import { motion } from 'framer-motion'
import type { ComponentType } from 'react'
import { 
  Instagram, 
  Linkedin, 
  Github,
  Send,
  Mail,
} from 'lucide-react'

interface SocialLink {
  platform: 'instagram' | 'x' | 'linkedin' | 'github' | 'telegram' | 'email'
  url: string
  // Lucide icons accept `size?: string | number`, so our type must match that.
  icon: ComponentType<{ size?: number | string; className?: string }>
}

// GitHub Icon Component
const GitHubIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

interface NeumorphicSocialButtonProps {
  links?: SocialLink[]
  size?: number
  bgColor?: string
  shadowColor?: string
}

// X (Twitter) Icon Component
const XIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const defaultLinks: SocialLink[] = [
  { platform: 'x', url: 'https://x.com/Trader2G', icon: XIcon },
  { platform: 'linkedin', url: 'https://linkedin.com/in/justine-lupasi-444608295', icon: Linkedin },
  { platform: 'github', url: 'https://github.com/justinedevs', icon: GitHubIcon },
  { platform: 'telegram', url: 'https://t.me/TraderGOfficial', icon: Send },
  { platform: 'email', url: 'mailto:JustineDevs@jstn.site', icon: Mail },
]

export default function NeumorphicSocialButton({ 
  links = defaultLinks,
  size = 48,
  bgColor = '#F8F8F8',
  shadowColor = '#E0E0E0'
}: NeumorphicSocialButtonProps) {
  return (
    <div className="flex items-center gap-3">
      {links.map((link) => {
        const Icon = link.icon
        const isMailto = link.url.startsWith('mailto:')
        return (
          <motion.a
            key={link.platform}
            href={link.url}
            {...(isMailto
              ? {}
              : { target: '_blank', rel: 'noopener noreferrer' })}
            className="relative flex items-center justify-center rounded-xl transition-all duration-300"
            style={{
              width: size,
              height: size,
              backgroundColor: bgColor,
              boxShadow: `
                -6px -6px 12px rgba(255, 255, 255, 0.8),
                6px 6px 12px rgba(0, 0, 0, 0.1),
                inset -2px -2px 4px rgba(255, 255, 255, 0.9),
                inset 2px 2px 4px rgba(0, 0, 0, 0.05)
              `,
            }}
            whileHover={{
              boxShadow: `
                -4px -4px 8px rgba(255, 255, 255, 0.9),
                4px 4px 8px rgba(0, 0, 0, 0.15),
                inset -1px -1px 2px rgba(255, 255, 255, 1),
                inset 1px 1px 2px rgba(0, 0, 0, 0.1)
              `,
              scale: 0.95,
            }}
            whileTap={{
              boxShadow: `
                inset 4px 4px 8px rgba(0, 0, 0, 0.15),
                inset -4px -4px 8px rgba(255, 255, 255, 0.8)
              `,
              scale: 0.92,
            }}
            transition={{ duration: 0.2 }}
          >
            <Icon 
              size={size * 0.45} 
              className="text-[#424242] transition-colors duration-300" 
            />
          </motion.a>
        )
      })}
    </div>
  )
}

