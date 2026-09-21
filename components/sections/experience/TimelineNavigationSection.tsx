"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { N8nIcon, FramerIcon, FigmaIcon, RustIcon, MoveIcon, VisualBasicIcon, CIcon, JavaIcon, MySQLIcon, UnrealIcon, HTML5Icon, TailwindIcon, SolidityIcon, PythonBrandIcon, TypeScriptIcon, ReactIcon, NodeIcon, SupabaseIcon } from "@/components/ui/TechIcons"

const entries = [
  { id: "hyperkit", year: "2026", company: "HyperKit Labs", status: "CURRENT", role: "Co-Founder / Product Engineer", description: "Building developer infrastructure and AI-native workflows for multi-chain products, with a focus on making complex systems feel clear and useful.", project: "HyperKit", projectDescription: "Developer infrastructure and AI-native tooling for the Web3 ecosystem.", icons: [{ name: "n8n", icon: N8nIcon }, { name: "Framer", icon: FramerIcon }, { name: "Figma", icon: FigmaIcon }, { name: "Rust", icon: RustIcon }, { name: "Move", icon: MoveIcon }] },
  { id: "hyperagent", year: "2025", company: "HyperAgent", status: "SHIPPED", role: "Product Engineer", description: "Shipped an AI-powered smart contract platform from natural language to production-ready, audited contracts, and turned the work into public proof through hackathon wins.", project: "HyperAgent", projectDescription: "AI-powered smart contract generation, auditing, and deployment workflows.", icons: [{ name: "Solidity", icon: SolidityIcon }, { name: "Python", icon: PythonBrandIcon }, { name: "TypeScript", icon: TypeScriptIcon }, { name: "React", icon: ReactIcon }, { name: "Node.js", icon: NodeIcon }, { name: "Supabase", icon: SupabaseIcon }] },
  { id: "fullstack", year: "2025", company: "Independent practice", status: "PIVOT", role: "Backend → Fullstack Developer", description: "Moved beyond isolated services to understand the complete experience: interface, interaction, desktop delivery, and the system underneath.", project: "Go-Mirofish", projectDescription: "A local-first swarm intelligence workflow for predicting and exploring complex systems.", icons: [{ name: "Unreal Engine", icon: UnrealIcon }, { name: "HTML5", icon: HTML5Icon }, { name: "Tailwind CSS", icon: TailwindIcon }] },
  { id: "foundation", year: "2024", company: "Independent practice", status: "FOUNDATION", role: "Software Developer", description: "Started with fundamentals, databases, and the discipline of learning by building things that had to work.", project: "First systems", projectDescription: "The first database connections, interfaces, and software experiments that shaped the practice.", icons: [{ name: "C", icon: CIcon }, { name: "MySQL", icon: MySQLIcon }, { name: "Java", icon: JavaIcon }, { name: "Visual Basic", icon: VisualBasicIcon }] },
]

export default function TimelineNavigationSection() {
  const [openEntry, setOpenEntry] = useState(0)

  return (
    <section id="career-arc" className="border-x border-b border-[#d5d5d5] bg-[#f8f8f8]">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-12 sm:px-10 lg:px-16">
        <div className="mb-8 pl-10 sm:pl-16"><span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#1342FF]">Progress</span></div>
        <ol className="ml-4 sm:ml-10">
          {entries.map((entry, index) => {
            const isOpen = openEntry === index
            const FirstIcon = entry.icons[0].icon
            return (
              <li key={entry.id} className="grid grid-cols-[4.5rem_1.25rem_minmax(0,1fr)] gap-4 pb-8 last:pb-0 sm:grid-cols-[4.5rem_1.5rem_minmax(0,1fr)] sm:gap-4">
                <div className="pt-0.5 text-right font-mono text-[14px] tracking-[0.12em] text-[#777b82] sm:text-[15px]">{entry.year}</div>
                <div className="relative flex justify-center">
                  <span className={`relative z-10 mt-1 size-3 shrink-0 rounded-full border-2 border-[#f8f8f8] ring-1 ${isOpen ? "bg-[#1342FF] ring-[#1342FF]" : "bg-[#b9c0cc] ring-[#b9c0cc]"}`} aria-hidden="true" />
                  {index < entries.length - 1 ? <span className="absolute left-1/2 top-4 bottom-[-2rem] w-px -translate-x-1/2 border-l border-dashed border-[#c9cdd4]" aria-hidden="true" /> : null}
                </div>
                <div className="relative min-w-0 before:absolute before:-left-4 before:top-[0.8rem] before:h-px before:w-4 before:bg-[#c9cdd4]">
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpenEntry(isOpen ? -1 : index)} className="flex w-full items-start justify-between gap-4 text-left"><span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1"><span className="text-[18px] font-medium tracking-[-0.025em] text-[#424242] sm:text-[20px]">{entry.company}</span><span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#1342FF]">{entry.status}</span></span><ChevronDown aria-hidden="true" className={`mt-0.5 size-5 shrink-0 text-[#777b82] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} /></button>
                  {isOpen ? <div className="pt-3"><p className="text-[16px] text-[#424242]">{entry.role}</p><p className="mt-2 max-w-3xl text-[15px] leading-[1.65] text-[#777b82]">{entry.description}</p><div className="mt-5 ml-1 flex items-center gap-3 border-l border-[#d5d5d5] pl-4"><span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d5d5d5] bg-white"><FirstIcon className="h-5 w-5 text-[#424242]" /></span><div><p className="text-[13px] font-medium text-[#424242]">{entry.project}</p><p className="text-[11px] leading-[1.5] text-[#777b82]">{entry.projectDescription}</p></div></div><div className="mt-4 flex flex-wrap gap-3">{entry.icons.map(({ name, icon: Icon }) => <span key={name} className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#8a8d92]"><Icon className="size-3" />{name}</span>)}</div></div> : null}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
