'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CornerDot from '@/components/ui/CornerDot'
import { ScrambleTextOnHover } from '@/components/ui/scramble-text'
import { StackedLogos } from '@/components/ui/stacked-logos'
import { CursorIcon } from '@/components/ui/TechIcons'
import BrandIcon from '@/components/ui/BrandIcon'
import {
  TypeScriptIcon, JavaScriptIcon, NextJsIcon, ReactIcon, SolidityIcon, RustIcon, PythonBrandIcon, HTML5Icon,
  TailwindIcon, GrokIcon, ClaudeIcon, OpenAIIcon, PerplexityIcon, VercelIcon, DockerIcon, GitIcon,
  SupabaseIcon, MoveIcon, LuaIcon, RobloxIcon, VpsIcon,
} from '@/components/ui/TechIcons'

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

const AlibabaCloudIcon: IconComponent = (props) => <BrandIcon slug="alibabacloud" alt="Alibaba Cloud logo" color="424242" className={props.className ?? 'h-7 w-7'} />
const GoogleCloudIcon: IconComponent = (props) => <BrandIcon slug="googlecloud" alt="Google Cloud logo" color="424242" className={props.className ?? 'h-7 w-7'} />
const PostgreSQLIcon: IconComponent = (props) => <BrandIcon slug="postgresql" alt="PostgreSQL logo" color="424242" className={props.className ?? 'h-7 w-7'} />

const groups: { title: string; items: { name: string; summary: string; icon: IconComponent }[] }[] = [
  { title: 'Language & Frameworks', items: [
    { name: 'TypeScript', summary: 'Typed JavaScript for reliable product code.', icon: TypeScriptIcon },
    { name: 'JavaScript', summary: 'The runtime language behind the interactive web.', icon: JavaScriptIcon },
    { name: 'React', summary: 'Component architecture for expressive interfaces.', icon: ReactIcon },
    { name: 'Next.js', summary: 'Full-stack React framework used for this portfolio.', icon: NextJsIcon },
    { name: 'Python', summary: 'Automation, agents, and data-oriented tooling.', icon: PythonBrandIcon },
    { name: 'Lua', summary: 'Scripting for lightweight interactive systems.', icon: LuaIcon },
    { name: 'Rust', summary: 'Systems language for performance-critical tooling.', icon: RustIcon },
    { name: 'Tailwind CSS', summary: 'Utility-first styling for fast, consistent UI work.', icon: TailwindIcon },
    { name: 'HTML5', summary: 'Semantic structure for accessible web experiences.', icon: HTML5Icon },
    { name: 'PostgreSQL', summary: 'Relational data infrastructure for products and services.', icon: PostgreSQLIcon },
  ] },
  { title: 'Tools & Agents', items: [
    { name: 'OpenAI', summary: 'Models and APIs for AI-assisted product features.', icon: OpenAIIcon },
    { name: 'Cursor', summary: 'AI-powered IDE for focused product development.', icon: CursorIcon },
    { name: 'Claude', summary: 'A daily partner for research and implementation.', icon: ClaudeIcon },
    { name: 'Grok', summary: 'Fast exploratory model for product iteration.', icon: GrokIcon },
    { name: 'Perplexity', summary: 'Search and research workflows with cited answers.', icon: PerplexityIcon },
    { name: 'Roblox Studio', summary: 'Roblox Studio for creative tooling and interactive world building.', icon: RobloxIcon },
  ] },
  { title: 'Infrastructure', items: [
    { name: 'Vercel', summary: 'Deployment and edge delivery for web products.', icon: VercelIcon },
    { name: 'Docker', summary: 'Reproducible development and deployment environments.', icon: DockerIcon },
    { name: 'Git', summary: 'Version control and collaborative delivery.', icon: GitIcon },
    { name: 'Supabase', summary: 'Postgres-backed application services, auth, and storage.', icon: SupabaseIcon },
    { name: 'Google Cloud', summary: 'Cloud infrastructure and managed services for production systems.', icon: GoogleCloudIcon },
    { name: 'VPS', summary: 'Flexible virtual servers for self-managed deployments.', icon: VpsIcon },
    { name: 'Alibaba Cloud', summary: 'Cloud infrastructure and ECS services for scalable workloads.', icon: AlibabaCloudIcon },
  ] },
  { title: 'Blockchain & Web3', items: [
    { name: 'Move', summary: 'Resource-oriented smart contract development.', icon: MoveIcon },
    { name: 'Solidity', summary: 'Smart contract language for EVM networks.', icon: SolidityIcon },
  ] },
]

