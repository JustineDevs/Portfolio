import { Download } from 'lucide-react'

export default function BrandAssets() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <h3 className="text-lg font-medium text-[#111111]">Brand Assets</h3>
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* White Version */}
        <div className="border border-neutral-200 bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-gray-300 transition-colors relative">
          <span className="text-xs text-gray-400 absolute top-3 left-3">/Black</span>
          <div className="text-2xl font-bold tracking-tighter mt-4">JSTN</div>
          <Download size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {/* Black Version */}
        <div className="bg-[#111111] border border-neutral-200 rounded-xl p-4 flex flex-col items-center justify-center gap-3 group cursor-pointer relative">
          <span className="text-xs text-gray-500 absolute top-3 left-3">/White</span>
          <div className="text-2xl font-bold tracking-tighter text-white mt-4">JSTN</div>
          <Download size={16} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  )
}

