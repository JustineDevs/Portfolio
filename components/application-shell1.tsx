"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Cable,
  ChevronRight,
  ChevronsUpDown,
  FileBadge,
  FileText,
  FolderKanban,
  Home,
  LayoutDashboard,
  Library,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import * as React from "react";

import { signOutAdminAction } from "@/app/admin/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string; icon: React.ComponentType<{ className?: string }>; children?: NavItem[] };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  { title: "Publish", items: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Home", href: "/admin/home", icon: Home },
    { label: "Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "Writing", href: "/admin/writing", icon: BookOpen },
    { label: "Certificates", href: "/admin/certificates", icon: FileBadge },
    { label: "Highlights", href: "/admin/highlights", icon: Award },
    { label: "About", href: "/admin/about", icon: UserRound },
    { label: "Experience", href: "/admin/experience", icon: Briefcase },
    { label: "Site content", href: "/admin/content", icon: FileText },
  ] },
  { title: "Operate", items: [
    { label: "Activity", href: "/admin/activity", icon: Activity },
    { label: "Connections", href: "/admin/connections", icon: Cable },
    { label: "Asset Library", href: "/admin/library", icon: Library },
  ] },
  { title: "System", items: [{ label: "Settings", href: "/admin/settings", icon: Settings }] },
];

function activeFor(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

function NavItemView({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon;
  const active = activeFor(pathname, item.href);
  if (!item.children?.length) {
    return <SidebarMenuItem><SidebarMenuButton asChild isActive={active} tooltip={item.label}><Link href={item.href}><Icon className="size-4" /><span>{item.label}</span></Link></SidebarMenuButton></SidebarMenuItem>;
  }
  return <Collapsible defaultOpen={active} className="group/collapsible"><SidebarMenuItem><CollapsibleTrigger asChild><SidebarMenuButton isActive={active}><Icon className="size-4" /><span>{item.label}</span><ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /></SidebarMenuButton></CollapsibleTrigger><CollapsibleContent><SidebarMenuSub>{item.children.map((child) => <SidebarMenuSubItem key={child.href}><SidebarMenuSubButton asChild isActive={activeFor(pathname, child.href)}><Link href={child.href}>{child.label}</Link></SidebarMenuSubButton></SidebarMenuSubItem>)}</SidebarMenuSub></CollapsibleContent></SidebarMenuItem></Collapsible>;
}

function UserMenu() {
  return <SidebarMenu><SidebarMenuItem><DropdownMenu><DropdownMenuTrigger asChild><SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"><Avatar className="size-8 rounded-lg"><AvatarFallback className="rounded-lg bg-primary text-primary-foreground">J</AvatarFallback></Avatar><div className="grid flex-1 text-left text-sm leading-tight"><span className="truncate font-medium">Admin workspace</span><span className="truncate text-xs text-muted-foreground">Authorized administrator</span></div><ChevronsUpDown className="ml-auto size-4" /></SidebarMenuButton></DropdownMenuTrigger><DropdownMenuContent className="w-56 rounded-lg" side="bottom" align="end" sideOffset={4}><DropdownMenuLabel className="p-0 font-normal"><div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm"><Avatar className="size-8 rounded-lg"><AvatarFallback className="rounded-lg bg-primary text-primary-foreground">J</AvatarFallback></Avatar><div className="grid flex-1 leading-tight"><span className="font-medium">Admin workspace</span><span className="text-xs text-muted-foreground">Portfolio CMS</span></div></div></DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem asChild><Link href="/admin/settings"><Settings className="mr-2 size-4" />Settings</Link></DropdownMenuItem><DropdownMenuItem asChild><form action={signOutAdminAction} className="w-full"><button type="submit" className="flex w-full items-center"><LogOut className="mr-2 size-4" />Sign out</button></form></DropdownMenuItem></DropdownMenuContent></DropdownMenu></SidebarMenuItem></SidebarMenu>;
}

export default function ApplicationShell1({ children, brandSrc }: { children: React.ReactNode; brandSrc?: string }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  const current = navGroups.flatMap((group) => group.items).find((item) => activeFor(pathname, item.href));
  return <SidebarProvider defaultOpen><Sidebar collapsible="icon"><SidebarHeader><SidebarMenu><SidebarMenuItem><SidebarMenuButton size="lg" asChild><Link href="/admin"><div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-primary">{brandSrc ? <Image src={brandSrc} alt="JSTN" width={24} height={24} unoptimized className="size-6 object-contain" /> : <span className="text-sm font-bold text-primary-foreground">J</span>}</div><div className="flex flex-col gap-0.5 leading-none"><span className="font-medium">Portfolio CMS</span><span className="text-xs text-muted-foreground">Content workspace</span></div></Link></SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarHeader><SidebarContent className="overflow-hidden"><ScrollArea className="min-h-0 flex-1">{navGroups.map((group) => <SidebarGroup key={group.title}><SidebarGroupLabel>{group.title}</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>{group.items.map((item) => <NavItemView key={item.href} item={item} pathname={pathname} />)}</SidebarMenu></SidebarGroupContent></SidebarGroup>)}</ScrollArea></SidebarContent><SidebarFooter><UserMenu /></SidebarFooter><SidebarRail /></Sidebar><SidebarInset><header className="flex h-16 shrink-0 items-center gap-2 border-b px-4"><SidebarTrigger className="-ml-1" /><Separator orientation="vertical" className="mr-2 hidden data-[orientation=vertical]:h-4 md:block" /><Breadcrumb className="hidden md:block"><BreadcrumbList><BreadcrumbItem><BreadcrumbLink asChild><Link href="/admin">CMS</Link></BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{current?.label ?? "Dashboard"}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb></header><div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col p-4 sm:p-6 lg:p-8">{children}</div></SidebarInset></SidebarProvider>;
}
