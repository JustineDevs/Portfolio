import { savePageSectionAction } from "@/app/admin/actions";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { AdminErrorBanner, Field, TextareaField } from "@/components/admin/FormPrimitives";
import { MarkdownBodyField } from "@/components/admin/MarkdownBodyField";
import { adminInputControlClass } from "@/components/admin/admin-styles";
import { listPageSectionsForAdmin } from "@/lib/content/admin";
import { cn } from "@/lib/utils";

const ABOUT_SECTION_CONFIG: Record<
  string,
  {
    label: string;
    description: string;
    titleLabel?: string;
    subtitleLabel?: string;
    bodyLabel?: string;
    metaLabel?: string;
    metaHint?: string;
  }
> = {
  hero: {
    label: "Hero",
    description: "Personal opener. Use this for who you are, the page framing, and the image that sets the tone.",
    titleLabel: "Headline",
    subtitleLabel: "Subheadline",
    bodyLabel: "Optional body (Markdown)",
    metaLabel: "Meta JSON",
    metaHint: `Example: { "imageUrl": "/Justinedevs_Banner.png" }`,
  },
  reading_map: {
    label: "Left Rail / Reading Map",
    description:
      "Personal navigation context. Good for a date, short intro, and panels that map your principles, methodology, learning, or under-the-hood themes.",
    titleLabel: "Sidebar heading",
    subtitleLabel: "Sidebar subheading",
    bodyLabel: "Top meta line (Markdown)",
    metaLabel: "Panels JSON",
    metaHint:
      'Example: { "panels": [{ "id": "principles", "title": "/Principles", "description": "How I think", "heading": "How I think", "intro": "Short intro...", "points": ["Point one"] }] }',
  },
  narrative: {
    label: "Primary Narrative",
    description:
      "Main personal content area. Use it for your story, learning path, experience arcs, or what shaped how you work.",
    titleLabel: "Section title",
    bodyLabel: "Content (Markdown)",
  },
  principles: {
    label: "Principles / Methodology",
    description:
      "Secondary narrative area. Use it for principles, methodologies, operating rules, under-the-hood process, or how you approach work.",
    titleLabel: "Section title",
    bodyLabel: "Content (Markdown)",
  },
  learning: {
    label: "Column One",
    description:
      "Flexible personal column. Good for strengths, lessons learned, things you are exploring, or what you are optimizing for.",
    titleLabel: "Column title",
    bodyLabel: "Content (Markdown)",
  },
  under_the_hood: {
    label: "Column Two",
    description:
      "Flexible personal column. Good for mental models, philosophy, technical taste, or how you reason under the hood.",
    titleLabel: "Column title",
    bodyLabel: "Content (Markdown)",
  },
  north_star: {
    label: "Column Three",
    description:
      "Flexible personal column. Good for vision, what you care about, long-term direction, or the future you want to build toward.",
    titleLabel: "Column title",
    bodyLabel: "Content (Markdown)",
  },
};

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
        <h1 className="text-2xl font-bold tracking-tight text-[#424242]">About / Personal Page</h1>
        <p className="mt-2 text-sm text-[#666666]">
          This CMS is for personal editorial content: story, learning, experience, principles, philosophy,
          methodologies, and under-the-hood thinking.
        </p>
        <p className="mt-2 text-sm text-[#666666]">
          The section keys are layout slots, not rigid resume fields. Repurpose the content inside each slot as needed.
        </p>
        <AdminErrorBanner message={errorMessage} />
      </section>

      {sections.map((section) => (
        (() => {
          const config = ABOUT_SECTION_CONFIG[section.sectionKey] ?? {
            label: section.sectionKey,
            description: "Flexible About page slot.",
            titleLabel: "Title",
            subtitleLabel: "Subtitle",
            bodyLabel: "Content (Markdown)",
            metaLabel: "Meta JSON",
          };

          return (
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
                  <h2 className="text-lg font-semibold text-[#424242]">{config.label}</h2>
                  <p className="mt-1 text-sm text-[#666666]">{config.description}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#8a8a8a]">Key: {section.sectionKey}</p>
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

              <Field label={config.titleLabel || "Title"} name="title" defaultValue={section.title || ""} />
              <Field
                label={config.subtitleLabel || "Subtitle"}
                name="subtitle"
                defaultValue={section.subtitle || ""}
              />
              <MarkdownBodyField
                label={config.bodyLabel || "Content (Markdown)"}
                name="bodyMd"
                defaultValue={section.bodyMd}
                rows={8}
              />
              <TextareaField
                label={config.metaLabel || "Meta JSON"}
                name="metaJson"
                defaultValue={section.metaJson || ""}
                rows={8}
                textareaClassName="font-mono text-[0.9em]"
              />
              {config.metaHint ? <p className="text-sm text-[#666666]">{config.metaHint}</p> : null}

              <AdminFormSubmitButton>Save section</AdminFormSubmitButton>
            </form>
          );
        })()
      ))}
    </main>
  );
}
