'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import CornerDot from '@/components/ui/CornerDot';
import { ScrambleTextOnHover } from '@/components/ui/scramble-text';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import Link from 'next/link';
import {
  TypeScriptIcon, JavaScriptIcon, GrokIcon, SolidityIcon,
  HTML5Icon, PythonIcon, RustIcon, VisualStudioIcon,
  ReactIcon, CIcon, TailwindIcon, MoveIcon, PerplexityIcon, ClaudeIcon,
  OpenAIIcon, AnthropicIcon, VisualBasicIcon,
  UnrealIcon, SupabaseIcon, MongoIcon, GitIcon, DockerIcon, FirebaseIcon,
  ResendIcon, VercelIcon, NgrokIcon, N8nIcon, FramerIcon, FigmaIcon, NodeIcon, CloudflareIcon, MoveIcon2
} from '@/components/ui/TechIcons';

const CursorIcon = dynamic(() => import('@/components/ui/CursorIcon').then(mod => ({ default: mod.CursorIcon })), {
  ssr: false,
  loading: () => <div className="w-6 h-6 xs:w-8 xs:h-8" />
});

export default function TechAndDescriptionSection() {
  return (
    <section className="w-full">
      <div className="relative border-l border-r border-b border-[#d5d5d5] flex flex-col lg:flex-row">
        <div className="lg:w-1/2 shrink-0 border-b lg:border-b-0 lg:border-r border-[#d5d5d5] h-[48px] xs:h-[52px] sm:h-[56px] flex items-center px-4 xs:px-5 sm:px-6">
          <h2 className="text-[16px] xs:text-[18px] sm:text-[20px] font-bold text-[#424242] tracking-[-0.01em]">
            <ScrambleTextOnHover text="Tech Stack" as="span" />
          </h2>
        </div>
        <div className="flex-1 h-[48px] xs:h-[52px] sm:h-[56px] flex items-center px-4 xs:px-5 sm:px-6">
          <h2 className="text-[16px] xs:text-[18px] sm:text-[20px] font-bold text-[#424242] tracking-[-0.01em]">
            <ScrambleTextOnHover text="Description" as="span" />
          </h2>
        </div>
      </div>

      <div className="relative border-l border-r border-b border-[#d5d5d5] flex flex-col lg:flex-row">
        <CornerDot position="bl" className="hidden xs:block" />
        <CornerDot position="br" className="hidden xs:block" />

        <div className="lg:w-1/2 shrink-0 border-b lg:border-b-0 lg:border-r border-[#d5d5d5] p-3 xs:p-4 sm:p-5 md:p-6">
          <div className="flex flex-col xl:flex-row gap-4 xs:gap-6 sm:gap-8">
            <ScrollReveal direction="left" stagger={0.05} className="flex gap-4 xs:gap-6 sm:gap-x-8 gap-y-6 sm:gap-y-8 flex-wrap xl:flex-nowrap">
              <div className="flex flex-col gap-2 xs:gap-3 min-w-[90px] xs:min-w-[100px] sm:min-w-[120px]">
                <h3 className="text-[11px] xs:text-[12px] sm:text-[13px] font-semibold text-[#424242]">Language</h3>
                <ScrollReveal direction="fade" stagger={0.03} className="grid grid-cols-4 gap-2 xs:gap-3 w-fit">
                  <TypeScriptIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <JavaScriptIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <NodeIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <ReactIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <SolidityIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <RustIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <MoveIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <PythonIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <HTML5Icon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <TailwindIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <CIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <VisualBasicIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                </ScrollReveal>
              </div>

              <div className="flex flex-col gap-2 xs:gap-3">
                <h3 className="text-[11px] xs:text-[12px] sm:text-[13px] font-semibold text-[#424242]">Agents</h3>
                <ScrollReveal direction="fade" stagger={0.05} className="flex flex-col gap-2 xs:gap-3">
                  <GrokIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <PerplexityIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <ClaudeIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <OpenAIIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <AnthropicIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                </ScrollReveal>
              </div>

              <div className="flex flex-col gap-2 xs:gap-3">
                <h3 className="text-[11px] xs:text-[12px] sm:text-[13px] font-semibold text-[#424242]">IDE</h3>
                <ScrollReveal direction="fade" stagger={0.05} className="flex flex-col gap-2 xs:gap-3">
                  <CursorIcon className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />
                  <VisualStudioIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <UnrealIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                </ScrollReveal>
              </div>

              <div className="flex flex-col gap-2 xs:gap-3">
                <h3 className="text-[11px] xs:text-[12px] sm:text-[13px] font-semibold text-[#424242]">Others</h3>
                <ScrollReveal direction="fade" stagger={0.03} className="grid grid-cols-3 gap-2 xs:gap-3 w-fit">
                  <VercelIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <MongoIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <SupabaseIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <DockerIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <GitIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <ResendIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <FirebaseIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <NgrokIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <CloudflareIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                </ScrollReveal>
              </div>
            </ScrollReveal>

            <div className="bg-[#222222] rounded-xl p-3 xs:p-4 sm:p-5 min-w-[140px] xs:min-w-[150px] sm:min-w-[160px] flex flex-col gap-4 xs:gap-5 sm:gap-6 shrink-0 h-fit xl:ml-auto">
              <h3 className="text-[11px] xs:text-[12px] sm:text-[13px] font-medium text-white/80">In progress</h3>
              
              <div className="flex flex-col gap-3 xs:gap-4">
                <div className="flex items-center gap-2 xs:gap-3">
                  <div className="w-5 h-5 xs:w-6 xs:h-6 flex items-center justify-center">
                     <N8nIcon className="text-white w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />
                  </div>
                  <span className="text-[12px] xs:text-[13px] sm:text-[14px] font-bold text-white tracking-wide">n8n</span>
                  <div className="flex gap-1.5 xs:gap-2 ml-1 xs:ml-2">
                    <FramerIcon className="text-white w-5 h-5 xs:w-6 xs:h-6" />
                      <FigmaIcon className="text-[#f8f8f8] w-5 h-5 xs:w-6 xs:h-6" />
                  </div>
                </div>

                <div className="flex items-center gap-2 xs:gap-3">
                  <div className="flex flex-col">
                    <div className="flex gap-0.5">
                      <MoveIcon className="text-white w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-6" />
                    </div>
                    <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-medium text-white/80 leading-none mt-0.5">Move</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-3 xs:p-4 sm:p-5 md:p-6 relative">
          <CornerDot position="bl" className="hidden lg:block" />
          <ScrollReveal direction="right" stagger={0.1} className="space-y-3 xs:space-y-4 sm:space-y-5 text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.7] text-[#555555]">
            <p>
              My experience also covers front-end projects, responsive web apps, user authentication systems, advanced crypto trading automation, and decentralized governance tools.
            </p>
            <p>
              <span className="font-semibold text-[#1342FF]">Co-Founder Hyperkit Labs at Hyperion</span> - Building innovative developer infrastructure tools and contributing to the Metis Layer 2 ecosystem.
            </p>
            <p>
              Since 2022, I have been an active <span className="font-semibold text-[#1342FF]">Web3 community moderator</span> and professional moderator, evolving from volunteer roles to paid projects. <span className="font-semibold text-[#1342FF]">Strong problem solver and communicator</span>, aiming to expand client-facing and IT infrastructure skills.
            </p>
          </ScrollReveal>

            <div className="mt-5 xs:mt-6 sm:mt-8 flex items-center justify-end gap-2 xs:gap-3 sm:gap-4">
              <span className="text-[10px] xs:text-[11px] sm:text-[12px] text-[#666666]">If you want read more.</span>
              <Link href="/about">
                <button className="bg-[#424242] text-white px-3 py-2 xs:px-4 xs:py-2.5 sm:px-6 sm:py-3 min-h-[36px] xs:min-h-[40px] sm:min-h-[44px] rounded-lg text-[10px] xs:text-[11px] sm:text-[12px] font-medium hover:opacity-90 transition-opacity">
                  Story
                </button>
              </Link>
            </div>
        </div>
      </div>
    </section>
  );
}
