import type { Metadata } from "next";
import Link from "next/link";

import PageLayout from "@/components/layouts/PageLayout";
import { getPublicLegalLinks } from "@/lib/legal-links";

export const metadata: Metadata = {
  title: "Privacy | JustineDevs Portfolio",
  description: "Privacy policy for jstn.site and related portfolio properties.",
};

export default async function PrivacyPage() {
  const legalLinks = await getPublicLegalLinks();

  return (
    <PageLayout legalLinks={legalLinks}>
      <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-[#d5d5d5] bg-white p-6 sm:mt-8 sm:p-8 md:p-10">
        <h1 className="mb-4 text-xl font-bold text-[#424242] sm:text-2xl">Privacy policy</h1>
        <p className="mb-6 text-sm leading-relaxed text-[#555555] sm:text-base">
          This page is a placeholder you can replace with your full policy (or point the footer link to an
          external URL via <code className="rounded bg-[#f0f0f0] px-1 font-mono text-xs">NEXT_PUBLIC_PRIVACY_POLICY_URL</code>{" "}
          or CMS <code className="rounded bg-[#f0f0f0] px-1 font-mono text-xs">privacyPolicyUrl</code>).
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-[#555555] sm:text-base">
          <li>Describe what data you collect (analytics, forms, auth, etc.).</li>
          <li>Explain how you use, store, and delete data.</li>
          <li>List subprocessors or third parties (e.g. hosting, analytics).</li>
          <li>Add contact details for privacy requests.</li>
        </ul>
        <p className="mt-8 text-xs text-[#555555]">
          <Link
            href="/"
            className="rounded underline underline-offset-2 hover:text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2"
          >
            Back to home
          </Link>
          {" · "}
          <Link
            href="/terms"
            className="rounded underline underline-offset-2 hover:text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#424242] focus:ring-offset-2"
          >
            Terms
          </Link>
        </p>
      </div>
    </PageLayout>
  );
}
