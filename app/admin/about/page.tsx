import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";

import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminErrorBanner } from "@/components/admin/FormPrimitives";
import { getAboutSectionConfig } from "@/lib/about-section-config";
import { listAvailableAboutSectionKeysForAdmin, listPageSectionsForAdmin } from "@/lib/content/admin";
import { AdminPageHeader, AdminPrimaryAction, AdminStatusBadge, AdminTable, AdminTableHeader, AdminTableRow, AdminTableToolbar } from "@/components/admin/CmsSurface";

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams?: { error?: string; q?: string; status?: string };
}) {
  await requireAdminSession();
  const [sections, availableSectionKeys] = await Promise.all([
    listPageSectionsForAdmin("about"),
    listAvailableAboutSectionKeysForAdmin(),
  ]);
  const errorMessage = searchParams?.error;
  const search = searchParams?.q?.trim().toLowerCase() ?? "";
  const status = searchParams?.status ?? "";
  const visibleSections = sections.filter((section) => { const config = getAboutSectionConfig(section.sectionKey); return (!search || `${config.label} ${config.description} ${section.sectionKey}`.toLowerCase().includes(search)) && (!status || section.status === status); });

  return (
    <main className="space-y-8">
      <AdminPageHeader title="About / Personal Page" count={`${sections.length} sections`} description="Manage editorial page slots for story, learning, philosophy, methodology, and under-the-hood thinking." actions={availableSectionKeys.length > 0 ? <AdminPrimaryAction href="/admin/about/new">New section</AdminPrimaryAction> : <span className="inline-flex min-h-10 items-center rounded-md border border-[#e4e4e7] px-3 text-xs font-semibold text-[#71717a]">All slots created</span>} />

      <section className="rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
        <AdminErrorBanner message={errorMessage} />
      </section>

      <AdminTable label="About sections"><AdminTableToolbar search={searchParams?.q} placeholder="Search about sections..." filter={status} filterOptions={[{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }]} />
        <AdminTableHeader>
          <div>Section</div>
          <div>Key</div>
          <div>Status</div>
          <div>Actions</div>
        </AdminTableHeader>
        {visibleSections.map((section) => {
          const config = getAboutSectionConfig(section.sectionKey);
          return (
            <AdminTableRow key={section.id}>
              <div>
                <div className="font-semibold text-[#18181b]">{config.label}</div>
                <div className="text-xs text-[#71717a]">{config.description}</div>
              </div>
              <div className="font-mono text-xs text-[#52525b]">{section.sectionKey}</div>
              <AdminStatusBadge value={section.status} />
              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/admin/about/${section.id}`} className="font-semibold text-[#1342FF] hover:underline">
                  Edit
                </Link>
                <AdminDeleteButton type="about" id={section.id} />
              </div>
            </AdminTableRow>
          );
        })}{!visibleSections.length ? <div className="px-5 py-14 text-center text-sm text-[#71717a]">No sections match the current filters.</div> : null}
      </AdminTable>
    </main>
  );
}
