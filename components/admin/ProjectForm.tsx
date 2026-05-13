import { saveProjectAction } from "@/app/admin/actions";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import {
  AdminErrorBanner,
  CheckboxField,
  Field,
  FormSection,
  SelectField,
  type SelectOption,
  TextareaField,
} from "@/components/admin/FormPrimitives";
import { MarkdownBodyField } from "@/components/admin/MarkdownBodyField";

const STATUS_OPTIONS: SelectOption[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

type ProjectFormValue = {
  id?: number;
  slug?: string;
  title?: string;
  summary?: string;
  bodyMd?: string | null;
  category?: string;
  status?: string;
  publishedAt?: string | null;
  featured?: boolean;
  coverImageUrl?: string | null;
  bannerImageUrl?: string | null;
  authorName?: string;
  authorUrl?: string | null;
  websiteUrl?: string | null;
  sortOrder?: number;
  tags?: string[];
  technologies?: string[];
  responsibilities?: string[];
  networks?: string[];
  links?: { type: string; label?: string; url: string }[];
};

export function ProjectForm({
  value,
  title,
  errorMessage,
}: {
  value?: ProjectFormValue | null;
  title: string;
  errorMessage?: string;
}) {
  return (
    <form
      key={value?.id ? `project-${value.id}` : "project-new"}
      action={saveProjectAction}
      className="space-y-6 rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm"
    >
      <FormSection
        title={title}
        description="Comma-separated lists are supported for tags, technologies, responsibilities, and networks. Links use `type | label | url`, one per line."
      >
        <AdminErrorBanner message={errorMessage} />
      </FormSection>

      {value?.id ? <input type="hidden" name="id" value={value.id} /> : null}
      <input type="hidden" name="returnTo" value={value?.id ? `/admin/projects/${value.id}` : "/admin/projects/new"} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Slug" name="slug" defaultValue={value?.slug} required />
        <Field label="Title" name="title" defaultValue={value?.title} required />
        <Field label="Category" name="category" defaultValue={value?.category} required />
        <Field label="Published At" name="publishedAt" defaultValue={value?.publishedAt || ""} />
        <Field label="Author Name" name="authorName" defaultValue={value?.authorName} required />
        <Field label="Author URL" name="authorUrl" defaultValue={value?.authorUrl || ""} />
        <Field label="Website URL" name="websiteUrl" defaultValue={value?.websiteUrl || ""} />
        <Field label="Cover Image URL" name="coverImageUrl" defaultValue={value?.coverImageUrl || ""} />
        <Field label="Banner Image URL" name="bannerImageUrl" defaultValue={value?.bannerImageUrl || ""} />
        <Field label="Sort Order" name="sortOrder" defaultValue={String(value?.sortOrder ?? 0)} />
        <SelectField label="Status" name="status" defaultValue={value?.status || "draft"} options={STATUS_OPTIONS} />
        <CheckboxField label="Featured" name="featured" defaultChecked={value?.featured} />
      </div>

      <TextareaField label="Summary" name="summary" defaultValue={value?.summary} required rows={4} />
      <MarkdownBodyField label="Body Markdown" name="bodyMd" defaultValue={value?.bodyMd} rows={10} />

      <div className="grid gap-4 md:grid-cols-2">
        <TextareaField label="Tags" name="tags" defaultValue={(value?.tags || []).join(", ")} rows={4} />
        <TextareaField label="Technologies" name="technologies" defaultValue={(value?.technologies || []).join(", ")} rows={4} />
        <TextareaField label="Responsibilities" name="responsibilities" defaultValue={(value?.responsibilities || []).join("\n")} rows={6} />
        <TextareaField label="Networks" name="networks" defaultValue={(value?.networks || []).join(", ")} rows={4} />
      </div>

      <TextareaField
        label="Links"
        name="links"
        defaultValue={(value?.links || [])
          .map((link) => `${link.type} | ${link.label || ""} | ${link.url}`)
          .join("\n")}
        rows={6}
      />

      <div className="flex items-center gap-3">
        <AdminFormSubmitButton>Save project</AdminFormSubmitButton>
      </div>
    </form>
  );
}
