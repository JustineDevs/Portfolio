"use client";

import { useState } from "react";

import { adminInputControlClass } from "@/components/admin/admin-styles";
import MarkdownContent from "@/components/content/MarkdownContent";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  required?: boolean;
};

export function MarkdownBodyField({ label, name, defaultValue, rows = 10, required = false }: Props) {
  const [value, setValue] = useState(() => defaultValue ?? "");
  const trimmed = value.trim();

  return (
    <div className="space-y-2">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start lg:gap-6">
        <label className="block min-w-0">
          <span className="mb-2 block text-sm font-medium text-[#424242]">{label}</span>
          <textarea
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={rows}
            required={required}
            className={cn(adminInputControlClass, "min-h-[12rem] resize-y font-mono text-[0.9em]")}
            spellCheck={false}
          />
        </label>

        <div className="flex min-h-0 min-w-0 flex-col lg:sticky lg:top-4">
          <span className="mb-2 block text-sm font-medium text-[#424242]">Live preview</span>
          <div
            className="max-h-[min(70vh,36rem)] min-h-[12rem] flex-1 overflow-auto rounded-xl border border-[#d5d5d5] bg-[#fafafa] p-4 shadow-inner"
            aria-live="polite"
            aria-label="Markdown preview"
          >
            {trimmed.length === 0 ? (
              <p className="text-sm italic text-[#888888]">Nothing to preview yet.</p>
            ) : (
              <MarkdownContent markdown={value} variant="admin" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
