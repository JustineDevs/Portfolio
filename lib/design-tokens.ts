/**
 * Design Tokens
 * Centralized design system values for consistent styling across the application
 */

export const tokens = {
  // Colors
  colors: {
    background: {
      primary: '#F8F8F8',
      secondary: '#FAFAFA',
      dark: '#424242',
      white: '#FFFFFF',
    },
    text: {
      primary: '#424242',
      secondary: '#666666',
      tertiary: '#555555',
      accent: '#1342FF',
    },
    border: {
      default: '#d5d5d5',
      light: '#e0e0e0',
      lighter: '#E5E5E5',
    },
    interactive: {
      hover: '#383838',
      active: '#333333',
    },
  },

  // Spacing
  spacing: {
    section: 'p-8 lg:p-12',
    card: 'p-6',
    button: {
      sm: 'px-4 py-1.5',
      md: 'px-5 py-2',
      lg: 'px-6 py-3',
    },
    gap: {
      xs: 'gap-2',
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
    },
  },

  // Typography
  typography: {
    heading: {
      h1: 'text-[28px] lg:text-[32px] font-bold text-[#424242] tracking-tight',
      h2: 'text-[20px] font-bold text-[#424242] mb-6 tracking-[-0.01em]',
      h3: 'text-[18px] font-bold text-[#424242] mb-4 tracking-[-0.01em]',
      h4: 'text-[16px] font-bold text-[#424242]',
    },
    body: {
      default: 'text-[14px] leading-[1.7] text-[#555555]',
      small: 'text-[13px] leading-[1.6] text-[#555555]',
      large: 'text-[15px] leading-[1.8] text-[#555555]',
    },
    label: {
      default: 'text-[12px] text-[#666666]',
      small: 'text-[11px] text-[#666666]',
      uppercase: 'text-[10px] font-bold text-[#666666] tracking-wider uppercase',
    },
  },

  // Borders
  borders: {
    default: 'border border-[#d5d5d5]',
    light: 'border border-[#e0e0e0]',
    rounded: 'rounded-lg',
    roundedFull: 'rounded-full',
    section: 'border-l border-r border-b border-[#d5d5d5]',
  },

  // Shadows
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  },

  // Transitions
  transitions: {
    default: 'transition-all duration-300',
    fast: 'transition-all duration-200',
    slow: 'transition-all duration-500',
    colors: 'transition-colors duration-300',
    opacity: 'transition-opacity duration-300',
  },

  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    preloading: 9999,
  },

  // Responsive Design Tokens
  responsive: {
    breakpoints: {
      xs: '375px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1920px',
      '3xl': '2560px',
    },
    container: {
      mobile: 'w-[92%]',
      tablet: 'md:w-[88%]',
      desktop: 'lg:w-[75%]',
      large: 'xl:w-[70%]',
      maxWidth: 'max-w-[1400px]',
      // Progressive container width utility
      progressive: 'w-[92%] sm:w-[88%] md:w-[85%] lg:w-[75%] xl:w-[70%] 2xl:max-w-[1400px]',
    },
    padding: {
      mobile: 'px-4 sm:px-6',
      tablet: 'md:px-8',
      desktop: 'lg:px-12',
      section: 'py-12 sm:py-16 md:py-20 lg:py-24',
      sectionHorizontal: 'px-4 sm:px-6 md:px-8 lg:px-12',
    },
    gap: {
      mobile: 'gap-4',
      tablet: 'md:gap-6',
      desktop: 'lg:gap-8',
      progressive: 'gap-4 md:gap-6 lg:gap-8',
    },
    typography: {
      fluid: {
        h1: 'text-[clamp(32px,5vw,86px)]',
        h2: 'text-[clamp(24px,3vw,32px)]',
        h3: 'text-[clamp(18px,2vw,20px)]',
        h4: 'text-[clamp(16px,1.5vw,18px)]',
        body: 'text-[clamp(14px,1.5vw,16px)]',
        bodyLarge: 'text-[clamp(16px,2vw,18px)]',
        bodySmall: 'text-[clamp(12px,1.2vw,14px)]',
      },
    },
    touchTargets: {
      minimum: 'min-h-[44px] min-w-[44px]',
      button: 'px-4 py-2.5 sm:px-5 sm:py-3 min-h-[44px]',
      icon: 'w-6 h-6 sm:w-7 sm:h-7',
    },
    grid: {
      mobile: 'grid-cols-1',
      mobile2: 'grid-cols-1 sm:grid-cols-2',
      tablet: 'md:grid-cols-2 md:grid-cols-3',
      desktop: 'lg:grid-cols-3 lg:grid-cols-4',
      large: 'xl:grid-cols-4 xl:grid-cols-6',
      // Common grid patterns
      projects: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      resume: 'grid-cols-1 lg:grid-cols-2',
    },
  },
} as const

// Animation variants for Framer Motion
export const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 },
  },
  modeSwitch: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
} as const

