import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { GeistSans } from 'geist/font/sans';
import CornerDot from './ui/CornerDot';
import InteractiveDotGrid from './ui/InteractiveDotGrid';
import PixelGrid from './ui/pixel-grid';
import { SplitFlapText } from './ui/split-flap-text';
import { AnimatedNoise } from './ui/animated-noise';
import { ScrambleTextOnHover } from './ui/scramble-text';

const AvatarParticlesCanvas = dynamic(() => import('./three/AvatarParticlesCanvas'), {
  ssr: false,
  loading: () => (
    <div
      className="relative z-20 w-full h-full min-h-[250px] xs:min-h-[300px] sm:min-h-[350px] md:min-h-0 bg-[#424242]"
      aria-hidden
    />
  ),
});

const Hero = () => {
  return (
    <section className={`relative border-l border-r border-b border-t border-[#d5d5d5] bg-white rounded-t-lg ${GeistSans.className}`}>
      <CornerDot position="tl" className="hidden xs:block" />
      <CornerDot position="tr" className="hidden xs:block" />
      <CornerDot position="bl" className="hidden xs:block" />
      <CornerDot position="br" className="hidden xs:block" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr] min-h-[400px] xs:min-h-[450px] sm:min-h-[500px] md:min-h-[550px] lg:min-h-[600px] min-w-0">
        
        <div className="relative w-full h-[250px] xs:h-[300px] sm:h-[350px] md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-[#d5d5d5]">
          <CornerDot position="br" className="hidden md:block" />
          
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

          <div className="flex-1 flex flex-col justify-center relative z-10 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 py-6 xs:py-8 sm:py-10 md:py-12 lg:py-0">
            <h1 className="text-[32px] xs:text-[36px] sm:text-[48px] md:text-[56px] lg:text-[72px] xl:text-[86px] text-[#424242] mb-4 xs:mb-5 sm:mb-6 leading-[0.9] tracking-tighter font-black flex items-center flex-wrap">
              <span>I&apos;m </span>
              <span className="inline-flex items-center">
                <SplitFlapText 
                  text="JUSTINE" 
                  speed={80} 
                  skipEntrance={false}
                  className="text-[32px] xs:text-[36px] sm:text-[48px] md:text-[56px] lg:text-[72px] xl:text-[86px]"
                />
              </span>
            </h1>
            
            <p className="text-[14px] xs:text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-[#444444] font-medium leading-[1.5] max-w-lg mb-6 xs:mb-8 sm:mb-10">
              <ScrambleTextOnHover 
                text="a software developer specializing in blockchain and web technologies with a strong portfolio of projects." 
                as="span"
                duration={0.6}
              />
            </p>
          </div>

          <div className="relative z-20 border-t border-[#d5d5d5] flex flex-col sm:flex-row bg-white/50 backdrop-blur-sm">
            <div className="py-4 xs:py-5 sm:py-6 px-4 xs:px-6 sm:px-8 border-b sm:border-b-0 border-[#d5d5d5] flex items-center min-w-[140px] xs:min-w-[160px] sm:min-w-[200px]">
              <span className={`text-lg xs:text-xl sm:text-2xl text-[#424242] tracking-tight ${GeistSans.className}`}>
                Associated
              </span>
            </div>

            <div className="flex-1 flex items-center justify-between gap-2 xs:gap-3 sm:gap-4 px-4 xs:px-6 sm:px-8 py-4 xs:py-5 sm:py-6 overflow-x-auto">
              <a
                href="https://projectonepercent.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-4 xs:h-5 sm:h-6 flex-1 max-w-[100px] xs:max-w-[120px] sm:max-w-[140px] min-w-[60px] block shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#424242] rounded-sm"
              >
                <Image
                  src="/Logo/one percent/one percent.jpg"
                  alt="Project One Percent"
                  fill
                  sizes="(max-width: 640px) 28vw, 140px"
                  loading="lazy"
                  className="object-contain grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                />
              </a>

              <a
                href="https://avax.network/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-4 xs:h-5 sm:h-6 flex-1 max-w-[120px] xs:max-w-[140px] sm:max-w-[160px] min-w-[80px] block shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#424242] rounded-sm"
              >
                <Image
                  src="/Logo/avalanche/Avalanche Logos/Avalanche Logos/_PNG/AvalancheLogo_Horizontal_1C_Black.png"
                  alt="Avalanche"
                  fill
                  sizes="(max-width: 640px) 33vw, 160px"
                  loading="lazy"
                  className="object-contain grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                />
              </a>

              <a
                href="https://metis.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-4 xs:h-5 sm:h-6 flex-1 max-w-[90px] xs:max-w-[100px] sm:max-w-[120px] min-w-[50px] block shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#424242] rounded-sm"
              >
                <Image
                  src="/Logo/metis/metis-black-horizontal.png"
                  alt="Metis"
                  fill
                  sizes="(max-width: 640px) 25vw, 120px"
                  loading="lazy"
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