function TechItem({ name, summary, icon: Icon, index }: { name: string; summary: string; icon: IconComponent; index: number }) {
  const mobileStart = index % 3 === 0
  const mobileEnd = index % 3 === 2
  const desktopStart = index % 4 === 0
  const desktopEnd = index % 4 === 3
  const tooltipPosition = [
    mobileStart ? 'left-0 translate-x-0' : mobileEnd ? 'left-auto right-0 translate-x-0' : 'left-1/2 -translate-x-1/2',
    desktopStart ? 'sm:left-0 sm:right-auto sm:translate-x-0' : desktopEnd ? 'sm:left-auto sm:right-0 sm:translate-x-0' : 'sm:left-1/2 sm:right-auto sm:-translate-x-1/2',
  ].join(' ')

  return <div className="group relative flex min-w-0 flex-col items-center gap-2 rounded-xl p-2 text-center transition hover:bg-[#fafafa] focus-visible:ring-2 focus-visible:ring-[#1342FF]" tabIndex={0}>
    <Icon className="h-8 w-8 text-[#424242] opacity-75 transition group-hover:scale-110 group-hover:opacity-100" aria-hidden="true" />
    <span className="text-[10px] font-medium leading-tight text-[#555555]">{name}</span>
    <span className={`pointer-events-none absolute top-full z-50 mt-2 w-44 rounded-lg bg-[#222] px-3 py-2 text-left text-[10px] leading-[1.45] text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100 ${tooltipPosition}`}>{summary}</span>
  </div>
}

export default function TechAndDescriptionSection({ content, platformAssets = [] }: { content?: { title: string; paragraphs: string[]; linkLabel: string; link: string }; platformAssets?: Array<{ url: string; altText: string } | null> }) {
  const copy = content?.paragraphs?.length ? content.paragraphs : [
    'I build practical systems at the intersection of product design, AI, blockchain, and the web. The through-line is simple: make complex technology useful, legible, and ready to ship.',
    'As co-founder of HyperKit Labs, I work on developer infrastructure and AI-native tooling for multi-chain workflows, while continuing to build focused tools and interfaces for real people.',
  ]
  return <section className="w-full">
    <div className="relative flex flex-col border-l border-r border-b border-[#d5d5d5] lg:flex-row">
      <div className="h-[56px] shrink-0 border-b border-[#d5d5d5] px-4 flex items-center lg:w-1/2 lg:border-b-0 lg:border-r"><h2 className="text-[18px] font-bold text-[#424242]"><ScrambleTextOnHover text="Language & Frameworks" as="span" /></h2></div>
      <div className="h-[56px] flex items-center px-4"><h2 className="text-[18px] font-bold text-[#424242]"><ScrambleTextOnHover text="How I work" as="span" /></h2></div>
    </div>
    <div className="relative flex flex-col border-l border-r border-b border-[#d5d5d5] lg:flex-row">
      <CornerDot position="bl" className="hidden xs:block" /><CornerDot position="br" className="hidden xs:block" />
      <div className="relative isolate grid gap-6 border-b border-[#d5d5d5] p-4 sm:p-6 lg:w-1/2 lg:grid-cols-2 lg:border-b-0 lg:border-r">
        {groups.map((group) => <div key={group.title}><h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#666]">{group.title}</h3><div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{group.items.map((item, index) => <TechItem key={item.name} {...item} index={index} />)}</div></div>)}
      </div>
      <div className="w-full self-start p-4 sm:p-5 lg:w-1/2 lg:p-6">
        <p className="max-w-2xl text-[14px] leading-[1.8] text-[#555]">{copy[0]}</p>
        {copy[1] ? <p className="mt-4 max-w-2xl text-[14px] leading-[1.8] text-[#555]">{copy[1]}</p> : null}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#e5e5e5] pt-4"><span className="text-xs text-[#666666]">{content?.title || 'Want the longer version?'}</span><Link href={content?.link || "/about"} className="rounded-lg bg-[#424242] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#222]">{content?.linkLabel || "Read the story"}</Link></div>
        <div className="mt-8 border-t border-[#d5d5d5] pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">Platforms</p>
              <p className="mt-2 max-w-md text-[13px] leading-[1.6] text-[#555555]">Platforms and cloud services I use to build, ship, and operate products.</p>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <StackedLogos logoGroups={[[0, 1, 2], [3, 4, 5], [6, 7]].map((group) => group.map((index) => { const asset = platformAssets[index]; return <Image key={asset?.url || index} src={asset?.url || `/api/assets/brand.platform-${index + 1}`} alt={asset?.altText || "Platform development logo"} width={120} height={32} unoptimized /> }))} duration={8} className="mx-auto max-w-full" logoWidth="min(26vw, 150px)" />
          </div>
        </div>
      </div>
    </div>
  </section>
}
