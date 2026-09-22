import { savePageSectionAction } from "@/app/admin/actions";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { AdminErrorBanner, Field, FormSection, SelectField, TextareaField, type SelectOption } from "@/components/admin/FormPrimitives";
import { MarkdownBodyField } from "@/components/admin/MarkdownBodyField";

const statuses: SelectOption[] = [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }];

export function HomeSectionForm({ value, errorMessage }: { value: { id?: number; sectionKey?: string; title?: string | null; subtitle?: string | null; bodyMd?: string | null; metaJson?: string | null; status?: string; sortOrder?: number } | null; errorMessage?: string }) {
  return <form action={savePageSectionAction} className="space-y-6 rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
    <FormSection title={`Home / ${value?.sectionKey || "section"}`} description="Manage Home page copy while preserving the existing component template and visual system." />
    <AdminErrorBanner message={errorMessage} />
    <input type="hidden" name="id" value={value?.id || ""} /><input type="hidden" name="pageKey" value="home" /><input type="hidden" name="sectionKey" value={value?.sectionKey || "how_i_work"} /><input type="hidden" name="sortOrder" value={value?.sortOrder || 0} /><input type="hidden" name="returnTo" value={`/admin/home/${value?.id || ""}`} />
    <div className="grid gap-4 md:grid-cols-2"><Field label="Section Key" name="sectionKeyReadOnly" defaultValue={value?.sectionKey || "how_i_work"} className="pointer-events-none opacity-80" /><SelectField label="Status" name="status" defaultValue={value?.status || "draft"} options={statuses} /></div>
    <Field label="Title" name="title" defaultValue={value?.title || ""} /><Field label="Subtitle" name="subtitle" defaultValue={value?.subtitle || ""} /><MarkdownBodyField label="Copy" name="bodyMd" defaultValue={value?.bodyMd} rows={10} /><TextareaField label="Meta JSON" name="metaJson" defaultValue={value?.metaJson || ""} rows={5} textareaClassName="font-mono text-[0.9em]" />
    <AdminFormSubmitButton>Save Home content</AdminFormSubmitButton>
  </form>;
}
