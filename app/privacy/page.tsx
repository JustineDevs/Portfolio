import LegalPage from "@/components/LegalPage";
import { getPublicLegalLinks } from "@/lib/legal-links";
import { getLegalPageData } from "@/lib/content/legal-page-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy policy | JustineDevs portfolio",
  description: "Privacy policy for jstn.site and related JustineDevs portfolio properties.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const [legalLinks, content] = await Promise.all([getPublicLegalLinks(), getLegalPageData("privacy")]);

  return <LegalPage {...content} legalLinks={legalLinks} />;
}
