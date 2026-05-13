import { ProjectForm } from "@/components/admin/ProjectForm";
import { requireAdminSession } from "@/lib/auth";

export default async function AdminProjectNewPage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
  await requireAdminSession();
  return <ProjectForm title="New Project" errorMessage={searchParams?.error} />;
}
