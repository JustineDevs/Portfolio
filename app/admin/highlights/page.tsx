import { HighlightForm } from "@/components/admin/HighlightForm";
import { requireAdminSession } from "@/lib/auth";
import { AdminErrorBanner } from "@/components/admin/FormPrimitives";
import { AdminPageHeader } from "@/components/admin/CmsSurface";
import { listHighlightTargetOptionsForAdmin, listHighlightsForAdmin } from "@/lib/content/admin";

export default async function AdminHighlightsPage({
  searchParams,
}: {
  searchParams?: { error?: string; form?: string; saved?: string };
}) {
  await requireAdminSession();
  const [highlights, targetOptions] = await Promise.all([
    listHighlightsForAdmin(),
    listHighlightTargetOptionsForAdmin(),
  ]);
  const errorMessage = searchParams?.error;
  const statusForm = searchParams?.form;
  const savedState = searchParams?.saved;

  return (
    <main className="space-y-8">
      <AdminPageHeader eyebrow="Publish / Content" title="Highlights" count={`${highlights.length} records`} description="Highlights feed the Experience testimonials and awards lanes. Use testimonial, award, or manual card; certificates are managed separately." />
      <section className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_8px_30px_rgba(24,24,27,0.04)]">
        <p className="text-sm leading-6 text-[#71717a]">
          Highlights only feed the Experience testimonials and awards lanes. Use `testimonial`, `award`, or `manual card`. Certificates are managed separately in the Certificates CMS.
        </p>
        <AdminErrorBanner message={errorMessage} />
      </section>

      {[...highlights, null].map((highlight, index) => {
        const formKey = highlight ? `highlight-${highlight.id}` : `new-${index}`;
        const matchesStatus = statusForm === formKey;
        return (
          <HighlightForm
            key={formKey}
            formKey={formKey}
            value={highlight}
            targetOptions={targetOptions}
            errorMessage={matchesStatus ? errorMessage : undefined}
            savedMessage={
              matchesStatus && savedState
                ? savedState === "created"
                  ? "Saved: created."
                  : "Saved: changes applied."
                : undefined
            }
          />
        );
      })}
    </main>
  );
}
