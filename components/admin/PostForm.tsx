import { savePostAction } from "@/app/admin/actions";
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

const POST_TYPE_OPTIONS: SelectOption[] = [
  { value: "native", label: "Native (on-site article)" },
  { value: "external", label: "External (summary + link out)" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

type PostFormValue = {
  id?: number;
  slug?: string;
  title?: string;
  summary?: string;
  bodyMd?: string | null;
  postType?: string;
  sourcePlatform?: string | null;
  canonicalUrl?: string | null;
  coverImageUrl?: string | null;
  status?: string;
  publishedAt?: string | null;
  featured?: boolean;
};

export function PostForm({
  value,
  title,
  errorMessage,
}: {
  value?: PostFormValue | null;
  title: string;
  errorMessage?: string;
}) {
  return (
    <form
      key={value?.id ? `post-${value.id}` : "post-new"}
      action={savePostAction}
      className="space-y-6 rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm"
    >
      <FormSection
        title={title}
        description="Use Native for full on-site articles and External for summaries that point to social posts or outside writing."
      >
        <AdminErrorBanner message={errorMessage} />
      </FormSection>

      {value?.id ? <input type="hidden" name="id" value={value.id} /> : null}
      <input type="hidden" name="returnTo" value={value?.id ? `/admin/writing/${value.id}` : "/admin/writing/new"} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Slug" name="slug" defaultValue={value?.slug} required />
        <Field label="Title" name="title" defaultValue={value?.title} required />
        <SelectField label="Post Type" name="postType" defaultValue={value?.postType || "native"} options={POST_TYPE_OPTIONS} />
        <SelectField label="Status" name="status" defaultValue={value?.status || "draft"} options={STATUS_OPTIONS} />
        <Field label="Source Platform" name="sourcePlatform" defaultValue={value?.sourcePlatform || ""} />
        <Field label="Canonical URL" name="canonicalUrl" defaultValue={value?.canonicalUrl || ""} />
        <Field label="Cover Image URL" name="coverImageUrl" defaultValue={value?.coverImageUrl || ""} />
        <Field label="Published At" name="publishedAt" defaultValue={value?.publishedAt || ""} />
      </div>

      <TextareaField label="Summary" name="summary" defaultValue={value?.summary} required rows={4} />
      <MarkdownBodyField label="Body Markdown" name="bodyMd" defaultValue={value?.bodyMd} rows={12} />

      <CheckboxField label="Featured" name="featured" defaultChecked={value?.featured} />

      <AdminFormSubmitButton>Save post</AdminFormSubmitButton>
    </form>
  );
}
