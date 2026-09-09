"use client";

import { usePathname } from "next/navigation";
import SocialLinksBar from "@/components/ui/SocialLinksBar";

export default function PublicSocialBar() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return <SocialLinksBar />;
}
