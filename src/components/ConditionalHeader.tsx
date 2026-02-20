"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

const NO_HEADER_PATHS = ["/login", "/admin"];

export function ConditionalHeader() {
  const pathname = usePathname();
  const hide = NO_HEADER_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (hide) return null;
  return <Header />;
}
