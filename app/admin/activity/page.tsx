import { refreshGithubActivityAction } from "@/app/admin/actions";
import { requireAdminSession } from "@/lib/auth";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { adminInputControlClass } from "@/components/admin/admin-styles";
import { listGithubActivitySnapshotsForAdmin } from "@/lib/content/admin";
import { AdminPageHeader, AdminTable, AdminTableHeader, AdminTableRow } from "@/components/admin/CmsSurface";

export default async function AdminActivityPage() {
  await requireAdminSession();
  const snapshots = await listGithubActivitySnapshotsForAdmin();

  return (
    <main className="space-y-8">
      <AdminPageHeader eyebrow="Operations / Activity" title="Activity" count={`${snapshots.length} snapshots`} description="Refresh GitHub contribution data and inspect the latest stored snapshots." />
      <section className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_8px_30px_rgba(24,24,27,0.04)]">
        <p className="text-sm leading-6 text-[#71717a]">
          Refresh GitHub contribution data and inspect the latest stored snapshots.
        </p>
        <form action={refreshGithubActivityAction} className="mt-5 flex flex-wrap items-end gap-3">
          <label className="block min-w-[min(100%,20rem)] flex-1">
            <span className="mb-2 block text-sm font-medium text-[#424242]">Years</span>
            <input
              name="years"
              defaultValue={`${new Date().getFullYear()}, ${new Date().getFullYear() - 1}, ${new Date().getFullYear() - 2}, ${new Date().getFullYear() - 3}`}
              className={adminInputControlClass}
            />
          </label>
          <AdminFormSubmitButton pendingLabel="Refreshing…" className="px-4 py-3">
            Refresh activity
          </AdminFormSubmitButton>
        </form>
      </section>

      <AdminTable label="Stored GitHub activity snapshots"><AdminTableHeader><div>Year</div><div>Fetched at</div><div>Source hash</div><div>Status</div></AdminTableHeader>{snapshots.map((snapshot) => <AdminTableRow key={snapshot.id}><div className="font-semibold text-[#18181b]">{snapshot.year}</div><div className="text-[#52525b]">{snapshot.fetchedAt}</div><div className="max-w-[220px] truncate font-mono text-xs text-[#71717a]" title={snapshot.sourceHash ?? undefined}>{snapshot.sourceHash}</div><div className="text-xs font-semibold text-emerald-700">Stored</div></AdminTableRow>)}</AdminTable>
    </main>
  );
}
