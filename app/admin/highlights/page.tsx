import { saveHighlightAction } from "@/app/admin/actions";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { CheckboxField, Field, type SelectOption, SelectField, TextareaField } from "@/components/admin/FormPrimitives";
import { listHighlightsForAdmin } from "@/lib/content/admin";

const HIGHLIGHT_TYPE_OPTIONS: SelectOption[] = [
  { value: "custom", label: "Custom" },
  { value: "project", label: "Project" },
  { value: "post", label: "Post" },
  { value: "testimonial", label: "Testimonial" },
  { value: "award", label: "Award" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default async function AdminHighlightsPage() {
  const highlights = await listHighlightsForAdmin();

  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-[#424242]">Highlights</h1>
        <p className="mt-2 text-sm text-[#666666]">Curate pinned proof-of-work items and auto-fill support cards.</p>
      </section>

      {[...highlights, null].map((highlight, index) => (
        <form
          key={highlight ? highlight.id : `new-${index}`}
          action={saveHighlightAction}
          className="space-y-4 rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm"
        >
          {highlight ? <input type="hidden" name="id" value={highlight.id} /> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Type"
              name="highlightType"
              defaultValue={highlight?.highlightType || "custom"}
              options={HIGHLIGHT_TYPE_OPTIONS}
            />
            <SelectField label="Status" name="status" defaultValue={highlight?.status || "draft"} options={STATUS_OPTIONS} />
            <Field label="Title Override" name="titleOverride" defaultValue={highlight?.titleOverride || ""} />
            <Field label="Link Override" name="linkOverride" defaultValue={highlight?.linkOverride || ""} />
            <Field label="Image Override" name="imageUrlOverride" defaultValue={highlight?.imageUrlOverride || ""} />
            <Field label="Sort Order" name="sortOrder" defaultValue={String(highlight?.sortOrder ?? 0)} />
          </div>
          <TextareaField label="Summary Override" name="summaryOverride" defaultValue={highlight?.summaryOverride || ""} rows={4} />
          <CheckboxField label="Pinned" name="pinned" defaultChecked={highlight?.pinned} />
          <AdminFormSubmitButton>{highlight ? "Save highlight" : "Create highlight"}</AdminFormSubmitButton>
        </form>
      ))}
    </main>
  );
}
