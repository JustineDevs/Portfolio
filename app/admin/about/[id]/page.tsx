import { notFound } from "next/navigation";

import { AboutSectionForm } from "@/components/admin/AboutSectionForm";
import { getAboutSectionOptions } from "@/lib/about-section-config";
import { getPageSectionForAdmin } from "@/lib/content/admin";

export default async function AdminAboutEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { error?: string };
}) {
  const section = await getPageSectionForAdmin(Number.parseInt(params.id, 10));

  if (!section || section.pageKey !== "about") {
    notFound();
  }

  return (
    <AboutSectionForm
      title={`Edit About Section: ${section.sectionKey}`}
      value={section}
      errorMessage={searchParams?.error}
      sectionKeyOptions={getAboutSectionOptions([section.sectionKey])}
    />
  );
}
