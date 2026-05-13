import { HighlightForm } from "@/components/admin/HighlightForm";
import { AdminErrorBanner } from "@/components/admin/FormPrimitives";
import { listHighlightTargetOptionsForAdmin, listHighlightsForAdmin } from "@/lib/content/admin";

export default async function AdminHighlightsPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const [highlights, targetOptions] = await Promise.all([
    listHighlightsForAdmin(),
    listHighlightTargetOptionsForAdmin(),
  ]);
  const errorMessage = searchParams?.error;

  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-[#424242]">Highlights</h1>
        <p className="mt-2 text-sm text-[#666666]">
          Curate support cards across Experience. `project` renders in Proof of Work, `post` in Writing, `testimonial` in Testimonials,
          `award` in Awards, and `custom` is reserved for Certificates.
        </p>
        <AdminErrorBanner message={errorMessage} />
      </section>

      {[...highlights, null].map((highlight, index) => (
        <HighlightForm key={highlight ? highlight.id : `new-${index}`} value={highlight} targetOptions={targetOptions} />
      ))}
    </main>
  );
}
