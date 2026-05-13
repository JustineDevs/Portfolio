import { savePageSectionAction } from "@/app/admin/actions";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import {
  AdminErrorBanner,
  Field,
  FormSection,
  SelectField,
  type SelectOption,
  TextareaField,
} from "@/components/admin/FormPrimitives";
import { MarkdownBodyField } from "@/components/admin/MarkdownBodyField";
import { getAboutSectionConfig } from "@/lib/about-section-config";

const STATUS_OPTIONS: SelectOption[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

type AboutSectionValue = {
  id?: number;
  pageKey?: string;
  sectionKey?: string;
  title?: string | null;
  subtitle?: string | null;
  bodyMd?: string | null;
  metaJson?: string | null;
  status?: string;
  sortOrder?: number;
};

export function AboutSectionForm({
  value,
  title,
  errorMessage,
  sectionKeyOptions,
}: {
  value?: AboutSectionValue | null;
  title: string;
  errorMessage?: string;
  sectionKeyOptions: SelectOption[];
}) {
  const defaultSectionKey = value?.sectionKey || sectionKeyOptions[0]?.value || "hero";
  const config = getAboutSectionConfig(defaultSectionKey);
  const isEditing = Boolean(value?.id);

  return (
    <form
      key={value?.id ? `about-section-${value.id}` : "about-section-new"}
      action={savePageSectionAction}
      className="space-y-6 rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm"
    >
      <FormSection title={title} description={config.description}>
        <AdminErrorBanner message={errorMessage} />
      </FormSection>

      {value?.id ? <input type="hidden" name="id" value={value.id} /> : null}
      <input type="hidden" name="pageKey" value="about" />
      <input type="hidden" name="sortOrder" value={value?.sortOrder ?? 0} />
      <input type="hidden" name="returnTo" value={value?.id ? `/admin/about/${value.id}` : "/admin/about/new"} />

      <div className="grid gap-4 md:grid-cols-2">
        {isEditing ? (
          <>
            <input type="hidden" name="sectionKey" value={defaultSectionKey} />
            <Field label="Section Key" name="sectionKeyReadOnly" defaultValue={defaultSectionKey} className="pointer-events-none opacity-80" />
          </>
        ) : (
          <SelectField
            label="Section Slot"
            name="sectionKey"
            defaultValue={defaultSectionKey}
            options={sectionKeyOptions}
          />
        )}

        <SelectField label="Status" name="status" defaultValue={value?.status || "draft"} options={STATUS_OPTIONS} />
      </div>

      <Field label={config.titleLabel || "Title"} name="title" defaultValue={value?.title || ""} />
      <Field label={config.subtitleLabel || "Subtitle"} name="subtitle" defaultValue={value?.subtitle || ""} />
      <MarkdownBodyField
        label={config.bodyLabel || "Content (Markdown)"}
        name="bodyMd"
        defaultValue={value?.bodyMd}
        rows={10}
      />
      <TextareaField
        label={config.metaLabel || "Meta JSON"}
        name="metaJson"
        defaultValue={value?.metaJson || ""}
        rows={8}
        textareaClassName="font-mono text-[0.9em]"
      />
      {config.metaHint ? <p className="text-sm text-[#666666]">{config.metaHint}</p> : null}

      <AdminFormSubmitButton>Save section</AdminFormSubmitButton>
    </form>
  );
}
