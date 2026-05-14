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
            I build AI-augmented products, blockchain tools, and modern web applications. My work spans front-end
            development, responsive web apps, authentication systems, developer tooling, crypto automation, and
            decentralized systems.
          </p>
          <p>
            As <span className="font-semibold text-[#111111]">Co-Founder of HyperKit Labs</span>, I work on developer
            infrastructure and AI-native tooling for the Web3 ecosystem, including projects connected to multi-chain smart
            contract workflows and product experimentation.
          </p>
          <p>
            I also bring community experience from <span className="font-semibold text-[#111111]">Web3 moderation</span>,
            where I&apos;ve supported onboarding, discussions, and technical guidance across Discord communities since 2023.
            I&apos;m especially interested in product architecture, systems thinking, and building tools that are practical,
            usable, and technically grounded.
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

