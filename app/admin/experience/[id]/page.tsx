import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import { ExperienceSectionForm } from "@/components/admin/ExperienceSectionForm";
import { getPageSectionForAdmin, listProjectsForAdmin } from "@/lib/content/admin";

export default async function AdminExperienceEditPage({ params, searchParams }: { params: { id: string }; searchParams?: { error?: string } }) {
  await requireAdminSession();
  const section = await getPageSectionForAdmin(Number.parseInt(params.id, 10));
  if (!section || section.pageKey !== "experience") notFound();
  const projectOptions = section.sectionKey === "progress"
    ? (await listProjectsForAdmin()).map((project) => ({ value: project.title, label: project.title, description: project.summary }))
    : [];
  return <main><ExperienceSectionForm value={section} projectOptions={projectOptions} errorMessage={searchParams?.error} /></main>;
}
