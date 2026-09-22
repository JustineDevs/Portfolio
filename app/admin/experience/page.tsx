import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";
import { listPageSectionsForAdmin } from "@/lib/content/admin";
import { AdminPageHeader, AdminStatusBadge, AdminTable, AdminTableHeader, AdminTableRow } from "@/components/admin/CmsSurface";

export default async function AdminExperiencePage() {
  await requireAdminSession();
  const sections = await listPageSectionsForAdmin("experience");
  return (
    <main className="space-y-8">
      <AdminPageHeader eyebrow="Publish / Content" title="Experience page" count={`${sections.length} sections`} description="Manage the content behind the existing Experience templates. Assets remain reusable through the Asset Library." />
      <AdminTable label="Experience sections">
        <AdminTableHeader><div>Section</div><div>Key</div><div>Status</div><div>Actions</div></AdminTableHeader>
        {sections.map((section) => (
          <AdminTableRow key={section.id}><div><p className="font-semibold text-[#18181b]">{section.title || section.sectionKey}</p></div><div className="font-mono text-xs text-[#52525b]">{section.sectionKey}</div><AdminStatusBadge value={section.status} /><Link href={`/admin/experience/${section.id}`} className="font-semibold text-[#1342FF] hover:underline">Edit</Link></AdminTableRow>
        ))}
      </AdminTable>
    </main>
  );
}
