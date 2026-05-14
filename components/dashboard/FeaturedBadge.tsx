export default function FeaturedBadge() {
  return (
    <div className="flex flex-col gap-6 h-full justify-between">
      <div className="flex justify-between items-start">
        <p className="text-xs text-gray-500 max-w-[150px]">This badge show are featured on hackathon.</p>
        <button className="text-[10px] font-medium border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors">view all</button>
      </div>
      <div className="flex flex-col gap-4">
        {/* Item 1 */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Metis Hyperion Hackathon</span>
          <div className="flex items-center justify-between border border-gray-100 p-2 rounded-lg bg-gray-50/50">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-500 text-xs">M</div>
               <div className="flex flex-col"><span className="text-xs font-bold text-[#111111]">Winning on</span><span className="text-xs text-gray-600">Metis Hackathon</span></div>
             </div>
             <button className="bg-[#333333] text-white text-[10px] px-3 py-1.5 rounded-md">Details</button>
          </div>
        </div>
      </div>
    </div>
  )
}

