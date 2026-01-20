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
