"use client";

import { useEffect, useMemo, useState } from "react";

import { saveHighlightAction } from "@/app/admin/actions";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import {
  AdminErrorBanner,
  CheckboxField,
  Field,
  type SelectOption,
  SelectField,
  TextareaField,
} from "@/components/admin/FormPrimitives";
import {
  getDefaultPlacementKeyForType,
  getPlacementOptionsForType,
  type HighlightPlacementKey,
  type HighlightType,
} from "@/lib/content/highlight-placement";

const HIGHLIGHT_TYPE_OPTIONS: SelectOption[] = [
  { value: "testimonial", label: "Testimonial" },
  { value: "award", label: "Award" },
  { value: "custom", label: "Manual Card" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

type HighlightValue = {
  id?: number;
  highlightType?: string;
  placementKey?: string | null;
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
  testimonial: SelectOption[];
  award: SelectOption[];
};

export function HighlightForm({
  value,
  targetOptions,
  formKey,
  errorMessage,
  savedMessage,
}: {
  value?: HighlightValue | null;
  targetOptions: TargetOptionMap;
  formKey: string;
  errorMessage?: string;
  savedMessage?: string;
}) {
  const initialType =
    value?.highlightType === "testimonial" || value?.highlightType === "award" || value?.highlightType === "custom"
      ? (value.highlightType as HighlightType)
      : "custom";
  const [highlightType, setHighlightType] = useState<HighlightType>(initialType);
  const [placementKey, setPlacementKey] = useState<string>(
    value?.placementKey || getDefaultPlacementKeyForType(initialType),
  );
  const [targetId, setTargetId] = useState(value?.targetId ? String(value.targetId) : "0");

  const currentTargetOptions = useMemo(() => {
    if (highlightType === "testimonial") return targetOptions.testimonial;
    if (highlightType === "award") return targetOptions.award;
    return [];
  }, [highlightType, targetOptions]);
  const currentPlacementOptions = useMemo(() => getPlacementOptionsForType(highlightType), [highlightType]);

  const targetDescription =
    highlightType === "custom"
      ? "Manual cards do not require a linked content item."
      : `Choose the published ${highlightType} this highlight should be strictly bound to.`;
  const hasTargets = currentTargetOptions.length > 0;

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

  useEffect(() => {
    const stillValid = currentPlacementOptions.some((option) => option.value === placementKey);
    if (!stillValid) {
      setPlacementKey(getDefaultPlacementKeyForType(highlightType));
    }
  }, [currentPlacementOptions, highlightType, placementKey]);

  return (
    <form
      key={value ? value.id : `new-${highlightType}`}
      action={saveHighlightAction}
      className="space-y-4 rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="returnTo" value={`/admin/highlights?form=${encodeURIComponent(formKey)}`} />
      {value ? <input type="hidden" name="id" value={value.id} /> : null}
      <input type="hidden" name="formKey" value={formKey} />
      {savedMessage ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {savedMessage}
        </p>
      ) : null}
      <AdminErrorBanner message={errorMessage} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#424242]">Type</span>
          <select
            name="highlightType"
            value={highlightType}
            onChange={(event) => setHighlightType(event.target.value as HighlightType)}
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
          <span className="mb-2 block text-sm font-medium text-[#424242]">Placement</span>
          <select
            name="placementKey"
            value={placementKey}
            onChange={(event) => setPlacementKey(event.target.value as HighlightPlacementKey)}
            className="w-full rounded-lg border border-[#d5d5d5] bg-white px-3 py-2 text-sm text-[#424242]"
          >
            {currentPlacementOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

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
      {!hasTargets && highlightType !== "custom" ? (
        <p className="text-sm text-[#9f2d2d]">
          No published {highlightType}s are available to target yet. You can still save a manual card using the override fields below.
        </p>
      ) : null}

      <TextareaField
        label="Summary Override"
        name="summaryOverride"
        defaultValue={value?.summaryOverride || ""}
        rows={4}
      />
      <p className="text-sm text-[#666666]">
        Highlights now support only `testimonial`, `award`, and `manual card`, and they feed only the Experience testimonials/awards lanes.
      </p>
      <CheckboxField label="Pinned" name="pinned" defaultChecked={value?.pinned} />
      <AdminFormSubmitButton>{value ? "Save highlight" : "Create highlight"}</AdminFormSubmitButton>
    </form>
  );
}
