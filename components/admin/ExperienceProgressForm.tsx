"use client";

import { useMemo, useState } from "react";
import { saveExperienceProgressAction } from "@/app/admin/actions";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { AdminErrorBanner, FormSection, SelectField, type SelectOption } from "@/components/admin/FormPrimitives";
import { EXPERIENCE_TECH_OPTIONS, type ExperienceProgressEntry } from "@/lib/content/experience-progress";

type ProjectOption = { value: string; label: string; description: string };

const statusOptions: SelectOption[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

function createEntry(): ExperienceProgressEntry {
  return {
    id: `entry-${Date.now()}`,
    year: new Date().getFullYear().toString(),
    company: "",
    status: "CURRENT",
    role: "",
    description: "",
    logoUrl: null,
    logoKey: null,
    project: "",
    projectDescription: "",
    icons: [],
  };
}

export function ExperienceProgressForm({
  value,
  projectOptions,
  errorMessage,
}: {
  value: { id?: number; sectionKey?: string; title?: string | null; subtitle?: string | null; metaJson?: string | null; status?: string; sortOrder?: number };
  projectOptions: ProjectOption[];
  errorMessage?: string;
}) {
  const initialEntries = useMemo(() => {
    try {
      const parsed = value.metaJson ? JSON.parse(value.metaJson) as { entries?: ExperienceProgressEntry[] } : {};
      return Array.isArray(parsed.entries) ? parsed.entries : [];
    } catch {
      return [];
    }
  }, [value.metaJson]);
  const [entries, setEntries] = useState<ExperienceProgressEntry[]>(initialEntries);

  const updateEntry = (index: number, patch: Partial<ExperienceProgressEntry>) => {
    setEntries((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, ...patch } : entry));
  };

  const selectProject = (index: number, project: string) => {
    const option = projectOptions.find((item) => item.value === project);
    updateEntry(index, { project, projectDescription: option?.description || "" });
  };

  const toggleTech = (index: number, key: string, name: string) => {
    setEntries((current) => current.map((entry, entryIndex) => {
      if (entryIndex !== index) return entry;
      const exists = entry.icons.some((icon) => icon.key === key);
      return {
        ...entry,
        icons: exists ? entry.icons.filter((icon) => icon.key !== key) : [...entry.icons, { key, name }],
      };
    }));
  };

  return (
    <form action={saveExperienceProgressAction} className="space-y-8 rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
      <FormSection title="Experience / Progress" description="Add a timeline entry by filling in the fields below. The public timeline template stays unchanged.">
        <AdminErrorBanner message={errorMessage} />
      </FormSection>
      <input type="hidden" name="id" value={value.id || ""} />
      <input type="hidden" name="pageKey" value="experience" />
      <input type="hidden" name="sectionKey" value="progress" />
      <input type="hidden" name="sortOrder" value={value.sortOrder || 0} />
      <input type="hidden" name="returnTo" value={`/admin/experience/${value.id || ""}`} />
      <input type="hidden" name="entriesJson" value={JSON.stringify(entries)} readOnly />
      <SelectField label="Publication status" name="status" defaultValue={value.status || "draft"} options={statusOptions} />

      <div className="space-y-6">
        {entries.map((entry, index) => (
          <fieldset key={entry.id} className="space-y-5 rounded-xl border border-[#d5d5d5] bg-[#f8f8f8] p-5">
            <legend className="px-2 text-sm font-semibold text-[#424242]">Timeline entry {index + 1}</legend>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#424242]">Status tag</span>
                <input value={entry.status} onChange={(event) => updateEntry(index, { status: event.target.value })} className="h-11 w-full rounded-lg border border-[#d5d5d5] bg-white px-3 text-sm text-[#424242]" required />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#424242]">Year</span>
                <input value={entry.year} onChange={(event) => updateEntry(index, { year: event.target.value })} className="h-11 w-full rounded-lg border border-[#d5d5d5] bg-white px-3 text-sm text-[#424242]" required />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#424242]">Title</span>
              <input value={entry.company} onChange={(event) => updateEntry(index, { company: event.target.value })} className="h-11 w-full rounded-lg border border-[#d5d5d5] bg-white px-3 text-sm text-[#424242]" required />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#424242]">Role</span>
              <input value={entry.role} onChange={(event) => updateEntry(index, { role: event.target.value })} className="h-11 w-full rounded-lg border border-[#d5d5d5] bg-white px-3 text-sm text-[#424242]" required />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#424242]">Description</span>
              <textarea value={entry.description} onChange={(event) => updateEntry(index, { description: event.target.value })} rows={4} className="w-full resize-y rounded-lg border border-[#d5d5d5] bg-white px-3 py-3 text-sm text-[#424242]" required />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#424242]">Project</span>
              <select value={entry.project} onChange={(event) => selectProject(index, event.target.value)} className="h-11 w-full cursor-pointer rounded-lg border border-[#d5d5d5] bg-white px-3 text-sm text-[#424242]" required>
                <option value="">Select a project</option>
                {entry.project && !projectOptions.some((option) => option.value === entry.project) ? <option value={entry.project}>{entry.project}</option> : null}
                {projectOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <div>
              <span className="mb-2 block text-sm font-medium text-[#424242]">Tech Stack</span>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {EXPERIENCE_TECH_OPTIONS.map((tech) => {
                  const checked = entry.icons.some((icon) => icon.key === tech.key);
                  return <label key={tech.key} className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#d5d5d5] bg-white px-3 py-2 text-xs text-[#424242]"><input type="checkbox" checked={checked} onChange={() => toggleTech(index, tech.key, tech.name)} className="h-4 w-4" />{tech.name}</label>;
                })}
              </div>
            </div>
            {entries.length > 1 ? <button type="button" onClick={() => setEntries((current) => current.filter((_, entryIndex) => entryIndex !== index))} className="text-sm font-medium text-[#777b82] underline-offset-2 hover:text-[#18181b] hover:underline">Remove entry</button> : null}
          </fieldset>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setEntries((current) => [...current, createEntry()])} className="rounded-lg border border-[#d5d5d5] bg-white px-4 py-2.5 text-sm font-medium text-[#424242] hover:bg-[#f8f8f8]">Add progress entry</button>
        <AdminFormSubmitButton>Save progress</AdminFormSubmitButton>
      </div>
    </form>
  );
}
