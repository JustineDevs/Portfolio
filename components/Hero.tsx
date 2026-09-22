import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { GeistSans } from 'geist/font/sans';
import CornerDot from './ui/CornerDot';
import InteractiveDotGrid from './ui/InteractiveDotGrid';
import PixelGrid from './ui/pixel-grid';
import { SplitFlapText } from './ui/split-flap-text';
import { AnimatedNoise } from './ui/animated-noise';

const AvatarParticlesCanvas = dynamic(() => import('./three/AvatarParticlesCanvas'), {
  ssr: false,
  loading: () => (
    <div
      className="relative z-20 w-full h-full min-h-[250px] xs:min-h-[300px] sm:min-h-[350px] md:min-h-0 bg-[#424242]"
      aria-hidden
    />
  ),
});

const Hero = ({ projectOnePercentLogoUrl }: { projectOnePercentLogoUrl?: string | null }) => {
  return (
    <section className={`relative border-l border-r border-b border-t border-[#d5d5d5] bg-white rounded-t-lg ${GeistSans.className}`}>
      <CornerDot position="tl" className="hidden xs:block" />
      <CornerDot position="tr" className="hidden xs:block" />
      <CornerDot position="bl" className="hidden xs:block" />
      <CornerDot position="br" className="hidden xs:block" />

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] min-h-[400px] xs:min-h-[450px] sm:min-h-[500px] lg:min-h-[600px] min-w-0">
        
        <div className="relative w-full h-[250px] xs:h-[300px] sm:h-[350px] lg:h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-[#d5d5d5]">
          <CornerDot position="br" className="hidden lg:block" />
          
          <div className="absolute inset-0 z-0">
            <InteractiveDotGrid 
              backgroundColor="#2B3138"
              dotColor="#64748B"
              dotSize={2}
              dotSpacing={24}
              distortionRadius={100}
              distortionStrength={0.5}
            />
          </div>

          <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_42%_34%,rgba(127,212,255,0.34)_0%,rgba(127,212,255,0.14)_18%,rgba(19,66,255,0.12)_36%,rgba(43,49,56,0)_64%)]" />
          <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_48%_48%,rgba(248,251,255,0.18)_0%,rgba(248,251,255,0.07)_22%,rgba(43,49,56,0)_54%)]" />
          <div className="absolute inset-0 z-10 pointer-events-none opacity-60 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_18%,rgba(255,255,255,0)_82%,rgba(19,66,255,0.08)_100%)]" />
          <div className="absolute inset-0 z-10 pointer-events-none opacity-35 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_26px)]" />
          <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#2B3138_120%)]" />
          
          <div className="relative z-20 w-full h-full">
            <AvatarParticlesCanvas />
          </div>
        </div>

        <div className="relative w-full h-full flex flex-col bg-white overflow-hidden min-w-0">
          <PixelGrid />
          <AnimatedNoise opacity={0.03} />

          <div className="min-w-0 flex-1 flex flex-col justify-center relative z-10 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 py-6 xs:py-8 sm:py-10 md:py-12 lg:py-0">
            <h1 className="flex max-w-full flex-wrap items-center gap-x-1 text-[32px] xs:text-[36px] sm:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[86px] text-[#424242] mb-4 xs:mb-5 sm:mb-6 leading-[0.9] tracking-tighter font-black break-words">
              <span>I&apos;m </span>
              <span className="inline-flex items-center">
                <SplitFlapText 
                  text="JUSTINE" 
                  speed={80} 
                  skipEntrance={false}
                  className="max-w-full text-[32px] xs:text-[36px] sm:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[86px]"
                />
              </span>
            </h1>
            
            <p className="max-w-lg break-words text-[14px] xs:text-[15px] sm:text-[16px] lg:text-[18px] xl:text-[20px] text-[#444444] font-medium leading-[1.5] mb-6 xs:mb-8 sm:mb-10">
              a software developer specializing in blockchain and web technologies with a strong portfolio of projects.
            </p>
          </div>

          <div className="relative z-20 grid grid-cols-[minmax(120px,42%)_minmax(0,1fr)] border-t border-[#d5d5d5] bg-white/50 backdrop-blur-sm sm:grid-cols-[minmax(200px,42%)_minmax(0,1fr)]">
            <div className="flex min-w-0 items-center border-r border-[#d5d5d5] px-4 py-4 xs:px-6 xs:py-5 sm:px-8 sm:py-6">
              <span className={`text-lg xs:text-xl sm:text-2xl text-[#424242] tracking-tight ${GeistSans.className}`}>
                Associated
              </span>
            </div>

            <div className="flex min-w-0 items-center justify-center gap-2 overflow-x-auto px-4 py-4 xs:gap-3 xs:px-6 xs:py-5 sm:gap-4 sm:px-8 sm:py-6">
              <a
                href="https://projectonepercent.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block h-5 w-[clamp(72px,55%,140px)] shrink-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#424242] xs:h-6"
              >
                <Image
                  src={projectOnePercentLogoUrl || "/Logo/one percent/one percent.jpg"}
                  alt="Project One Percent"
                  fill
                  sizes="(max-width: 640px) 28vw, 140px"
                  loading="lazy"
                  unoptimized
                  className="object-contain grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                />
              </a>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
