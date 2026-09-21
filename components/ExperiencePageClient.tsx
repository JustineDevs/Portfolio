"use client";

import PageLayout from "@/components/layouts/PageLayout";
import TimelineNavigationSection from "@/components/sections/experience/TimelineNavigationSection";
import ExperienceOverviewSection from "@/components/sections/experience/ExperienceOverviewSection";
import type { PublicLegalLinks } from "@/lib/legal-links-shared";
import type { ExperiencePageData } from "@/lib/content/page-data";

export default function ExperiencePageClient({
  legalLinks,
  proofOfWork: _proofOfWork,
}: {
  legalLinks: PublicLegalLinks;
  proofOfWork: ExperiencePageData["proofOfWork"];
}) {
  return (
    <>
      <PageLayout legalLinks={legalLinks}>
        <ExperienceOverviewSection payload={_proofOfWork} />
        <TimelineNavigationSection />
      </PageLayout>
    </>
  );
}
