import Link from "next/link";

import { listProjectsForAdmin } from "@/lib/content/admin";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";

export default async function AdminProjectsPage() {
  const projects = await listProjectsForAdmin();

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#424242]">Projects</h1>
          <p className="mt-2 text-sm text-[#666666]">Manage project cards and detail pages.</p>
        </div>
        <Link href="/admin/projects/new" className="rounded-lg bg-[#424242] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#333333]">
          New project
        </Link>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#d5d5d5] bg-white shadow-sm">
        <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_140px_160px] gap-4 border-b border-[#d5d5d5] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#666666] md:grid">
          <div>Project</div><div>Category</div><div>Status</div><div>Actions</div>
        </div>
        {projects.map((project) => (
          <div key={project.id} className="grid gap-4 border-b border-[#efefef] px-5 py-5 text-sm last:border-b-0 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_140px_160px] md:items-center md:px-6">
            <div className="min-w-0">
              <div className="font-semibold text-[#424242]">{project.title}</div>
              <div className="mt-1 truncate text-[#666666]">{project.slug}</div>
            </div>
            <div className="text-[#555555]"><span className="mr-2 text-xs uppercase tracking-wide text-[#999999] md:hidden">Category</span>{project.category}</div>
            <div className="capitalize text-[#555555]"><span className="mr-2 text-xs uppercase tracking-wide text-[#999999] md:hidden">Status</span>{project.status}</div>
            <div className="flex items-center gap-3 pt-1 md:pt-0">
              <Link href={`/admin/projects/${project.id}`} className="text-[#1342FF] hover:underline">
                Edit
              </Link>
              <AdminDeleteButton type="project" id={project.id} />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
