import HyperKitTeamCard from "@/components/sections/experience/HyperKitTeamCard";
import ExperienceProofCards from "@/components/sections/experience/ExperienceProofCards";
import Image from "next/image";
import type { ExperiencePageData } from "@/lib/content/page-data";

function BrandSocialProof() {
  return (
    <div aria-label="Brand social proof" className="mt-9 grid items-center gap-5 sm:grid-cols-[minmax(9rem,0.7fr)_minmax(0,1.3fr)] sm:gap-8">
      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#858585]">Built with teams at</p>
      <div className="grid grid-cols-2 items-center gap-x-10 gap-y-6">
        <div className="flex h-9 items-center">
          <Image src="/assets/associates/hyperkit.svg" alt="HyperKit" width={120} height={36} className="h-8 w-auto max-w-full object-contain object-left opacity-70" />
        </div>
        <div className="flex h-9 items-center">
          <Image src="/Logo/one percent/one percent.jpg" alt="Project One Percent" width={160} height={36} className="h-8 w-auto max-w-full object-contain object-left opacity-70" />
        </div>
        <div className="flex h-9 items-center">
          <Image src="/UVS/UVS_logo_landscape.png" alt="UVS" width={110} height={48} className="h-9 w-auto max-w-full object-contain object-left opacity-70" />
        </div>
        <div className="flex h-9 items-center">
          <Image src="/JSTN Logo/SVG/Brand name - B.svg" alt="JSTN" width={96} height={36} className="h-8 w-auto max-w-full object-contain object-left opacity-65" />
        </div>
      </div>
    </div>
  );
}

export default function ExperienceOverviewSection({ payload }: { payload: ExperiencePageData["proofOfWork"] }) {
  return (
    <section className="border-x border-b border-[#d5d5d5] bg-[#f8f8f8]">
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-10 lg:px-16 lg:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(250px,0.78fr)_minmax(0,1.5fr)] lg:gap-16">
          <div className="flex justify-center lg:justify-start">
            <HyperKitTeamCard />
          </div>
          <div className="flex flex-col justify-start pt-2 text-center lg:pt-8 lg:text-left">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#1342FF]">Experience / profile</p>
            <h1 className="mt-5 whitespace-nowrap text-[clamp(30px,4vw,54px)] font-medium leading-[0.98] tracking-[-0.065em] text-[#424242]">Software Developer</h1>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.75] text-[#858585] sm:text-[17px]">Building useful products with an engineering mindset, obsessing over the details and the why behind complex systems.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#6a7280] lg:justify-start">
              <span>Metro Manila, Philippines</span>
              <span>GMT 8+ PHT</span>
            </div>
            <BrandSocialProof />
          </div>
        </div>
      </div>
      <ExperienceProofCards payload={payload} />
    </section>
  );
}
