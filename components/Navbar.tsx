"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import CornerDot from './ui/CornerDot';
import { useMode } from '@/components/providers/ModeProvider';
import { tokens } from '@/lib/design-tokens';

const PERSONAL_ONLY_PAGES = ['/about', '/projects', '/experience', '/collection'] as const
const PROFESSIONAL_MODE_PAGE = '/'
const isPersonalOnlyPage = (value: string) =>
  (PERSONAL_ONLY_PAGES as readonly string[]).includes(value)

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, setMode, saveCurrentPage } = useMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mode === 'professional' && isPersonalOnlyPage(pathname)) {
      if (pathname !== PROFESSIONAL_MODE_PAGE) {
        try {
          const savedPages = JSON.parse(
            localStorage.getItem('portfolio-mode-pages') || '{}'
          )
          savedPages['professional'] = PROFESSIONAL_MODE_PAGE
          localStorage.setItem('portfolio-mode-pages', JSON.stringify(savedPages))
        } catch (error) {
          console.error('Failed to save professional page:', error)
        }
      }
      setMode('personal', pathname)
    }
    saveCurrentPage(pathname)
  }, [pathname, mode, setMode, saveCurrentPage])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Experience', href: '/experience' },
    { name: 'Collection', href: '/collection' },
  ];

  const handleNavLinkClick = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (mode === 'professional' && isPersonalOnlyPage(href)) {
      e.preventDefault()
      try {
        const savedPages = JSON.parse(
          localStorage.getItem('portfolio-mode-pages') || '{}'
        )
        savedPages['professional'] = PROFESSIONAL_MODE_PAGE
        localStorage.setItem('portfolio-mode-pages', JSON.stringify(savedPages))
      } catch (error) {
        console.error('Failed to save professional page:', error)
      }
      setMode('personal', pathname)
      router.push(href)
    }
  }

  return (
    <div className="w-full font-sans">
      <nav className={`tier-1-navbar sticky top-0 z-50 w-full border-b border-[#d5d5d5] backdrop-blur-md ${tokens.transitions.default} bg-[#FAFAFA]/92 overflow-hidden`}>
        <div className="relative w-[95%] xs:w-[92%] sm:w-[90%] md:w-[88%] lg:w-[82%] xl:w-[75%] 2xl:w-[70%] 3xl:max-w-[1600px] mx-auto h-[56px] xs:h-[60px] sm:h-[65px] flex items-center justify-between overflow-hidden px-2 xs:px-0">
          <CornerDot position="bl" className="hidden sm:block" />
          <CornerDot position="br" className="hidden sm:block" />
          
          <div className="flex items-center h-full gap-2 xs:gap-4">
            <div className="relative navbar-logo-div h-full flex items-center pr-2 xs:pr-4">
              <CornerDot position="br" className="hidden lg:block opacity-0" />
              <Link 
                href="/" 
                className="flex items-center gap-2 xs:gap-4 group select-none transition-opacity duration-300 hover:opacity-80"
                onClick={(e) => {
                  if (pathname !== '/') {
                    e.preventDefault()
                    saveCurrentPage(pathname)
                    sessionStorage.setItem('has-seen-preloading', 'true')
                    router.push('/')
                  }
                }}
              >
                <Image
                  src="/JSTN Logo/SVG/Logo Header - B.svg"
                  alt="JSTN Logo"
                  width={140}
                  height={48}
                  sizes="140px"
                  className="object-contain h-8 xs:h-10 sm:h-12 w-auto"
                  priority
                  unoptimized
                />
              </Link>
            </div>

            <div className="navbar-menu-div hidden lg:flex items-center gap-4 xl:gap-8 ml-2 xl:ml-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(link.href, e)}
                  className={`text-xs xl:text-sm font-medium tracking-[0.08em] transition-all duration-300 relative whitespace-nowrap pb-1 ${
                    pathname === link.href 
                      ? 'text-[#424242]' 
                      : 'text-gray-500 hover:text-[#424242]'
                  }`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#424242]"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
            <div className="hidden md:flex items-center p-0.5 sm:p-1 bg-white border border-[#d5d5d5] rounded-full">
              <button 
                onClick={() => {
                  if (mode === 'personal') return;
                  const lastPage = setMode('personal', pathname);
                  if (lastPage && lastPage !== pathname) {
                    router.push(lastPage);
                  } else if (!lastPage) {
                    router.push('/');
                  }
                }}
                className={`px-2 sm:px-3 lg:px-4 py-1 rounded-full text-[9px] sm:text-[10px] font-medium transition-all whitespace-nowrap ${
                  mode === 'personal' 
                    ? 'bg-[#424242] text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Personal
              </button>
              <button 
                onClick={() => {
                  if (mode === 'professional') return;
                  if (pathname !== PROFESSIONAL_MODE_PAGE) {
                    setMode('personal', pathname)
                    router.push('/')
                    requestAnimationFrame(() => {
                      requestAnimationFrame(() => {
                        setMode('professional', '/')
                      })
                    })
                  } else {
                    setMode('professional', pathname)
                  }
                }}
                className={`px-2 sm:px-3 lg:px-4 py-1 rounded-full text-[9px] sm:text-[10px] font-medium transition-all whitespace-nowrap ${
                  mode === 'professional' 
                    ? 'bg-[#424242] text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Professional
              </button>
            </div>

            <div className="hidden sm:block w-px h-4 bg-gray-300" />

            <a 
              href="https://t.me/TraderGOfficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 sm:gap-2 rounded-full border border-transparent px-2 py-1 text-[10px] sm:text-xs font-medium text-gray-600 hover:border-[#d5d5d5] hover:text-[#424242] transition-colors whitespace-nowrap"
              aria-label="Shoot a DM on Telegram"
            >
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#0055FF]" />
              <span className="hidden xs:inline">Shoot a DM</span>
              <span className="xs:hidden">DM</span>
            </a>

            <a 
              href="https://cal.com/justinedevs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden xs:block bg-[#424242] text-white text-[10px] sm:text-xs font-medium px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 min-h-[36px] sm:min-h-[40px] lg:min-h-[44px] rounded-md hover:bg-[#333333] transition-colors shadow-sm tracking-[0.04em] focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2 whitespace-nowrap flex items-center justify-center"
              aria-label="Schedule a call"
            >
              Schedule a Call
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 xs:p-2 text-[#424242] hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} className="xs:w-6 xs:h-6" /> : <Menu size={20} className="xs:w-6 xs:h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white/98 backdrop-blur-md border-b border-[#d5d5d5] overflow-hidden"
          >
            <div className="w-[95%] xs:w-[92%] sm:w-[90%] md:w-[88%] mx-auto px-2 xs:px-4 py-4 space-y-4">
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      handleNavLinkClick(link.href, e)
                      setMobileMenuOpen(false)
                    }}
                    className={`rounded-md text-sm font-medium tracking-[0.08em] transition-colors py-2 ${
                      pathname === link.href
                        ? 'bg-[#f5f6f8] text-[#424242] border-l-2 border-[#424242] pl-3'
                        : 'text-gray-500 hover:bg-[#f8f8f8] hover:text-[#424242] pl-3'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-[#d5d5d5] space-y-4">
                <div className="flex items-center p-1 bg-white border border-[#d5d5d5] rounded-full w-fit">
                  <button
                    onClick={() => {
                      if (mode === 'personal') return
                      const lastPage = setMode('personal', pathname)
                      setMobileMenuOpen(false)
                      if (lastPage && lastPage !== pathname) {
                        router.push(lastPage)
                      } else if (!lastPage) {
                        router.push('/')
                      }
                    }}
                    className={`px-3 xs:px-4 py-1 rounded-full text-[10px] font-medium transition-all ${
                      mode === 'personal'
                        ? 'bg-[#424242] text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Personal
                  </button>
                  <button
                    onClick={() => {
                      if (mode === 'professional') return
                      if (pathname !== PROFESSIONAL_MODE_PAGE) {
                        setMode('personal', pathname)
                        router.push('/')
                        requestAnimationFrame(() => {
                          requestAnimationFrame(() => {
                            setMode('professional', '/')
                          })
                        })
                      } else {
                        setMode('professional', pathname)
                      }
                      setMobileMenuOpen(false)
                    }}
                    className={`px-3 xs:px-4 py-1 rounded-full text-[10px] font-medium transition-all ${
                      mode === 'professional'
                        ? 'bg-[#424242] text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Professional
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <a
                    href="https://cal.com/justinedevs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[44px] items-center justify-center rounded-md bg-[#424242] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#333333]"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Schedule a call"
                  >
                    Schedule a Call
                  </a>
                  <a
                    href="https://t.me/TraderGOfficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[44px] items-center justify-center rounded-md border border-[#d5d5d5] px-4 py-3 text-sm font-medium text-[#424242] transition-colors hover:bg-[#f8f8f8]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Send a Message
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
