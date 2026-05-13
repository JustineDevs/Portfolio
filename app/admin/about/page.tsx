import { savePageSectionAction } from "@/app/admin/actions";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { AdminErrorBanner, Field, TextareaField } from "@/components/admin/FormPrimitives";
import { MarkdownBodyField } from "@/components/admin/MarkdownBodyField";
import { adminInputControlClass } from "@/components/admin/admin-styles";
import { listPageSectionsForAdmin } from "@/lib/content/admin";
import { cn } from "@/lib/utils";

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const sections = await listPageSectionsForAdmin("about");
  const errorMessage = searchParams?.error;

  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-[#424242]">About</h1>
        <p className="mt-2 text-sm text-[#666666]">Edit grouped About page sections without a page builder.</p>
        <AdminErrorBanner message={errorMessage} />
      </section>

      {sections.map((section) => (
        <form
          key={section.id}
          action={savePageSectionAction}
          className="space-y-4 rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm"
        >
          <input type="hidden" name="id" value={section.id} />
          <input type="hidden" name="pageKey" value={section.pageKey} />
          <input type="hidden" name="sectionKey" value={section.sectionKey} />
          <input type="hidden" name="sortOrder" value={section.sortOrder} />

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[#424242]">{section.sectionKey}</h2>
              <p className="text-sm text-[#666666]">Status: {section.status}</p>
            </div>
            <label className="block min-w-[10rem] max-w-xs flex-1">
              <span className="mb-2 block text-sm font-medium text-[#424242]">Status</span>
              <select
                name="status"
                defaultValue={section.status}
                className={cn(adminInputControlClass, "cursor-pointer")}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>

          <Field label="Title" name="title" defaultValue={section.title || ""} />
          <Field label="Subtitle" name="subtitle" defaultValue={section.subtitle || ""} />
          <MarkdownBodyField label="Body (Markdown)" name="bodyMd" defaultValue={section.bodyMd} rows={8} />
          <TextareaField
            label="Meta JSON"
            name="metaJson"
            defaultValue={section.metaJson || ""}
            rows={8}
            textareaClassName="font-mono text-[0.9em]"
          />

          <AdminFormSubmitButton>Save section</AdminFormSubmitButton>
        </form>
      ))}
    </main>
  );
}
