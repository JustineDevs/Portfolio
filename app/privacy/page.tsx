import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { getPublicLegalLinks } from "@/lib/legal-links";

export const metadata: Metadata = {
  title: "Privacy | JustineDevs Portfolio",
  description: "Privacy policy for jstn.site and related portfolio properties.",
};

export default async function PrivacyPage() {
  const legalLinks = await getPublicLegalLinks();

  return <LegalPage title="Privacy" eyebrow="Site information" description="This page explains how information is handled when you browse this site or contact its owner." legalLinks={legalLinks} sections={[{ title: "Overview", body: "Information is used only to operate the site, respond to requests, improve reliability, and protect the service." }, { title: "Your choices", body: "If you have a question about information associated with a request or interaction, contact the site owner for clarification or assistance." }]} />;
}
