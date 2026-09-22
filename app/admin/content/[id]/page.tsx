import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import { ContentSectionForm } from "@/components/admin/ContentSectionForm";
import { getPageSectionForAdmin } from "@/lib/content/admin";

export default async function AdminContentEditPage({ params, searchParams }: { params: { id: string }; searchParams?: { error?: string } }) {
  await requireAdminSession();
  const section = await getPageSectionForAdmin(Number.parseInt(params.id, 10));
  if (!section || section.pageKey !== "legal") notFound();
  return <main><ContentSectionForm value={section} errorMessage={searchParams?.error} /></main>;
}
