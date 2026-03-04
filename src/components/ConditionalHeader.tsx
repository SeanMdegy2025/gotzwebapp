"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "./Header";

const NO_HEADER_PATHS = ["/login", "/admin"];

export function ConditionalHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use pathname only after mount so server and first client render match (avoids hydration error)
  if (!mounted) {
    return <Header />;
  }
  const hide = NO_HEADER_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (hide) return null;
  return <Header />;
}
