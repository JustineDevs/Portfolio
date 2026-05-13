import Link from "next/link";

import { listProjectsForAdmin } from "@/lib/content/admin";

export default async function AdminProjectsPage() {
  const projects = await listProjectsForAdmin();

  return (
    <main className="space-y-6">
      <section className="flex items-center justify-between rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#424242]">Projects</h1>
          <p className="mt-2 text-sm text-[#666666]">Manage project cards and detail pages.</p>
        </div>
        <Link href="/admin/projects/new" className="rounded-lg bg-[#424242] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#333333]">
          New project
        </Link>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#d5d5d5] bg-white shadow-sm">
        <div className="grid grid-cols-[1.5fr_1fr_140px_120px] gap-4 border-b border-[#d5d5d5] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#666666]">
          <div>Project</div>
          <div>Category</div>
          <div>Status</div>
          <div>Edit</div>
        </div>
        {projects.map((project) => (
          <div key={project.id} className="grid grid-cols-[1.5fr_1fr_140px_120px] gap-4 border-b border-[#efefef] px-6 py-4 text-sm last:border-b-0">
            <div>
              <div className="font-semibold text-[#424242]">{project.title}</div>
              <div className="text-[#666666]">{project.slug}</div>
            </div>
            <div className="text-[#555555]">{project.category}</div>
            <div className="capitalize text-[#555555]">{project.status}</div>
            <div>
              <Link href={`/admin/projects/${project.id}`} className="text-[#1342FF] hover:underline">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
