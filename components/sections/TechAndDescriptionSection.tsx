'use client';

import React from 'react';
import CornerDot from '@/components/ui/CornerDot';
import { ScrambleTextOnHover } from '@/components/ui/scramble-text';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import Link from 'next/link';
import { CursorIcon } from '@/components/ui/CursorIcon';
import {
  TypeScriptIcon, JavaScriptIcon, GrokIcon, SolidityIcon,
  HTML5Icon, PythonIcon, RustIcon, VisualStudioIcon,
  ReactIcon, CIcon, TailwindIcon, MoveIcon, PerplexityIcon, ClaudeIcon,
  OpenAIIcon, AnthropicIcon, VisualBasicIcon,
  UnrealIcon, SupabaseIcon, MongoIcon, GitIcon, DockerIcon, FirebaseIcon,
  ResendIcon, VercelIcon, NgrokIcon, N8nIcon, FramerIcon, FigmaIcon, NodeIcon, CloudflareIcon,
  LuaIcon, RobloxIcon,
} from '@/components/ui/TechIcons';

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

      <div className="relative border-l border-r border-b border-[#d5d5d5] flex flex-col lg:flex-row min-w-0">
        <CornerDot position="bl" className="hidden xs:block" />
        <CornerDot position="br" className="hidden xs:block" />

        <div className="lg:w-1/2 shrink-0 min-w-0 border-b lg:border-b-0 lg:border-r border-[#d5d5d5] p-3 xs:p-4 sm:p-5 md:p-6">
          <ScrollReveal
            direction="left"
            stagger={0.05}
            className="grid min-w-0 w-full grid-cols-2 gap-x-3 gap-y-5 xs:gap-x-4 xs:gap-y-6 sm:gap-x-6 sm:gap-y-8"
          >
            {/* Row 1, Col 1 — Language */}
            <div className="flex flex-col gap-2 xs:gap-3 min-w-0">
              <h3 className="text-[11px] xs:text-[12px] sm:text-[13px] font-semibold text-[#424242]">Language</h3>
              <ScrollReveal direction="fade" stagger={0.03} className="grid grid-cols-4 gap-2 xs:gap-3 w-fit max-w-full">
                <TypeScriptIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                <JavaScriptIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                <NodeIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                <ReactIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                <SolidityIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                <RustIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                <MoveIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <PythonIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <LuaIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <HTML5Icon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                <TailwindIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                <CIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                <VisualBasicIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
              </ScrollReveal>
            </div>

            {/* Row 1, Col 2 — Agents & IDE */}
            <div className="flex flex-col gap-2 xs:gap-3 min-w-0">
              <h3 className="text-[11px] xs:text-[12px] sm:text-[13px] font-semibold text-[#424242]">Agents & IDE</h3>
              <div className="flex flex-col gap-3 xs:gap-4 min-w-0">
                <ScrollReveal direction="fade" stagger={0.05} className="flex flex-wrap gap-2 xs:gap-3">
                  <GrokIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <PerplexityIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <ClaudeIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <OpenAIIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <AnthropicIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <RobloxIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                </ScrollReveal>
                <ScrollReveal direction="fade" stagger={0.05} className="flex flex-wrap gap-2 xs:gap-3">
                  <CursorIcon className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />
                  <VisualStudioIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  <UnrealIcon className="text-[#424242] w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition-opacity" />
                </ScrollReveal>
              </div>
            </div>

            {/* Row 2, Col 1 — Others */}
            <div className="flex flex-col gap-2 xs:gap-3 min-w-0">
              <h3 className="text-[11px] xs:text-[12px] sm:text-[13px] font-semibold text-[#424242]">Others</h3>
              <ScrollReveal direction="fade" stagger={0.03} className="grid grid-cols-3 gap-2 xs:gap-3 w-fit max-w-full">
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

            {/* Row 2, Col 2 — In progress */}
            <div className="bg-[#222222] rounded-xl p-3 xs:p-4 sm:p-5 min-w-0 max-w-full flex flex-col gap-4 xs:gap-5 sm:gap-6 h-fit self-start w-full">
              <h3 className="text-[11px] xs:text-[12px] sm:text-[13px] font-medium text-white/80">In progress</h3>

              <div className="flex flex-col gap-3 xs:gap-4">
                <div className="flex items-center gap-2 xs:gap-3 flex-wrap">
                  <div className="w-5 h-5 xs:w-6 xs:h-6 flex items-center justify-center shrink-0">
                    <N8nIcon className="text-white w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />
                  </div>
                  <span className="text-[12px] xs:text-[13px] sm:text-[14px] font-bold text-white tracking-wide">n8n</span>
                  <div className="flex gap-1.5 xs:gap-2 ml-0 xs:ml-1 shrink-0">
                    <FramerIcon className="text-white w-5 h-5 xs:w-6 xs:h-6" />
                    <FigmaIcon className="text-[#f8f8f8] w-5 h-5 xs:w-6 xs:h-6" />
                  </div>
                </div>

                <div className="flex items-center gap-2 xs:gap-3">
                  <div className="flex flex-col shrink-0">
                    <div className="flex gap-0.5">
                      <MoveIcon className="text-white w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-6" />
                    </div>
                    <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-medium text-white/80 leading-none mt-0.5">Move</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="flex-1 min-w-0 p-3 xs:p-4 sm:p-5 md:p-6 relative">
          <CornerDot position="bl" className="hidden lg:block" />
          <ScrollReveal direction="right" stagger={0.1} className="space-y-3 xs:space-y-4 sm:space-y-5 text-[12px] xs:text-[13px] sm:text-[14px] leading-[1.7] text-[#555555]">
            <p>
              I build AI-augmented products, blockchain tools, and modern web applications. My work spans front-end
              development, responsive web apps, authentication systems, developer tooling, crypto automation, and
              decentralized systems.
            </p>
            <p>
              As <span className="font-semibold text-[#1342FF]">Co-Founder of HyperKit Labs</span>, I work on developer
              infrastructure and AI-native tooling for the Web3 ecosystem, including projects connected to multi-chain smart
              contract workflows and product experimentation.
            </p>
            <p>
              I also bring community experience from{' '}
              <span className="font-semibold text-[#1342FF]">Web3 moderation</span>, where I&apos;ve supported onboarding,
              discussions, and technical guidance across Discord communities since 2023. I&apos;m especially interested in{' '}
              <span className="font-semibold text-[#1342FF]">product architecture, systems thinking</span>, and building tools
              that are practical, usable, and technically grounded.
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
