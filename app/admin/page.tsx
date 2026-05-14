import Link from "next/link";

import { requireAdminSession } from "@/lib/auth";
import type { AdminDashboardCounts } from "@/lib/content/admin";
import { getAdminDashboardCounts } from "@/lib/content/admin";

type Section = {
  href: string;
  label: string;
  description: string;
  count: (c: AdminDashboardCounts) => number;
  countLabel: (n: number) => string;
};

const adminSections: Section[] = [
  {
    href: "/admin/projects",
    label: "Projects",
    description: "Case studies, featured work, and project metadata.",
    count: (c) => c.projects,
    countLabel: (n) => `${n} project${n === 1 ? "" : "s"}`,
  },
  {
    href: "/admin/writing",
    label: "Writing",
    description: "Blog posts, native articles, and external summaries.",
    count: (c) => c.posts,
    countLabel: (n) => `${n} post${n === 1 ? "" : "s"}`,
  },
  {
    href: "/admin/certificates",
    label: "Certificates",
    description: "Formal certificate records and proof links.",
    count: (c) => c.certificates,
    countLabel: (n) => `${n} certificate${n === 1 ? "" : "s"}`,
  },
  {
    href: "/admin/highlights",
    label: "Highlights",
    description: "Pinned proof-of-work and card overrides.",
    count: (c) => c.highlights,
    countLabel: (n) => `${n} highlight${n === 1 ? "" : "s"}`,
  },
  {
    href: "/admin/about",
    label: "About",
    description: "Grouped About page sections and copy.",
    count: (c) => c.aboutSections,
    countLabel: (n) => `${n} section${n === 1 ? "" : "s"}`,
  },
  {
    href: "/admin/activity",
    label: "Activity",
    description: "GitHub contribution cache and refresh.",
    count: (c) => c.activitySnapshots,
    countLabel: (n) => `${n} snapshot${n === 1 ? "" : "s"} stored`,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    description: "Site-level JSON values (username, availability, focus).",
    count: (c) => c.siteSettings,
    countLabel: (n) => `${n} setting key${n === 1 ? "" : "s"}`,
  },
];

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const email = session?.user?.email ?? "authorized admin";
  const counts = await getAdminDashboardCounts();

  return (
    <main className="space-y-8">
      <section className="rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#666666]">Portfolio CMS V1</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Admin Console</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#555555]">
          Signed in as {email}. This is the private CMS console for the current portfolio data model, writing flow,
          highlights, and activity refresh controls.
        </p>
      </section>

      <section aria-label="CMS sections" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((item) => {
          const n = item.count(counts);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-[#d5d5d5] bg-white p-5 transition-colors hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#424242]/25 focus-visible:ring-offset-2"
            >
              <h2 className="text-lg font-semibold">{item.label}</h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#888888]">{item.countLabel(n)}</p>
              <p className="mt-2 text-sm text-[#666666]">{item.description}</p>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
