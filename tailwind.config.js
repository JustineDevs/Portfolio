/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
        animation: {
          ripple: "ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite",
          orbit: "orbit var(--duration) linear infinite",
        },
        keyframes: {
          ripple: {
            "0%, 100%": {
              transform: "translate(-50%, -50%) scale(1)",
            },
            "50%": {
              transform: "translate(-50%, -50%) scale(0.9)",
            },
          },
          orbit: {
            "0%": {
              transform: "rotate(0deg) translateY(calc(var(--radius) * -1)) rotate(0deg)",
            },
            "100%": {
              transform: "rotate(360deg) translateY(calc(var(--radius) * -1)) rotate(-360deg)",
            },
          },
        },
      screens: {
        'xs': '375px',   // Small mobile (iPhone SE, etc.)
        'sm': '480px',   // Mobile (standard smartphones)
        'md': '768px',   // Tablet portrait
        'lg': '1024px',  // Tablet landscape / Small desktop
        'xl': '1280px',  // Desktop (Full HD)
        '2xl': '1920px', // Large desktop
        '3xl': '2560px', // Ultra-wide (QHD)
      },
      fontSize: {
        'fluid-xs': ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', { lineHeight: '1.4' }],
        'fluid-sm': ['clamp(0.875rem, 0.8rem + 0.35vw, 1rem)', { lineHeight: '1.5' }],
        'fluid-base': ['clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', { lineHeight: '1.6' }],
        'fluid-lg': ['clamp(1.125rem, 1rem + 0.6vw, 1.25rem)', { lineHeight: '1.45' }],
        'fluid-xl': ['clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', { lineHeight: '1.2' }],
        'fluid-2xl': ['clamp(1.5rem, 1.2rem + 1.5vw, 2rem)', { lineHeight: '1.1' }],
        'fluid-3xl': ['clamp(1.875rem, 1.4rem + 2.25vw, 2.5rem)', { lineHeight: '1.05' }],
        'fluid-4xl': ['clamp(2.25rem, 1.5rem + 3.75vw, 3.5rem)', { lineHeight: '0.98' }],
        'fluid-5xl': ['clamp(3rem, 1.8rem + 6vw, 5rem)', { lineHeight: '0.95' }],
      },
      spacing: {
        'fluid-1': 'clamp(0.25rem, 0.5vw, 0.5rem)',
        'fluid-2': 'clamp(0.5rem, 1vw, 1rem)',
        'fluid-4': 'clamp(1rem, 2vw, 2rem)',
        'fluid-8': 'clamp(2rem, 4vw, 4rem)',
        'fluid-16': 'clamp(4rem, 8vw, 8rem)',
      },
      containers: {
        xs: '320px',
        sm: '384px',
        md: '448px',
        lg: '512px',
        xl: '576px',
        '2xl': '672px',
      },
      colors: {
        primary: {
          theme: '#F8F8F8',
          backgroundDark: '#424242',
          backgroundLight: '#FFFFFF',
          backgroundAccent: '#1342FF',
          button: '#A8CEFF',
          icons: '#484848',
          font: '#383838',
          footerFont: '#2A2A2A',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        serif: ['var(--font-newsreader)', 'Georgia', 'serif'], // Keeping fallback just in case
        logo: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      spacing: {
        'touch': '44px', // Minimum touch target size
      },
    },
  },
  plugins: [],
}
