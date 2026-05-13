import { redirect } from "next/navigation";

import { AboutSectionForm } from "@/components/admin/AboutSectionForm";
import { getAboutSectionOptions } from "@/lib/about-section-config";
import { requireAdminSession } from "@/lib/auth";
import { listAvailableAboutSectionKeysForAdmin } from "@/lib/content/admin";

export default async function AdminAboutNewPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  await requireAdminSession();
  const availableSectionKeys = await listAvailableAboutSectionKeysForAdmin();

  if (availableSectionKeys.length === 0) {
    redirect("/admin/about?error=All%20About%20section%20slots%20already%20exist.");
  }

  return (
    <AboutSectionForm
      title="New About Section"
      errorMessage={searchParams?.error}
      sectionKeyOptions={getAboutSectionOptions(availableSectionKeys)}
    />
  );
}
