"use client";

import { useState } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

import { adminInputControlClass } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

const previewComponents: Partial<Components> = {
  h1: ({ children }) => (
    <h3 className="mt-4 border-b border-[#e5e5e5] pb-1 text-xl font-bold text-[#222] first:mt-0">{children}</h3>
  ),
  h2: ({ children }) => <h4 className="mt-3 text-lg font-semibold text-[#2a2a2a] first:mt-0">{children}</h4>,
  h3: ({ children }) => <h5 className="mt-3 text-base font-semibold text-[#333] first:mt-0">{children}</h5>,
  p: ({ children }) => <p className="mt-2 text-[#424242] leading-relaxed first:mt-0">{children}</p>,
  ul: ({ children }) => <ul className="mt-2 list-disc space-y-1 pl-5 text-[#424242] first:mt-0">{children}</ul>,
  ol: ({ children }) => <ol className="mt-2 list-decimal space-y-1 pl-5 text-[#424242] first:mt-0">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-[#1342FF] underline decoration-[#1342FF]/40 underline-offset-2 hover:decoration-[#1342FF]"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const isFenced = typeof className === "string" && className.includes("language-");
    if (isFenced) {
      return <code className={cn("block whitespace-pre font-mono text-[0.85em] text-[#333]", className)}>{children}</code>;
    }
    return <code className="rounded bg-[#ececec] px-1.5 py-0.5 font-mono text-[0.9em] text-[#333]">{children}</code>;
  },
  pre: ({ children }) => (
    <pre className="mt-2 overflow-x-auto rounded-lg border border-[#e8e8e8] bg-[#f4f4f4] p-3 text-[0.85em] first:mt-0">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-2 border-l-4 border-[#ccc] pl-3 text-[#555] italic first:mt-0">{children}</blockquote>
  ),
  hr: () => <hr className="my-4 border-[#e0e0e0]" />,
  strong: ({ children }) => <strong className="font-semibold text-[#222]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
};

function MarkdownPreview({ markdown }: { markdown: string }) {
  return (
    <div className="admin-md-preview text-sm">
      <ReactMarkdown components={previewComponents}>{markdown}</ReactMarkdown>
    </div>
  );
}

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
              <MarkdownPreview markdown={value} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
