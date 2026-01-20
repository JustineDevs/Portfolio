export default function Description() {
  return (
    <div className="flex flex-col justify-between gap-8 h-full relative overflow-hidden">
      {/* Decorative ASCII corner */}
      <div className="absolute top-4 right-4 text-[10px] text-gray-200 font-mono select-none">
        {`/* README.md */`}
      </div>

      <div>
        <h3 className="text-xl font-medium text-[#111111] mb-6">Description</h3>
        <div className="space-y-6 text-[#666666] font-sans leading-relaxed text-[13px]">
          <p>
            My experience also covers front-end projects, responsive web apps, user authentication systems, 
            advanced crypto trading automation, and decentralized governance tools.
          </p>
          <p>
            <span className="font-semibold text-[#111111]">Co-Founder HyperKit Labs at Hyperion</span> - Building innovative developer infrastructure tools and contributing to the Mantle Layer 2 ecosystem.
          </p>
          <p>
            Since 2022, I have been an active Web3 community moderator and professional moderator, evolving from volunteer roles to paid projects. <span className="font-semibold text-[#111111]">Strong problem solver and communicator</span>, aiming to expand client-facing and IT infrastructure skills.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 mt-4">
        <span className="text-[10px] text-[#999999]">If you want read more.</span>
        
        <button className="bg-[#333333] text-white px-6 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider hover:bg-black transition-colors">
          Story
        </button>
      </div>
    </div>
  )
}

