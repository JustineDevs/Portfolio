import React from 'react';
import { Terminal, Cpu, Code2, Box, ArrowRight, Layers, FileCode, Database, Globe } from 'lucide-react';

const TechStack = () => {
  return (
    <section className="w-full bg-[#FAFAFA] border-b border-[#E5E5E5] py-20">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Tech Stack & Brand Assets (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
           
           {/* 1. TECH STACK CARD */}
           <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-[#111111] mb-8">Tech Stack</h3>
              
              <div className="grid grid-cols-4 gap-y-8 gap-x-4">
                 {/* Language */}
                 <div className="col-span-1 flex flex-col gap-4">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Language</span>
                    <div className="flex flex-col gap-3">
                       <TechItem icon={<FileCode size={18} />} />
                       <TechItem icon={<Database size={18} />} />
                       <TechItem icon={<Terminal size={18} />} />
                       <TechItem icon={<Box size={18} />} />
                    </div>
                 </div>

                 {/* Agents */}
                 <div className="col-span-1 flex flex-col gap-4">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Agents</span>
                    <div className="flex flex-col gap-3">
                       <TechItem icon={<Cpu size={18} />} />
                       <TechItem icon={<Layers size={18} />} />
                    </div>
                 </div>

                 {/* IDE */}
                 <div className="col-span-1 flex flex-col gap-4">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">IDE</span>
                    <div className="flex flex-col gap-3">
                       <TechItem icon={<Code2 size={18} />} />
                       <TechItem icon={<Terminal size={18} />} />
                    </div>
                 </div>

                 {/* In Progress (Dark Box) */}
                 <div className="col-span-1 bg-[#1a1a1a] rounded-lg p-3 -mt-3 -mr-3 min-h-[140px] flex flex-col justify-between">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">In Progress</span>
                    <div className="flex flex-col gap-3 mt-2">
                       <div className="flex items-center gap-2 text-white">
                          <Globe size={16} />
                          <span className="text-xs font-medium">n8n</span>
                       </div>
                       <div className="flex items-center gap-2 text-white">
                          <Box size={16} />
                          <span className="text-xs font-medium">Move</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* 2. BRAND ASSETS */}
           <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-[#111111] mb-6">Brand Assets</h3>
              <div className="grid grid-cols-2 gap-4">
                 {/* Black Variant */}
                 <div className="bg-[#FAFAFA] p-6 rounded-lg border border-gray-100 flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border border-black relative flex items-center justify-center">
                           <div className="absolute top-0 w-1 h-1 bg-[#FAFAFA] -translate-y-1/2" />
                           <div className="absolute bottom-0 w-1 h-1 bg-[#FAFAFA] translate-y-1/2" />
                        </div>
                        <span className="font-bold text-black text-sm tracking-tight uppercase">JSTN</span>
                    </div>
                 </div>
                 {/* White Variant */}
                 <div className="bg-[#111111] p-6 rounded-lg flex items-center justify-center cursor-pointer hover:bg-black transition-colors">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border border-white relative flex items-center justify-center">
                           <div className="absolute top-0 w-1 h-1 bg-[#111111] -translate-y-1/2" />
                           <div className="absolute bottom-0 w-1 h-1 bg-[#111111] translate-y-1/2" />
                        </div>
                        <span className="font-bold text-white text-sm tracking-tight uppercase">JSTN</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>

        {/* RIGHT COLUMN: Description (Span 7) */}
        <div className="lg:col-span-7 h-full">
            <div className="bg-white h-full p-10 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
               
               {/* Content */}
               <div className="relative z-10">
                   <h3 className="font-serif text-3xl font-medium text-[#111111] italic mb-8">Description</h3>
                   
                   <p className="font-sans text-sm leading-7 text-gray-500 max-w-2xl mb-6">
                     I build AI-augmented products, blockchain tools, and modern web applications. My work spans front-end
                     development, responsive web apps, authentication systems, developer tooling, crypto automation, and
                     decentralized systems.
                   </p>

                   <div className="pl-4 border-l-2 border-black mb-8">
                      <p className="font-sans text-sm font-medium text-black leading-6">
                        As <span className="font-bold">Co-Founder of HyperKit Labs</span>, I work on developer infrastructure and
                        AI-native tooling for the Web3 ecosystem, including projects connected to multi-chain smart contract workflows
                        and product experimentation.
                      </p>
                   </div>

                   <p className="font-sans text-xs leading-6 text-gray-400 max-w-xl">
                     I also bring community experience from Web3 moderation, where I&apos;ve supported onboarding, discussions, and
                     technical guidance across Discord communities since 2023. I&apos;m especially interested in product architecture,
                     systems thinking, and building tools that are practical, usable, and technically grounded.
                   </p>
               </div>

               {/* Button */}
               <div className="relative z-10 flex justify-end mt-12">
                  <button className="bg-[#111111] text-white px-6 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-black transition-colors">
                     Story
                     <ArrowRight size={14} />
                  </button>
               </div>

               {/* Background Decoration */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none" />
            </div>
        </div>

      </div>
    </section>
  );
};

// Helper Component for Tech Items (Icon only)
const TechItem = ({ icon }: { icon: React.ReactNode }) => (
  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 text-gray-600 hover:text-black hover:bg-gray-100 transition-all cursor-default border border-transparent hover:border-gray-200">
     {icon}
  </div>
);

export default TechStack;

