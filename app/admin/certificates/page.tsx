import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";

import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { listCertificatesForAdmin } from "@/lib/content/admin";
import { AdminPageHeader, AdminPrimaryAction, AdminStatusBadge, AdminTable, AdminTableHeader, AdminTableRow, AdminTableToolbar } from "@/components/admin/CmsSurface";

export default async function AdminCertificatesPage({ searchParams }: { searchParams?: { q?: string; status?: string } }) {
  await requireAdminSession();
  const certificates = await listCertificatesForAdmin();
  const search = searchParams?.q?.trim().toLowerCase() ?? "";
  const status = searchParams?.status ?? "";
  const visibleCertificates = certificates.filter((certificate) => (!search || `${certificate.title} ${certificate.slug} ${certificate.issuer ?? ""}`.toLowerCase().includes(search)) && (!status || certificate.status === status));

  return (
    <main className="space-y-8">
      <AdminPageHeader title="Certificates" count={`${certificates.length} records`} description="Manage certificate records separately from manual highlights." actions={<AdminPrimaryAction href="/admin/certificates/new">New certificate</AdminPrimaryAction>} />

      <AdminTable label="Certificates"><AdminTableToolbar search={searchParams?.q} placeholder="Search certificates..." filter={status} filterOptions={[{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }]} />
        <AdminTableHeader>
          <div>Certificate</div>
          <div>Issuer</div>
          <div>Status</div>
          <div>Actions</div>
        </AdminTableHeader>
        {visibleCertificates.map((certificate) => (
          <AdminTableRow key={certificate.id}>
            <div>
              <div className="font-semibold text-[#18181b]">{certificate.title}</div>
              <div className="text-xs text-[#71717a]">{certificate.slug}</div>
            </div>
            <div className="text-[#52525b]">{certificate.issuer || "—"}</div>
            <AdminStatusBadge value={certificate.status} />
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`/admin/certificates/${certificate.id}`} className="font-semibold text-[#1342FF] hover:underline">
                Edit
              </Link>
              <AdminDeleteButton type="certificate" id={certificate.id} />
            </div>
          </AdminTableRow>
        ))}{!visibleCertificates.length ? <div className="px-5 py-14 text-center text-sm text-[#71717a]">No certificates match the current filters.</div> : null}
      </AdminTable>
    </main>
  );
}
