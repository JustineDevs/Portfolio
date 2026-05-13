"use client";

import { useEffect, useMemo, useState } from "react";

import { saveHighlightAction } from "@/app/admin/actions";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import {
  CheckboxField,
  Field,
  type SelectOption,
  SelectField,
  TextareaField,
} from "@/components/admin/FormPrimitives";

const HIGHLIGHT_TYPE_OPTIONS: SelectOption[] = [
  { value: "project", label: "Project" },
  { value: "post", label: "Post" },
  { value: "testimonial", label: "Testimonial" },
  { value: "award", label: "Award" },
  { value: "custom", label: "Certificate" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

type HighlightValue = {
  id?: number;
  highlightType?: string;
  targetId?: number | null;
  titleOverride?: string | null;
  summaryOverride?: string | null;
  imageUrlOverride?: string | null;
  linkOverride?: string | null;
  pinned?: boolean;
  status?: string;
  sortOrder?: number;
};

type TargetOptionMap = {
  project: SelectOption[];
  post: SelectOption[];
  testimonial: SelectOption[];
  award: SelectOption[];
};

export function HighlightForm({
  value,
  targetOptions,
}: {
  value?: HighlightValue | null;
  targetOptions: TargetOptionMap;
}) {
  const [highlightType, setHighlightType] = useState(value?.highlightType || "custom");
  const [targetId, setTargetId] = useState(value?.targetId ? String(value.targetId) : "0");

  const currentTargetOptions = useMemo(() => {
    if (highlightType === "project") return targetOptions.project;
    if (highlightType === "post") return targetOptions.post;
    if (highlightType === "testimonial") return targetOptions.testimonial;
    if (highlightType === "award") return targetOptions.award;
    return [];
  }, [highlightType, targetOptions]);

  const targetDescription =
    highlightType === "custom"
      ? "Certificates are manual cards and do not require a linked content item."
      : `Choose the published ${highlightType} this highlight should be strictly bound to.`;

  useEffect(() => {
    if (highlightType === "custom") {
      setTargetId("0");
      return;
    }

    const stillValid = currentTargetOptions.some((option) => option.value === targetId);
    if (!stillValid) {
      setTargetId("0");
    }
  }, [highlightType, currentTargetOptions, targetId]);

  return (
    <form
      key={value ? value.id : `new-${highlightType}`}
      action={saveHighlightAction}
      className="space-y-4 rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm"
    >
      {value ? <input type="hidden" name="id" value={value.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#424242]">Type</span>
          <select
            name="highlightType"
            value={highlightType}
            onChange={(event) => setHighlightType(event.target.value)}
            className="w-full rounded-lg border border-[#d5d5d5] bg-white px-3 py-2 text-sm text-[#424242]"
          >
            {HIGHLIGHT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <SelectField label="Status" name="status" defaultValue={value?.status || "draft"} options={STATUS_OPTIONS} />

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#424242]">Target</span>
          <select
            name="targetId"
            value={targetId}
            onChange={(event) => setTargetId(event.target.value)}
            className="w-full rounded-lg border border-[#d5d5d5] bg-white px-3 py-2 text-sm text-[#424242]"
          >
            <option value="0">{highlightType === "custom" ? "None" : `Select ${highlightType}`}</option>
            {currentTargetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <Field label="Sort Order" name="sortOrder" defaultValue={String(value?.sortOrder ?? 0)} />

        <Field label="Title Override" name="titleOverride" defaultValue={value?.titleOverride || ""} />
        <Field label="Link Override" name="linkOverride" defaultValue={value?.linkOverride || ""} />
        <Field label="Logo / Image Override" name="imageUrlOverride" defaultValue={value?.imageUrlOverride || ""} />
      </div>

      <p className="text-sm text-[#666666]">{targetDescription}</p>

      <TextareaField
        label="Summary Override"
        name="summaryOverride"
        defaultValue={value?.summaryOverride || ""}
        rows={4}
      />
      <p className="text-sm text-[#666666]">
        Type rules: `project` feeds Proof of Work; `post` feeds Writing; `testimonial` feeds Testimonials; `award` feeds Awards; `custom` is reserved for Certificates.
      </p>
      <CheckboxField label="Pinned" name="pinned" defaultChecked={value?.pinned} />
      <AdminFormSubmitButton>{value ? "Save highlight" : "Create highlight"}</AdminFormSubmitButton>
    </form>
  );
}
