import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { getPublicLegalLinks } from "@/lib/legal-links";
import { getLegalPageData } from "@/lib/content/legal-page-data";

export const metadata: Metadata = {
  title: "Terms | JustineDevs Portfolio",
  description: "Terms of use for jstn.site and related portfolio properties.",
};

export default async function TermsPage() {
  const [legalLinks, content] = await Promise.all([getPublicLegalLinks(), getLegalPageData("terms")]);

  return <LegalPage {...content} legalLinks={legalLinks} />;
}
