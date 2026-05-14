import { HighlightForm } from "@/components/admin/HighlightForm";
import { AdminErrorBanner } from "@/components/admin/FormPrimitives";
import { listHighlightTargetOptionsForAdmin, listHighlightsForAdmin } from "@/lib/content/admin";

export default async function AdminHighlightsPage({
  searchParams,
}: {
  searchParams?: { error?: string; form?: string; saved?: string };
}) {
  const [highlights, targetOptions] = await Promise.all([
    listHighlightsForAdmin(),
    listHighlightTargetOptionsForAdmin(),
  ]);
  const errorMessage = searchParams?.error;
  const statusForm = searchParams?.form;
  const savedState = searchParams?.saved;

  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-[#424242]">Highlights</h1>
        <p className="mt-2 text-sm text-[#666666]">
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
