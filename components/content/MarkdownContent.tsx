"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { rehypeGithubAlerts } from "rehype-github-alerts";

import { normalizeAssetUrl } from "@/lib/asset-urls";
import { cn } from "@/lib/utils";

type Variant = "page" | "admin";

type Props = {
  markdown: string;
  variant?: Variant;
  className?: string;
};

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function getAlertClasses(className: string) {
  if (className.includes("markdown-alert-note")) {
    return "border-[#B9D6FF] bg-[#F4F8FF] text-[#244066]";
  }
  if (className.includes("markdown-alert-tip")) {
    return "border-[#BFE7CE] bg-[#F4FBF6] text-[#204E33]";
  }
  if (className.includes("markdown-alert-important")) {
    return "border-[#D2C4FF] bg-[#F7F4FF] text-[#41306D]";
  }
  if (className.includes("markdown-alert-warning")) {
    return "border-[#FFD8A8] bg-[#FFF7ED] text-[#7A4217]";
  }
  if (className.includes("markdown-alert-caution")) {
    return "border-[#F6B5B5] bg-[#FFF4F4] text-[#7A2323]";
  }
  return "border-[#d5d5d5] bg-[#fafafa] text-[#424242]";
}

function getMarkdownComponents(variant: Variant): Partial<Components> {
  const proseText = variant === "page" ? "text-[15px] sm:text-[16px]" : "text-sm";

  return {
    h1: ({ children }) => (
      <h1 className="mt-8 border-b border-[#e5e5e5] pb-2 text-3xl font-bold tracking-tight text-[#222222] first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-7 text-2xl font-bold tracking-tight text-[#2a2a2a] first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 text-xl font-semibold tracking-tight text-[#333333] first:mt-0">{children}</h3>
    ),
    h4: ({ children }) => <h4 className="mt-5 text-lg font-semibold text-[#333333] first:mt-0">{children}</h4>,
    p: ({ className, children }) => {
      if (typeof className === "string" && className.includes("markdown-alert-title")) {
        return (
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-current">
            {children}
          </p>
        );
      }

      return <p className={cn("mt-3 leading-[1.85] text-[#424242] first:mt-0", proseText)}>{children}</p>;
    },
    a: ({ href, children }) => {
      const resolvedHref = href ? normalizeAssetUrl(href) : "#";
      const external = isExternalHref(resolvedHref);

      return (
        <a
          href={resolvedHref}
          className="font-medium text-[#1342FF] underline decoration-[#1342FF]/35 underline-offset-2 hover:decoration-[#1342FF]"
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
    img: ({ src, alt }) => {
      const resolvedSrc = src ? normalizeAssetUrl(src) : "";
      if (!resolvedSrc) return null;

      return (
        <img
          src={resolvedSrc}
          alt={alt || ""}
          loading="lazy"
          className="mt-4 w-full rounded-xl border border-[#d5d5d5] bg-white object-cover first:mt-0"
        />
      );
    },
    ul: ({ children }) => <ul className={cn("mt-3 list-disc space-y-2 pl-5 text-[#424242] first:mt-0", proseText)}>{children}</ul>,
    ol: ({ children }) => <ol className={cn("mt-3 list-decimal space-y-2 pl-5 text-[#424242] first:mt-0", proseText)}>{children}</ol>,
    li: ({ children }) => <li className="leading-[1.8]">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className={cn("mt-4 border-l-4 border-[#d5d5d5] pl-4 italic text-[#555555] first:mt-0", proseText)}>
        {children}
      </blockquote>
    ),
    code: ({ className, children }: any) => {
      const content = String(children);
      const isInline = !(typeof className === "string" && className.includes("language-")) && !content.includes("\n");

      if (isInline) {
        return <code className="rounded bg-[#ececec] px-1.5 py-0.5 font-mono text-[0.9em] text-[#333333]">{children}</code>;
      }

      return <code className={cn("block whitespace-pre font-mono text-[0.85em] text-[#333333]", className)}>{children}</code>;
    },
    pre: ({ children }) => (
      <pre className="mt-4 overflow-x-auto rounded-xl border border-[#e5e5e5] bg-[#f6f6f6] p-4 text-[0.85em] first:mt-0">
        {children}
      </pre>
    ),
    hr: () => <hr className="my-6 border-[#e0e0e0]" />,
    table: ({ children }) => (
      <div className="mt-4 overflow-x-auto rounded-xl border border-[#d5d5d5] first:mt-0">
        <table className="min-w-full border-collapse bg-white text-left text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-[#f5f5f5] text-[#333333]">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr className="border-t border-[#e8e8e8]">{children}</tr>,
    th: ({ children }) => <th className="px-4 py-3 font-semibold">{children}</th>,
    td: ({ children }) => <td className="px-4 py-3 align-top text-[#424242]">{children}</td>,
    div: ({ className, children, ...props }: any) => {
      if (typeof className === "string" && className.includes("markdown-alert")) {
        return (
          <div
            {...props}
            className={cn(
              "mt-5 rounded-2xl border px-4 py-4 shadow-sm first:mt-0 [&_.octicon]:shrink-0",
              getAlertClasses(className),
            )}
          >
            {children}
          </div>
        );
      }

      return (
        <div {...props} className={className}>
          {children}
        </div>
      );
    },
    strong: ({ children }) => <strong className="font-semibold text-[#222222]">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  };
}

export default function MarkdownContent({ markdown, variant = "page", className }: Props) {
  const trimmed = markdown.trim();
  if (!trimmed) return null;

  return (
    <div className={cn("markdown-body text-[#424242]", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeGithubAlerts]}
        components={getMarkdownComponents(variant)}
      >
        {trimmed}
      </ReactMarkdown>
    </div>
  );
}
