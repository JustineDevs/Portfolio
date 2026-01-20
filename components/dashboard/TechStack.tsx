import { 
  Terminal, Box, Cpu, Workflow, Zap, Command, Layers, Database 
} from 'lucide-react'

export default function TechStack() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <h3 className="text-xl font-medium text-[#111111]">Tech Stack</h3>
      <div className="grid grid-cols-5 gap-4 flex-1">
        
        {/* Language */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Language</span>
          <div className="flex flex-wrap gap-2">
             <div className="p-2 bg-gray-50 rounded-md border border-neutral-200"><Terminal size={20} /></div>
             <div className="p-2 bg-gray-50 rounded-md border border-neutral-200"><Box size={20} /></div>
             <div className="p-2 bg-gray-50 rounded-md border border-neutral-200"><Cpu size={20} /></div>
          </div>
        </div>

        {/* Agents */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Agents</span>
          <div className="flex flex-wrap gap-2">
             <div className="p-2 bg-gray-50 rounded-md border border-neutral-200"><Workflow size={20} /></div>
             <div className="p-2 bg-gray-50 rounded-md border border-neutral-200"><Zap size={20} /></div>
          </div>
        </div>

        {/* IDE */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">IDE</span>
          <div className="flex flex-wrap gap-2">
             <div className="p-2 bg-gray-50 rounded-md border border-neutral-200"><Command size={20} /></div>
          </div>
        </div>

        {/* Others */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Others</span>
          <div className="flex flex-wrap gap-2">
             <div className="p-2 bg-gray-50 rounded-md border border-neutral-200"><Database size={20} /></div>
          </div>
        </div>

        {/* In Progress (Inverted) */}
        <div className="bg-[#1A1A1A] border border-neutral-700 text-white rounded-xl p-3 flex flex-col justify-between min-h-[100px]">
          <span className="text-[10px] font-medium text-gray-400 uppercase">In progress</span>
          <div className="flex gap-2">
             <Layers size={20} />
             <Database size={20} />
          </div>
          <span className="text-xs font-mono mt-2 opacity-80">Move</span>
        </div>
      </div>
    </div>
  )
}

