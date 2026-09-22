import Link from "next/link";
import { ArrowUpRight, BookOpen, FolderKanban, Settings2, ShieldCheck } from "lucide-react";

import { requireAdminSession } from "@/lib/auth";
import type { AdminDashboardCounts } from "@/lib/content/admin";
import { getAdminDashboardCounts } from "@/lib/content/admin";

type DashboardCard = { label: string; value: number; detail: string; href: string; icon: typeof FolderKanban };

const contentLinks = [
  { href: "/admin/projects", label: "Projects", description: "Case studies and featured work." },
  { href: "/admin/writing", label: "Writing", description: "Posts, articles, and external summaries." },
  { href: "/admin/experience", label: "Experience", description: "Timeline, roles, proof, and testimonials." },
  { href: "/admin/library", label: "Asset library", description: "Reusable logos, icons, and media." },
];

function getCards(counts: AdminDashboardCounts): DashboardCard[] {
  return [
    { label: "Projects", value: counts.projects, detail: "Published and draft records", href: "/admin/projects", icon: FolderKanban },
    { label: "Writing", value: counts.posts, detail: "Posts and article records", href: "/admin/writing", icon: BookOpen },
    { label: "Proof", value: counts.certificates + counts.highlights, detail: "Certificates and highlights", href: "/admin/certificates", icon: ShieldCheck },
    { label: "Settings", value: counts.siteSettings, detail: "Configured site values", href: "/admin/settings", icon: Settings2 },
  ];
}

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const counts = await getAdminDashboardCounts();
  const email = session?.user?.email ?? "authorized admin";
  const cards = getCards(counts);

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-[#e4e4e7] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-sm text-[#71717a]">Workspace / Overview</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#18181b]">Portfolio overview</h1><p className="mt-2 text-sm text-[#71717a]">Manage the published portfolio data and reusable content library.</p></div>
        <div className="flex items-center gap-2 text-xs text-[#71717a]"><span className="inline-flex items-center gap-2 rounded-md border border-[#e4e4e7] bg-white px-3 py-2"><span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />{email}</span><Link href="/admin/settings" className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-[#18181b] px-3 text-xs font-medium text-white transition-[background-color,transform] duration-150 hover:bg-[#27272a] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b]/25 focus-visible:ring-offset-2">Settings <ArrowUpRight className="size-3.5" aria-hidden="true" /></Link></div>
      </header>

      <section aria-label="Content metrics" className="grid gap-px overflow-hidden rounded-lg border border-[#e4e4e7] bg-[#e4e4e7] sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => { const Icon = card.icon; return <Link key={card.href} href={card.href} className="group bg-white p-5 hover:bg-[#fafafa]"><div className="flex items-center justify-between gap-3"><span className="text-sm font-medium text-[#71717a]">{card.label}</span><Icon className="size-4 text-[#a1a1aa]" aria-hidden="true" /></div><p className="mt-3 text-2xl font-semibold tracking-tight text-[#18181b]">{card.value}</p><p className="mt-1 text-xs text-[#a1a1aa]">{card.detail}</p></Link>; })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <div className="rounded-lg border border-[#e4e4e7] bg-white"><div className="flex items-center justify-between border-b border-[#e4e4e7] px-5 py-4"><div><h2 className="font-semibold text-[#18181b]">Content areas</h2><p className="mt-1 text-sm text-[#71717a]">Jump directly into the records that power the site.</p></div><Link href="/admin/content" className="text-xs font-medium text-[#18181b] hover:underline">View all</Link></div><div className="divide-y divide-[#f1f1f2]">{contentLinks.map((item) => <Link key={item.href} href={item.href} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[#fafafa]"><div><p className="text-sm font-medium text-[#18181b]">{item.label}</p><p className="mt-1 text-sm text-[#71717a]">{item.description}</p></div><ArrowUpRight className="size-4 shrink-0 text-[#a1a1aa]" aria-hidden="true" /></Link>)}</div></div>
        <div className="rounded-lg border border-[#e4e4e7] bg-white"><div className="border-b border-[#e4e4e7] px-5 py-4"><h2 className="font-semibold text-[#18181b]">System status</h2><p className="mt-1 text-sm text-[#71717a]">Current CMS configuration.</p></div><dl className="divide-y divide-[#f1f1f2] px-5"><div className="flex items-center justify-between gap-4 py-4 text-sm"><dt className="text-[#71717a]">Activity snapshots</dt><dd className="font-medium text-[#18181b]">{counts.activitySnapshots}</dd></div><div className="flex items-center justify-between gap-4 py-4 text-sm"><dt className="text-[#71717a]">About sections</dt><dd className="font-medium text-[#18181b]">{counts.aboutSections}</dd></div><div className="flex items-center justify-between gap-4 py-4 text-sm"><dt className="text-[#71717a]">Site settings</dt><dd className="font-medium text-[#18181b]">{counts.siteSettings}</dd></div></dl></div>
      </section>
    </main>
  );
}
