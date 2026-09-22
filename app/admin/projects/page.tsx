import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";

import { listProjectsForAdmin } from "@/lib/content/admin";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import {
  AdminPageHeader,
  AdminPrimaryAction,
  AdminStatusBadge,
  AdminTable,
  AdminTableHeader,
  AdminTableRow,
  AdminTableToolbar,
} from "@/components/admin/CmsSurface";

export default async function AdminProjectsPage({ searchParams }: { searchParams?: { q?: string; status?: string } }) {
  await requireAdminSession();
  const projects = await listProjectsForAdmin();
  const search = searchParams?.q?.trim().toLowerCase() ?? "";
  const status = searchParams?.status ?? "";
  const visibleProjects = projects.filter((project) => (!search || `${project.title} ${project.slug} ${project.category}`.toLowerCase().includes(search)) && (!status || project.status === status));

  return (
    <main className="space-y-8">
      <AdminPageHeader title="Projects" count={`${projects.length} records`} description="Manage project cards and detail pages." actions={<AdminPrimaryAction href="/admin/projects/new">New project</AdminPrimaryAction>} />

      <AdminTable label="Projects"><AdminTableToolbar search={searchParams?.q} placeholder="Search projects..." filter={status} filterOptions={[{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }]} />
        <AdminTableHeader>
          <div>Project</div><div>Category</div><div>Status</div><div>Actions</div>
        </AdminTableHeader>
        {visibleProjects.map((project) => (
          <AdminTableRow key={project.id}>
            <div className="min-w-0">
              <div className="font-semibold text-[#18181b]">{project.title}</div>
              <div className="mt-1 truncate text-xs text-[#71717a]">{project.slug}</div>
            </div>
            <div className="text-[#52525b]">{project.category}</div>
            <AdminStatusBadge value={project.status} />
            <div className="flex items-center gap-3 pt-1 md:pt-0">
              <Link href={`/admin/projects/${project.id}`} className="font-semibold text-[#1342FF] hover:underline">
                Edit
              </Link>
              <AdminDeleteButton type="project" id={project.id} />
            </div>
          </AdminTableRow>
        ))}{!visibleProjects.length ? <div className="px-5 py-14 text-center text-sm text-[#71717a]">No projects match the current filters.</div> : null}
      </AdminTable>
    </main>
  );
}
