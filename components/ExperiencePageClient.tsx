"use client";

import PageLayout from "@/components/layouts/PageLayout";
import HeroTitle from "@/components/sections/experience/HeroTitle";
import TimelineNavigationSection from "@/components/sections/experience/TimelineNavigationSection";
import GithubActivitySection from "@/components/sections/GithubActivitySection";
import ProofOfWorkSection from "@/components/sections/experience/ProofOfWorkSection";
import PixeledCursorTrail from "@/components/ui/PixeledCursorTrail";
import type { PublicLegalLinks } from "@/lib/legal-links";

export default function ExperiencePageClient({ legalLinks }: { legalLinks: PublicLegalLinks }) {
  return (
    <>
      <PixeledCursorTrail
        pixelCount={20}
        pixelSize={4}
        shape="square"
        color="#424242"
        blur={false}
        fadeOut={true}
        progressiveScale={true}
        trailStyle="solid"
        animationPreset="fade"
        spacing={8}
        stiffness={100}
        damping={10}
        trailDuration={0.3}
      />

      <PageLayout legalLinks={legalLinks}>
        <HeroTitle />
        <TimelineNavigationSection />
        <GithubActivitySection />
        <ProofOfWorkSection />
      </PageLayout>
    </>
  );
}
