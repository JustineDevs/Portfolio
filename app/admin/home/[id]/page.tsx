import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import { HomeSectionForm } from "@/components/admin/HomeSectionForm";
import { getPageSectionForAdmin } from "@/lib/content/admin";

export default async function AdminHomeEditPage({ params, searchParams }: { params: { id: string }; searchParams?: { error?: string } }) {
  await requireAdminSession();
  const section = await getPageSectionForAdmin(Number.parseInt(params.id, 10));
  if (!section || section.pageKey !== "home") notFound();
  return <main><HomeSectionForm value={section} errorMessage={searchParams?.error} /></main>;
}
