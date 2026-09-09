"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Award,
  BookOpen,
  ChevronRight,
  FileBadge,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

import { signOutAdminAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/writing", label: "Writing", icon: BookOpen },
  { href: "/admin/certificates", label: "Certificates", icon: FileBadge },
  { href: "/admin/highlights", label: "Highlights", icon: Award },
  { href: "/admin/about", label: "About", icon: UserRound },
  { href: "/admin/activity", label: "Activity", icon: Activity },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#18181b]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#e4e4e7] bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-[#e4e4e7] px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#18181b] text-xs font-bold text-white">J</span>
              <span>Portfolio CMS</span>
            </Link>
          </div>
          <nav aria-label="Admin sections" className="flex-1 space-y-1 overflow-y-auto p-4">
            <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#a1a1aa]">Workspace</p>
            {adminLinks.map((link) => {
              const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b]/20",
                    active ? "bg-[#f4f4f5] text-[#18181b]" : "text-[#71717a] hover:bg-[#fafafa] hover:text-[#18181b]",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-[#e4e4e7] p-4">
            <a href="/" className="mb-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[#71717a] hover:bg-[#fafafa] hover:text-[#18181b]">
              <ChevronRight className="h-4 w-4 rotate-180" aria-hidden="true" />
              View public site
            </a>
            <form action={signOutAdminAction}>
              <button type="submit" className="flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-[#71717a] transition-colors hover:bg-[#fff1f2] hover:text-[#be123c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b]/20">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-[#e4e4e7] bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#18181b]">{adminLinks.find((link) => pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href)))?.label ?? "CMS Console"}</p>
              <p className="hidden text-xs text-[#71717a] sm:block">Manage the public portfolio from one workspace.</p>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <Link href="/admin" aria-label="Dashboard" className="flex h-9 w-9 items-center justify-center rounded-md border border-[#e4e4e7] text-[#52525b] hover:bg-[#f4f4f5]"><LayoutDashboard className="h-4 w-4" /></Link>
              <form action={signOutAdminAction}>
                <button type="submit" aria-label="Sign out" className="flex h-9 w-9 items-center justify-center rounded-md border border-[#e4e4e7] text-[#52525b] hover:bg-[#fff1f2] hover:text-[#be123c]"><LogOut className="h-4 w-4" /></button>
              </form>
            </div>
          </div>
          <nav aria-label="Mobile admin sections" className="flex gap-1 overflow-x-auto border-t border-[#f4f4f5] px-4 py-2 lg:hidden">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href} className={cn("whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium", pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href)) ? "bg-[#18181b] text-white" : "text-[#71717a] hover:bg-[#f4f4f5]")}>{link.label}</Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
