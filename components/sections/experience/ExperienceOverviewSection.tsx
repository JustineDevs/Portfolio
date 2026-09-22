import HyperKitTeamCard from "@/components/sections/experience/HyperKitTeamCard";
import ExperienceProofCards from "@/components/sections/experience/ExperienceProofCards";
import Image from "next/image";
import type { ExperiencePageData } from "@/lib/content/page-data";

function BrandSocialProof({ assets }: { assets: ExperiencePageData["assets"] }) {
  return (
    <div aria-label="Brand social proof" className="mt-9 grid items-center gap-5 sm:grid-cols-[minmax(9rem,0.7fr)_minmax(0,1.3fr)] sm:gap-8">
      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#858585]">Built with teams at</p>
      <div className="grid grid-cols-2 items-center gap-x-10 gap-y-6">
        <div className="flex h-9 items-center">
          <Image src={assets.hyperkit?.url || "/assets/associates/hyperkit.svg"} alt={assets.hyperkit?.altText || "HyperKit"} width={120} height={36} unoptimized className="h-8 w-auto max-w-full object-contain object-left opacity-70" />
        </div>
        <div className="flex h-9 items-center">
          <Image src={assets.projectOnePercent?.url || "/Logo/one percent/one percent.jpg"} alt={assets.projectOnePercent?.altText || "Project One Percent"} width={160} height={36} unoptimized className="h-8 w-auto max-w-full object-contain object-left opacity-70" />
        </div>
        <div className="flex h-9 items-center">
          <Image src={assets.universalStudios?.url || "/UVS/UVS_logo_landscape.png"} alt={assets.universalStudios?.altText || "UVS"} width={110} height={48} unoptimized className="h-9 w-auto max-w-full object-contain object-left opacity-70" />
        </div>
        <div className="flex h-9 items-center">
          <Image src={assets.jstn?.url || "/JSTN Logo/SVG/Brand name - B.svg"} alt={assets.jstn?.altText || "JSTN"} width={96} height={36} unoptimized className="h-8 w-auto max-w-full object-contain object-left opacity-65" />
        </div>
      </div>
    </div>
  );
}

export default function ExperienceOverviewSection({ payload, assets, profile }: { payload: ExperiencePageData["proofOfWork"]; assets: ExperiencePageData["assets"]; profile: ExperiencePageData["profile"] }) {
  return (
    <section className="border-x border-b border-[#d5d5d5] bg-[#f8f8f8]">
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-10 lg:px-16 lg:py-16">
        <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(250px,0.78fr)_minmax(0,1.5fr)] lg:gap-16">
          <div className="flex min-h-[360px] items-center justify-center lg:justify-start">
            <HyperKitTeamCard avatarUrl={assets.justine?.url} miniAvatarUrl={assets.justineMini?.url} iconUrl={assets.iconPattern?.url} />
          </div>
          <div className="flex flex-col justify-start pt-2 text-center lg:pt-8 lg:text-left">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#1342FF]">Experience / profile</p>
            <h1 className="mt-5 whitespace-nowrap text-[clamp(30px,4vw,54px)] font-medium leading-[0.98] tracking-[-0.065em] text-[#424242]">{profile.title}</h1>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.75] text-[#858585] sm:text-[17px]">{profile.description}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#6a7280] lg:justify-start">
              <span>{profile.location}</span>
              <span>{profile.timezone}</span>
            </div>
            <BrandSocialProof assets={assets} />
          </div>
        </div>
      </div>
      <ExperienceProofCards payload={payload} />
    </section>
  );
}
