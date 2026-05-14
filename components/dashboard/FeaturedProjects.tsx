import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export default function FeaturedProjects() {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-medium text-[#111111]">Featured Projects</h3>
      
      {/* HyperKit Card */}
      <div className="group relative h-[280px] w-full rounded-2xl overflow-hidden cursor-pointer bg-black border border-neutral-200">
        {/* Image: Grayscale by default, Color on Hover */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
          <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105 bg-gradient-to-br from-gray-800 to-black" />
        </div>
        
        <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
          <h4 className="text-white text-5xl font-black tracking-tight uppercase">HYPERKIT</h4>
          <div className="flex justify-between items-end">
             <span className="text-gray-300 text-xs border border-white/20 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md">The Modular infrastructure toolkit</span>
             <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest group-hover:text-white transition-colors">
               for multi-chain dev <span className="text-white ml-2">&lt; View</span>
             </div>
          </div>
        </div>
      </div>

      {/* Metagen Wallet Card */}
      <div className="group relative h-[280px] w-full rounded-2xl overflow-hidden cursor-pointer bg-black border border-neutral-200">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
          <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105 bg-gradient-to-br from-gray-800 to-black" />
        </div>
        
        <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
          <div className="flex justify-center items-center h-full">
             <h4 className="text-white text-4xl font-bold tracking-tight text-center leading-none">METAGEN<br/>WALLET</h4>
          </div>
          <div className="flex justify-end items-end w-full">
             <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest group-hover:text-white transition-colors">
               &lt; View
             </div>
          </div>
        </div>
      </div>

       {/* "See More" Button */}
      <div className="flex justify-center mt-2">
        <button className="bg-[#111111] text-white text-[10px] uppercase font-bold tracking-wider px-6 py-3 rounded-full hover:bg-black transition-colors border border-neutral-200">See more</button>
      </div>
    </div>
  )
}

