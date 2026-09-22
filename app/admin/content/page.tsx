import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";
import { listPageSectionsForAdmin } from "@/lib/content/admin";
import { AdminPageHeader, AdminStatusBadge, AdminTable, AdminTableHeader, AdminTableRow } from "@/components/admin/CmsSurface";

export default async function AdminContentPage() {
  await requireAdminSession();
  const sections = (await listPageSectionsForAdmin()).filter((section) => section.pageKey === "legal");
  return (
    <main className="space-y-8">
      <AdminPageHeader eyebrow="Publish / Content" title="Site content" count={`${sections.length} sections`} description="Manage route-level content that is shared by the legal page template." />
      <AdminTable label="Site content sections"><AdminTableHeader><div>Section</div><div>Key</div><div>Status</div><div>Actions</div></AdminTableHeader>
        {sections.map((section) => <AdminTableRow key={section.id}><div className="font-semibold text-[#18181b]">{section.title || section.sectionKey}</div><div className="font-mono text-xs text-[#52525b]">{section.sectionKey}</div><AdminStatusBadge value={section.status} /><Link href={`/admin/content/${section.id}`} className="font-semibold text-[#1342FF] hover:underline">Edit</Link></AdminTableRow>)}
      </AdminTable>
    </main>
  );
}
