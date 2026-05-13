import Link from "next/link";

import { AdminErrorBanner } from "@/components/admin/FormPrimitives";
import { getAboutSectionConfig } from "@/lib/about-section-config";
import { listAvailableAboutSectionKeysForAdmin, listPageSectionsForAdmin } from "@/lib/content/admin";

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const [sections, availableSectionKeys] = await Promise.all([
    listPageSectionsForAdmin("about"),
    listAvailableAboutSectionKeysForAdmin(),
  ]);
  const errorMessage = searchParams?.error;

  return (
    <main className="space-y-6">
      <section className="flex items-center justify-between rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#424242]">About / Personal Page</h1>
          <p className="mt-2 text-sm text-[#666666]">
            Manage editorial About page slots for story, learning, philosophy, methodology, and under-the-hood thinking.
          </p>
          <p className="mt-2 text-sm text-[#666666]">
            These are structured layout slots, but editing now follows the same list/new/edit flow as the other CMS areas.
          </p>
        </div>
        {availableSectionKeys.length > 0 ? (
          <Link href="/admin/about/new" className="rounded-lg bg-[#424242] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#333333]">
            New section
          </Link>
        ) : (
          <span className="rounded-lg border border-[#d5d5d5] px-4 py-2 text-sm text-[#666666]">
            All slots created
          </span>
        )}
      </section>

      <section className="rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
        <AdminErrorBanner message={errorMessage} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#d5d5d5] bg-white shadow-sm">
        <div className="grid grid-cols-[1.4fr_1fr_140px_120px] gap-4 border-b border-[#d5d5d5] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#666666]">
          <div>Section</div>
          <div>Key</div>
          <div>Status</div>
          <div>Edit</div>
        </div>
        {sections.map((section) => {
          const config = getAboutSectionConfig(section.sectionKey);
          return (
            <div key={section.id} className="grid grid-cols-[1.4fr_1fr_140px_120px] gap-4 border-b border-[#efefef] px-6 py-4 text-sm last:border-b-0">
              <div>
                <div className="font-semibold text-[#424242]">{config.label}</div>
                <div className="text-[#666666]">{config.description}</div>
              </div>
              <div className="text-[#555555]">{section.sectionKey}</div>
              <div className="capitalize text-[#555555]">{section.status}</div>
              <div>
                <Link href={`/admin/about/${section.id}`} className="text-[#1342FF] hover:underline">
                  Edit
                </Link>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
