import Link from "next/link";
import { ArrowUpRight, Inbox } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  published: "border-emerald-200 bg-emerald-50 text-emerald-700",
  connected: "border-emerald-200 bg-emerald-50 text-emerald-700",
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  draft: "border-amber-200 bg-amber-50 text-amber-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  archived: "border-slate-200 bg-slate-100 text-slate-600",
  error: "border-rose-200 bg-rose-50 text-rose-700",
  not_connected: "border-slate-200 bg-slate-100 text-slate-600",
};

export function AdminPageHeader({
  eyebrow = "Workspace",
  title,
  description,
  count,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  count?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 border-b border-[#e4e4e7] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#1342FF]">{eyebrow}</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[#18181b]">{title}</h1>
          {count ? <span className="text-xs font-medium text-[#a1a1aa]">{count}</span> : null}
        </div>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71717a]">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </section>
  );
}

export function AdminPrimaryAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#18181b] px-4 text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#27272a] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b]/25 focus-visible:ring-offset-2">
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </Link>
  );
}

export function AdminStatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase().replace(/\s+/g, "_");
  return (
    <span className={cn("inline-flex w-fit items-center rounded-full border px-2 py-1 text-[11px] font-semibold capitalize", statusStyles[normalized] ?? "border-[#e4e4e7] bg-[#fafafa] text-[#71717a]")}>{value.replace(/_/g, " ")}</span>
  );
}

export function AdminTable({ children, label }: { children: ReactNode; label: string }) {
  return <div role="region" aria-label={label} className="overflow-x-auto rounded-xl border border-[#e4e4e7] bg-white shadow-[0_8px_30px_rgba(24,24,27,0.04)]">{children}</div>;
}

export function AdminTableToolbar({
  search = "",
  placeholder = "Filter records...",
  filter,
  filterOptions = [],
}: {
  search?: string;
  placeholder?: string;
  filter?: string;
  filterOptions?: Array<{ value: string; label: string }>;
}) {
  return <form method="get" className="flex flex-col gap-3 border-b border-[#e4e4e7] p-4 sm:flex-row sm:items-center"><input name="q" defaultValue={search} placeholder={placeholder} className="min-h-11 min-w-0 flex-1 rounded-md border border-[#e4e4e7] bg-white px-3 text-sm text-[#18181b] outline-none placeholder:text-[#a1a1aa] focus:border-[#18181b] focus:ring-2 focus:ring-[#18181b]/10" />{filterOptions.length ? <select name="status" defaultValue={filter ?? ""} aria-label="Filter by status" className="min-h-11 rounded-md border border-[#e4e4e7] bg-white px-3 text-sm text-[#52525b] outline-none focus:border-[#18181b]"><option value="">All statuses</option>{filterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : null}<button type="submit" className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-[#e4e4e7] px-3 text-xs font-semibold text-[#52525b] transition-[background-color,transform] duration-150 hover:bg-[#fafafa] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b]/20 focus-visible:ring-offset-2">Search</button>{search || filter ? <Link href="?" className="inline-flex min-h-11 items-center justify-center rounded-md px-2 text-xs font-semibold text-[#71717a] hover:text-[#18181b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b]/20 focus-visible:ring-offset-2">Clear</Link> : null}</form>;
}

export function AdminTableHeader({ children }: { children: ReactNode }) {
  return <div className="hidden min-w-[720px] grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_140px_180px] gap-4 border-b border-[#e4e4e7] bg-[#fafafa] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#71717a] md:grid">{children}</div>;
}

export function AdminTableRow({ children }: { children: ReactNode }) {
  return <div className="grid min-w-[720px] grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_140px_180px] gap-4 border-b border-[#f1f1f2] px-5 py-4 text-sm last:border-b-0 md:items-center">{children}</div>;
}

export function AdminEmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#d4d4d8] bg-white px-6 py-16 text-center"><span className="flex size-10 items-center justify-center rounded-full bg-[#f4f4f5] text-[#71717a]"><Inbox className="size-5" aria-hidden="true" /></span><h2 className="mt-4 text-base font-semibold text-[#18181b]">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#71717a]">{description}</p>{action ? <div className="mt-5">{action}</div> : null}</div>;
}
