import LegalPage from "@/components/LegalPage";
import { getPublicLegalLinks } from "@/lib/legal-links";
import { getLegalPageData } from "@/lib/content/legal-page-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of use | JustineDevs portfolio",
  description: "Terms of use for jstn.site and related JustineDevs portfolio properties.",
  path: "/terms",
});

export default async function TermsPage() {
  const [legalLinks, content] = await Promise.all([getPublicLegalLinks(), getLegalPageData("terms")]);

  return <LegalPage {...content} legalLinks={legalLinks} />;
}
