'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CornerDot from '@/components/ui/CornerDot';
import LiquidImage from '@/components/ui/LiquidImage';
import { ScrambleTextOnHover } from '@/components/ui/scramble-text';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import Modal from '@/components/ui/Modal';

type Theme = 'black' | 'white' | 'iridescent';

export default function BrandBadgeProjectsSection() {
  const [activeTheme, setActiveTheme] = useState<Theme>('black');
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const badgeData = {
    'metis': {
      title: 'Metis Hackathon',
      event: 'METIS HYPERION HACKATHON',
      description: 'Won first place in the Metis Hyperion Hackathon. Developed innovative blockchain solutions using Metis Layer 2 technology.',
      date: '2025',
      link: 'https://forum.ceg.vote/t/hyperhack-winners/10593',
    },
    'avalanche': {
      title: 'Avalanche x402',
      event: 'AVALANCHE BUILD X402 AGENTS',
      description: 'Achieved recognition in the Avalanche Build x402 Agents program. Built decentralized applications leveraging Avalanche\'s high-performance blockchain.',
      date: '2025',
      link: 'https://x.com/AvaxDevelopers/status/2001334825199063331',
    },
      'mantle': {
        title: 'Mantle Hackathon',
        event: 'MANTLE GLOBAL HACKATHON',
        description: 'Currently participating in the Mantle Global Hackathon 2025. Building innovative solutions on Mantle Network. Results to be announced.',
        date: '2025',
        link: 'https://www.hackquest.io/projects/Mantle-Global-Hackathon-2025-Hyperkit',
      },
  };

  const handleBadgeClick = (badgeId: string) => {
    setSelectedBadge(badgeId);
    setIsModalOpen(true);
  };

  const themeConfig = {
    black: {
      label: '/Black',
      bgColor: 'bg-white',
      borderColor: 'border-[#e0e0e0]',
      textColor: 'text-[#666666]',
      previewBg: 'bg-[#FAFAFA]',
      previewBorder: 'border-[#E5E5E5]',
    },
    white: {
      label: '/White',
      bgColor: 'bg-[#424242]',
      borderColor: 'border-[#4a4a4a]',
      textColor: 'text-white/60',
      previewBg: 'bg-[#4a4a4a]',
      previewBorder: 'border-white/20',
    },
    iridescent: {
      label: '/Iridescent',
      bgColor: 'bg-[#1a1a1a]',
      borderColor: 'border-[#333333]',
      textColor: 'text-white/80',
      previewBg: 'bg-[#2a2a2a]',
      previewBorder: 'border-white/20',
    },
  };

  const getLogoSrc = (variant: 'header' | 'abstract' | 'brand') => {
    const themeMap = {
      black: 'B',
      white: 'W',
      iridescent: 'irisdecent',
    };
    const suffix = themeMap[activeTheme];
    
    if (variant === 'header') {
      return `/JSTN Logo/SVG/Logo Header - ${suffix}.svg`;
    } else if (variant === 'abstract') {
      return `/JSTN Logo/SVG/Abstract Symbol - ${suffix}.svg`;
    } else {
      // Handle case difference: "Brand name" for B/W, "Brand Name" for iridescent
      const brandNameFile = activeTheme === 'iridescent' 
        ? `Brand Name - ${suffix}.svg`
        : `Brand name - ${suffix}.svg`;
      return `/JSTN Logo/SVG/${brandNameFile}`;
    }
  };

  const currentTheme = themeConfig[activeTheme];

  return (
    <section className="w-full">
        {/* Header Row */}
          <div className="relative border-l border-r border-b border-[#d5d5d5] flex flex-col lg:flex-row">
            <div className="lg:w-1/2 shrink-0 border-b lg:border-b-0 lg:border-r border-[#d5d5d5] h-[48px] xs:h-[52px] sm:h-[56px] flex items-center px-4 xs:px-5 sm:px-6">
              <h2 className="text-[16px] xs:text-[18px] sm:text-[20px] font-bold text-[#424242] tracking-[-0.01em]">
                <ScrambleTextOnHover text="Brand Assets" as="span" />
              </h2>
            </div>
            <div className="flex-1 h-[48px] xs:h-[52px] sm:h-[56px] flex items-center px-4 xs:px-5 sm:px-6">
              <h2 className="text-[16px] xs:text-[18px] sm:text-[20px] font-bold text-[#424242] tracking-[-0.01em]">
                <ScrambleTextOnHover text="Featured Projects" as="span" />
              </h2>
            </div>
          </div>

        {/* Content Row */}
        <div className="relative border-l border-r border-b border-[#d5d5d5] flex flex-col lg:flex-row">
          
          {/* Left Column: Brand Assets & Badge */}
          <div className="lg:w-1/2 shrink-0 border-b lg:border-b-0 lg:border-r border-[#d5d5d5]">
            <div className="p-3 xs:p-4 sm:p-5 border-b border-[#d5d5d5]">
              {/* Theme Tabs */}
              <div className="flex gap-1.5 xs:gap-2 mb-3 xs:mb-4">
                {(['black', 'white', 'iridescent'] as Theme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setActiveTheme(theme)}
                    className={`px-2 xs:px-3 py-1 xs:py-1.5 text-[10px] xs:text-[11px] font-semibold rounded-lg transition-colors ${
                      activeTheme === theme
                        ? theme === 'black'
                          ? 'bg-[#424242] text-white'
                          : theme === 'white'
                          ? 'bg-white text-[#424242]'
                          : 'bg-[#2a2a2a] text-white'
                        : 'text-[#666666] hover:bg-[#F8F8F8]'
                    }`}
                  >
                    {themeConfig[theme].label}
                  </button>
                ))}
              </div>

              {/* Logo Preview Container */}
              <div className={`${currentTheme.bgColor} border ${currentTheme.borderColor} rounded-xl p-4 xs:p-5 sm:p-6`}>
                <p className={`text-[10px] xs:text-[11px] font-semibold ${currentTheme.textColor} mb-3 xs:mb-4`}>
                  {currentTheme.label}
                </p>
                
                {/* Logo Header (Full Logo) */}
                <div className={`flex items-center justify-center border ${currentTheme.previewBorder} rounded-lg h-[70px] xs:h-[85px] sm:h-[100px] ${currentTheme.previewBg} mb-3 xs:mb-4`}>
                  <div className="relative w-full h-full max-w-[260px] xs:max-w-[290px] sm:max-w-[320px]">
                    <Image
                      src={getLogoSrc('header')}
                      alt="JSTN Logo Header"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Abstract Symbol & Brand Name */}
                <div className="flex gap-2 xs:gap-3">
                  {/* Abstract Symbol */}
                  <div className={`flex-1 border ${currentTheme.previewBorder} rounded-lg h-[50px] xs:h-[60px] sm:h-[70px] flex items-center justify-center ${currentTheme.previewBg}`}>
                    <div className="relative w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12">
                      <Image
                        src={getLogoSrc('abstract')}
                        alt="JSTN Abstract Symbol"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* Brand Name */}
                  <div className={`flex-[2] border ${currentTheme.previewBorder} rounded-lg h-[50px] xs:h-[60px] sm:h-[70px] flex items-center justify-center ${currentTheme.previewBg}`}>
                    <div className="relative w-full h-full max-w-[140px] xs:max-w-[160px] sm:max-w-[180px]">
                      <Image
                        src={getLogoSrc('brand')}
                        alt="JSTN Brand Name"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[50px] xs:h-[55px] sm:h-[60px] border-b border-[#d5d5d5] flex items-center justify-between px-3 xs:px-4 sm:px-5">
              <div>
                <h2 className="text-[15px] xs:text-[16px] sm:text-[18px] font-bold text-[#424242]">Featured Badge</h2>
                <p className="text-[10px] xs:text-[11px] sm:text-[12px] text-[#666666] mt-0.5">Badges earned from hackathon wins</p>
              </div>
              <Link
                href="/projects"
                className="text-[10px] xs:text-[11px] text-[#666666] border border-[#D5D5D5] px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 rounded-lg hover:bg-white transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2"
                aria-label="View all badges"
              >
                View all
              </Link>
            </div>

            <div className="p-3 xs:p-4 sm:p-5">
              <div className="mb-4 xs:mb-5">
                <span className="text-[9px] xs:text-[10px] font-bold text-[#666666] tracking-wider uppercase">METIS HYPERION HACKATHON</span>
                <div className="flex flex-col xs:flex-row xs:items-center justify-between mt-2 xs:mt-2.5 pb-3 xs:pb-4 border-b border-[#E5E5E5] gap-2 xs:gap-0">
                  <div className="bg-[#424242] rounded-lg px-3 xs:px-4 py-2 xs:py-2.5 flex items-center gap-2 xs:gap-3 shadow-sm">
                    <div className="relative w-6 h-6 xs:w-8 xs:h-8">
                      <Image 
                        src="/Logo/metis/metis-symbol-blue.svg" 
                        alt="Metis" 
                        fill 
                        className="object-contain" 
                      />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[9px] xs:text-[10px] text-white/60">Winning on</span>
                      <span className="text-[11px] xs:text-[12px] font-bold text-white">Metis Hackathon</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleBadgeClick('metis')}
                    className="bg-[#424242] text-white text-[10px] xs:text-[11px] px-4 xs:px-5 py-1.5 xs:py-2 rounded-lg font-medium hover:opacity-90 transition-opacity w-fit"
                  >
                    Details
                  </button>
                </div>
              </div>

            <div>
                  <span className="text-[9px] xs:text-[10px] font-bold text-[#666666] tracking-wider uppercase">AVALANCHE BUILD X402 AGENTS</span>
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between mt-2 xs:mt-2.5 pb-3 xs:pb-4 border-b border-[#E5E5E5] gap-2 xs:gap-0">
                    <div className="bg-[#424242] rounded-lg px-3 xs:px-4 py-2 xs:py-2.5 flex items-center gap-2 xs:gap-3 shadow-sm">
                      <div className="relative w-6 h-6 xs:w-8 xs:h-8">
                        <Image 
                          src="/Logo/avalanche/Avalanche Logomark/Avalanche Logomark/SVG/Avalanche_Logomark_Red.svg" 
                          alt="Avalanche" 
                          fill 
                          className="object-contain" 
                        />
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-[9px] xs:text-[10px] text-white/60">Winning on</span>
                        <span className="text-[11px] xs:text-[12px] font-bold text-white">Avalanche x402</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleBadgeClick('avalanche')}
                      className="bg-[#424242] text-white text-[10px] xs:text-[11px] px-4 xs:px-5 py-1.5 xs:py-2 rounded-lg font-medium hover:opacity-90 transition-opacity w-fit"
                    >
                      Details
                    </button>
                  </div>
                </div>

                  <div>
                    <span className="text-[9px] xs:text-[10px] font-bold text-[#666666] tracking-wider uppercase">MANTLE GLOBAL HACKATHON</span>
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between mt-2 xs:mt-2.5 gap-2 xs:gap-0">
                      <div className="bg-[#424242] rounded-lg px-3 xs:px-4 py-2 xs:py-2.5 flex items-center gap-2 xs:gap-3 shadow-sm">
                        <div className="relative w-6 h-6 xs:w-8 xs:h-8">
                          <Image 
                            src="/Logo/mantle/Mantle-Brand-Assets/Mantle Logo Mark/Mantle-Logo-mark.svg" 
                            alt="Mantle" 
                            fill 
                            className="object-contain" 
                          />
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="text-[9px] xs:text-[10px] text-yellow-400">In Progress</span>
                          <span className="text-[11px] xs:text-[12px] font-bold text-white">Mantle Hackathon</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleBadgeClick('mantle')}
                        className="bg-[#424242] text-white text-[10px] xs:text-[11px] px-4 xs:px-5 py-1.5 xs:py-2 rounded-lg font-medium hover:opacity-90 transition-opacity w-fit"
                      >
                        Details
                      </button>
                    </div>
                  </div>
            </div>
          </div>

          {/* Right Column: Featured Projects */}
          <div className="flex-1 p-3 xs:p-4 sm:p-5 relative">
            <CornerDot position="br" className="hidden xs:block" />
            <CornerDot position="bl" className="hidden lg:block" />
            
            <ScrollReveal direction="up" stagger={0.15} className="space-y-3 xs:space-y-4">
              <div className="relative group overflow-hidden rounded-xl bg-[#424242] h-[200px] xs:h-[240px] sm:h-[280px]">
                <div className="absolute inset-0 z-0">
                  <LiquidImage
                    src="/v2/showcase/Hyperkit Banner (README).png"
                    alt="HYPERKIT"
                    strength={0.4}
                    speed={0.6}
                    size={0.8}
                  />
                </div>
                <div className="absolute inset-0 z-10 p-3 xs:p-4 sm:p-5 flex items-end justify-end pointer-events-none">
                  <Link
                    href="/projects/hyperkit"
                    className="flex items-center gap-1.5 px-3 xs:px-4 py-1 xs:py-1.5 text-[10px] xs:text-[11px] font-medium text-white rounded-full bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-all pointer-events-auto focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                    aria-label="View Hyperkit project"
                  >
                    &lt; View
                  </Link>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-xl bg-[#424242] h-[200px] xs:h-[240px] sm:h-[280px]">
                <div className="absolute inset-0 z-0">
                  <LiquidImage
                    src="/v2/showcase/Banner V1 METAGEN WALLET.png"
                    alt="METAGEN WALLET"
                    strength={0.4}
                    speed={0.6}
                    size={0.8}
                  />
                </div>
                <div className="absolute inset-0 z-10 p-3 xs:p-4 sm:p-5 flex items-end justify-end pointer-events-none">
                  <Link
                    href="/projects/metagen-wallet"
                    className="flex items-center gap-1.5 px-3 xs:px-4 py-1 xs:py-1.5 text-[10px] xs:text-[11px] font-medium text-white rounded-full bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-all pointer-events-auto focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                    aria-label="View Metagen Wallet project"
                  >
                    &lt; View
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <div className="mt-4 xs:mt-5 flex justify-center">
              <Link
                href="/projects"
                className="px-4 xs:px-5 sm:px-6 py-1.5 xs:py-2 bg-[#424242] text-white text-[10px] xs:text-[11px] sm:text-[12px] font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2"
                aria-label="View more projects"
              >
                See more
              </Link>
            </div>
          </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBadge(null);
        }}
        title={selectedBadge ? badgeData[selectedBadge as keyof typeof badgeData]?.title : ''}
        size="md"
      >
        {selectedBadge && badgeData[selectedBadge as keyof typeof badgeData] && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#666666] mb-2">
                {badgeData[selectedBadge as keyof typeof badgeData].description}
              </p>
              <div className="flex items-center gap-4 text-sm text-[#666666]">
                <span>
                  <strong className="text-[#424242]">Event:</strong>{' '}
                  {badgeData[selectedBadge as keyof typeof badgeData].event}
                </span>
                <span>
                  <strong className="text-[#424242]">Date:</strong>{' '}
                  {badgeData[selectedBadge as keyof typeof badgeData].date}
                </span>
              </div>
            </div>
            {badgeData[selectedBadge as keyof typeof badgeData].link && (
              <div className="pt-4 border-t border-[#d5d5d5]">
                <a
                  href={badgeData[selectedBadge as keyof typeof badgeData].link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1342FF] hover:underline text-sm font-medium"
                >
                  Learn more →
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}

