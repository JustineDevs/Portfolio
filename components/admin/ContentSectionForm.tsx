import { savePageSectionAction } from "@/app/admin/actions";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { AdminErrorBanner, Field, FormSection, SelectField, TextareaField, type SelectOption } from "@/components/admin/FormPrimitives";
import { MarkdownBodyField } from "@/components/admin/MarkdownBodyField";

const statuses: SelectOption[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export function ContentSectionForm({ value, errorMessage }: { value: { id?: number; pageKey?: string; sectionKey?: string; title?: string | null; subtitle?: string | null; bodyMd?: string | null; metaJson?: string | null; status?: string; sortOrder?: number } | null; errorMessage?: string }) {
  return (
    <form action={savePageSectionAction} className="space-y-6 rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
      <FormSection title={`${value?.pageKey || "Content"} / ${value?.sectionKey || "section"}`} description="Edit CMS content while keeping the public route's existing component template and visual system unchanged." />
      <AdminErrorBanner message={errorMessage} />
      <input type="hidden" name="id" value={value?.id || ""} />
      <input type="hidden" name="pageKey" value={value?.pageKey || "legal"} />
      <input type="hidden" name="sectionKey" value={value?.sectionKey || "section"} />
      <input type="hidden" name="sortOrder" value={value?.sortOrder || 0} />
      <input type="hidden" name="returnTo" value={`/admin/content/${value?.id || ""}`} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Section key" name="sectionKeyReadOnly" defaultValue={value?.sectionKey || "section"} className="pointer-events-none opacity-80" />
        <SelectField label="Status" name="status" defaultValue={value?.status || "draft"} options={statuses} />
      </div>
      <Field label="Title" name="title" defaultValue={value?.title || ""} />
      <Field label="Eyebrow / subtitle" name="subtitle" defaultValue={value?.subtitle || ""} />
      <MarkdownBodyField label="Description" name="bodyMd" defaultValue={value?.bodyMd} rows={6} />
      <TextareaField label="Structured content JSON" name="metaJson" defaultValue={value?.metaJson || ""} rows={12} textareaClassName="font-mono text-[0.9em]" />
      <AdminFormSubmitButton>Save CMS content</AdminFormSubmitButton>
    </form>
  );
}
