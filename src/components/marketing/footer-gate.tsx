"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/marketing/site-footer";

const HIDE_FOOTER_PREFIXES = ["/admin", "/p/"];

export function FooterGate() {
  const pathname = usePathname() ?? "";
  if (HIDE_FOOTER_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;
  return <SiteFooter />;
}
