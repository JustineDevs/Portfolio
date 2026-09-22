import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { getPublicLegalLinks } from "@/lib/legal-links";
import { getLegalPageData } from "@/lib/content/legal-page-data";

export const metadata: Metadata = {
  title: "Privacy | JustineDevs Portfolio",
  description: "Privacy policy for jstn.site and related portfolio properties.",
};

export default async function PrivacyPage() {
  const [legalLinks, content] = await Promise.all([getPublicLegalLinks(), getLegalPageData("privacy")]);

  return <LegalPage {...content} legalLinks={legalLinks} />;
}
