import Link from "next/link";

import { signOutAdminAction } from "@/app/admin/actions";
import { adminButtonPrimaryClass, adminLinkOutlineClass } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/writing", label: "Writing" },
  { href: "/admin/highlights", label: "Highlights" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/activity", label: "Activity" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#424242]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-2xl border border-[#d5d5d5] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#666666]">Portfolio Admin</p>
              <p className="mt-2 text-xl font-bold tracking-tight text-[#424242]">CMS Console</p>
            </div>

            <nav aria-label="Admin sections" className="flex flex-wrap items-center gap-2">
              <ul className="flex flex-wrap items-center gap-2">
                {adminLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={adminLinkOutlineClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <form action={signOutAdminAction} className="inline">
                    <button type="submit" className={cn(adminButtonPrimaryClass, "px-3 py-2 text-sm font-medium")}>
                      Sign out
                    </button>
                  </form>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
