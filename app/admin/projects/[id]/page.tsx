import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectForAdmin } from "@/lib/content/admin";

export default async function AdminProjectEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { error?: string };
}) {
  await requireAdminSession();
  const project = await getProjectForAdmin(Number.parseInt(params.id, 10));

  if (!project) {
    notFound();
  }

  return <ProjectForm title={`Edit Project: ${project.title}`} value={project} errorMessage={searchParams?.error} />;
}
