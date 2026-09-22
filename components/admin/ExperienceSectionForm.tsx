import { savePageSectionAction } from "@/app/admin/actions";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { AdminErrorBanner, Field, FormSection, SelectField, TextareaField, type SelectOption } from "@/components/admin/FormPrimitives";
import { MarkdownBodyField } from "@/components/admin/MarkdownBodyField";

const statuses: SelectOption[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export function ExperienceSectionForm({ value, errorMessage }: { value: { id?: number; sectionKey?: string; title?: string | null; subtitle?: string | null; bodyMd?: string | null; metaJson?: string | null; status?: string; sortOrder?: number } | null; errorMessage?: string }) {
  return (
    <form action={savePageSectionAction} className="space-y-6 rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
      <FormSection title={`Experience / ${value?.sectionKey || "section"}`} description="Edit the structured content behind the Experience page without changing its presentation template." />
      <AdminErrorBanner message={errorMessage} />
      <input type="hidden" name="id" value={value?.id || ""} />
      <input type="hidden" name="pageKey" value="experience" />
      <input type="hidden" name="sectionKey" value={value?.sectionKey || "profile"} />
      <input type="hidden" name="sortOrder" value={value?.sortOrder || 0} />
      <input type="hidden" name="returnTo" value={`/admin/experience/${value?.id || ""}`} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Section Key" name="sectionKeyReadOnly" defaultValue={value?.sectionKey || "profile"} className="pointer-events-none opacity-80" />
        <SelectField label="Status" name="status" defaultValue={value?.status || "draft"} options={statuses} />
      </div>
      <Field label="Title" name="title" defaultValue={value?.title || ""} />
      <Field label="Subtitle" name="subtitle" defaultValue={value?.subtitle || ""} />
      <MarkdownBodyField label="Description" name="bodyMd" defaultValue={value?.bodyMd} rows={8} />
      <TextareaField label="Meta JSON" name="metaJson" defaultValue={value?.metaJson || ""} rows={5} textareaClassName="font-mono text-[0.9em]" />
      <p className="text-sm text-[#666666]">Profile metadata example: {`{"location":"Metro Manila, Philippines","timezone":"GMT 8+ PHT"}`}</p>
      <AdminFormSubmitButton>Save Experience content</AdminFormSubmitButton>
    </form>
  );
}
