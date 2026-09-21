import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { getPublicLegalLinks } from "@/lib/legal-links";

export const metadata: Metadata = {
  title: "Terms | JustineDevs Portfolio",
  description: "Terms of use for jstn.site and related portfolio properties.",
};

export default async function TermsPage() {
  const legalLinks = await getPublicLegalLinks();

  return <LegalPage title="Terms" eyebrow="Site information" description="These terms outline the expectations for using this site and the materials shared through it." legalLinks={legalLinks} sections={[{ title: "Using this site", body: "Please use the site and its content lawfully, respectfully, and in a way that does not interfere with other visitors or the service." }, { title: "Site content", body: "Unless stated otherwise, portfolio work, writing, and visual materials remain associated with their respective owners and sources." }]} />;
}
