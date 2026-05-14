import { saveCertificateAction } from "@/app/admin/actions";
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

const STATUS_OPTIONS: SelectOption[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

type CertificateFormValue = {
  id?: number;
  slug?: string;
  title?: string;
  issuer?: string | null;
  description?: string;
  proofUrl?: string | null;
  logoUrl?: string | null;
  status?: string;
  featured?: boolean;
  sortOrder?: number;
};

export function CertificateForm({
  value,
  title,
  errorMessage,
}: {
  value?: CertificateFormValue | null;
  title: string;
  errorMessage?: string;
}) {
  return (
    <form
      key={value?.id ? `certificate-${value.id}` : "certificate-new"}
      action={saveCertificateAction}
      className="space-y-6 rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm"
    >
      <FormSection
        title={title}
        description="Manage formal certificate records separately from manual highlights."
      >
        <AdminErrorBanner message={errorMessage} />
      </FormSection>

      {value?.id ? <input type="hidden" name="id" value={value.id} /> : null}
      <input type="hidden" name="returnTo" value={value?.id ? `/admin/certificates/${value.id}` : "/admin/certificates/new"} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Slug" name="slug" defaultValue={value?.slug} required />
        <Field label="Title" name="title" defaultValue={value?.title} required />
        <Field label="Issuer" name="issuer" defaultValue={value?.issuer || ""} />
        <SelectField label="Status" name="status" defaultValue={value?.status || "draft"} options={STATUS_OPTIONS} />
        <Field label="Proof URL" name="proofUrl" defaultValue={value?.proofUrl || ""} />
        <Field label="Logo URL" name="logoUrl" defaultValue={value?.logoUrl || ""} />
        <Field label="Sort Order" name="sortOrder" defaultValue={String(value?.sortOrder ?? 0)} />
      </div>

      <TextareaField label="Description" name="description" defaultValue={value?.description} required rows={5} />

      <CheckboxField label="Featured" name="featured" defaultChecked={value?.featured} />

      <AdminFormSubmitButton>Save certificate</AdminFormSubmitButton>
    </form>
  );
}
