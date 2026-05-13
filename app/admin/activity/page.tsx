import { refreshGithubActivityAction } from "@/app/admin/actions";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { adminInputControlClass } from "@/components/admin/admin-styles";
import { listGithubActivitySnapshotsForAdmin } from "@/lib/content/admin";

export default async function AdminActivityPage() {
  const snapshots = await listGithubActivitySnapshotsForAdmin();

  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-[#424242]">Activity</h1>
        <p className="mt-2 text-sm text-[#666666]">
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

      <section className="overflow-hidden rounded-2xl border border-[#d5d5d5] bg-white shadow-sm">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          <caption className="sr-only">Stored GitHub activity snapshots</caption>
          <thead>
            <tr className="border-b border-[#d5d5d5] bg-[#fafafa] text-xs font-semibold uppercase tracking-[0.2em] text-[#666666]">
              <th scope="col" className="px-6 py-4 font-semibold">
                Year
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Fetched At
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Source Hash
              </th>
            </tr>
          </thead>
          <tbody>
            {snapshots.map((snapshot) => (
              <tr key={snapshot.id} className="border-b border-[#efefef] last:border-b-0">
                <td className="px-6 py-4 font-medium text-[#424242]">{snapshot.year}</td>
                <td className="px-6 py-4 text-[#424242]">{snapshot.fetchedAt}</td>
                <td className="max-w-[220px] truncate px-6 py-4 text-[#666666]" title={snapshot.sourceHash ?? undefined}>
                  {snapshot.sourceHash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
