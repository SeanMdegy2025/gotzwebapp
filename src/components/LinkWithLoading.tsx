"use client";

import Link from "next/link";
import { useState } from "react";

type LinkWithLoadingProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  loadingLabel?: string;
};

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="42 24"
        strokeDashoffset="0"
      />
    </svg>
  );
}

export function LinkWithLoading({
  href,
  children,
  className = "",
  loadingLabel = "Loading…",
}: LinkWithLoadingProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <Link
      href={href}
      className={className}
      onClick={() => setIsNavigating(true)}
      aria-busy={isNavigating}
      aria-disabled={isNavigating}
    >
      {isNavigating ? (
        <span className="inline-flex min-w-0 items-center justify-center gap-2">
          <Spinner className="h-4 w-4 shrink-0 text-current" />
          <span className="truncate">{loadingLabel}</span>
        </span>
      ) : (
        children
      )}
    </Link>
  );
}
