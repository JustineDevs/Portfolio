import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";
import { listPageSectionsForAdmin } from "@/lib/content/admin";
import { AdminPageHeader, AdminStatusBadge, AdminTable, AdminTableHeader, AdminTableRow } from "@/components/admin/CmsSurface";

export default async function AdminHomePage() {
  await requireAdminSession();
  const sections = await listPageSectionsForAdmin("home");
  return <main className="space-y-8"><AdminPageHeader eyebrow="Publish / Content" title="Home page" count={`${sections.length} sections`} description="Edit the content used by the existing Home page components." /><AdminTable label="Home sections"><AdminTableHeader><div>Section</div><div>Key</div><div>Status</div><div>Actions</div></AdminTableHeader>{sections.map((section) => <AdminTableRow key={section.id}><div className="font-semibold text-[#18181b]">{section.title || section.sectionKey}</div><div className="font-mono text-xs text-[#52525b]">{section.sectionKey}</div><AdminStatusBadge value={section.status} /><Link href={`/admin/home/${section.id}`} className="font-semibold text-[#1342FF] hover:underline">Edit</Link></AdminTableRow>)}</AdminTable></main>;
}
