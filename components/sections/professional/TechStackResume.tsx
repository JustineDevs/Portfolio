'use client'

import CornerDot from '@/components/ui/CornerDot'
import {
  TypeScriptIcon, JavaScriptIcon, ReactIcon, NextJsIcon, NodeIcon, PythonBrandIcon, SolidityIcon, RustIcon,
  TailwindIcon, DockerIcon, GitIcon, CloudflareIcon, OpenAIIcon, ClaudeIcon, GitHubIcon, GoIcon, BashIcon,
  SqlIcon, NpmIcon, PnpmIcon, BunIcon, NamecheapIcon,
} from '@/components/ui/TechIcons'

const items = [
  ['TypeScript', 'Product code', TypeScriptIcon], ['JavaScript', 'Web language', JavaScriptIcon], ['React', 'Interfaces', ReactIcon],
  ['Next.js', 'Full-stack web', NextJsIcon], ['Node.js', 'JavaScript runtime', NodeIcon],
  ['Python', 'Automation', PythonBrandIcon], ['Solidity', 'Smart contracts', SolidityIcon], ['Rust', 'Systems', RustIcon],
  ['Tailwind', 'UI systems', TailwindIcon], ['Docker', 'Delivery', DockerIcon], ['Git', 'Collaboration', GitIcon],
  ['GitHub', 'Code hosting', GitHubIcon], ['Go', 'Backend services', GoIcon], ['Bash', 'Shell scripting', BashIcon],
  ['SQL', 'Data querying', SqlIcon], ['npm', 'Package manager', NpmIcon], ['pnpm', 'Package manager', PnpmIcon],
  ['Bun', 'JavaScript runtime', BunIcon], ['Cloudflare', 'Edge runtime', CloudflareIcon],
  ['Namecheap', 'Domain services', NamecheapIcon], ['OpenAI', 'AI products', OpenAIIcon], ['Claude', 'Agent workflows', ClaudeIcon],
] as const

export default function TechStackResume() {
  return <section className="relative h-full bg-white"><CornerDot position="bl" /><CornerDot position="br" /><div className="p-6 sm:p-8 lg:p-10"><div className="flex items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.22em] text-[#777]">Working toolkit</p><h2 className="mt-2 text-2xl font-bold text-[#424242]">Tech stack</h2></div><p className="max-w-xs text-right text-xs leading-[1.6] text-[#777]">A compact view of the tools I reach for most often.</p></div><div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3">{items.map(([name, summary, Icon]) => <div key={name} className="group flex min-w-0 items-center gap-2 rounded-xl p-2 transition hover:bg-[#fafafa]"><Icon className="h-8 w-8 shrink-0 text-[#424242] transition group-hover:scale-110" aria-hidden="true" /><div className="min-w-0"><div className="text-[11px] font-semibold text-[#424242]">{name}</div><div className="mt-1 text-[9px] uppercase tracking-[0.1em] text-[#888]">{summary}</div></div></div>)}</div></div></section>
}
