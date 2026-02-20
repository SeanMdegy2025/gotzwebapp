"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 md:right-8 z-50 flex h-12 w-12 sm:h-14 sm:w-14 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-gradient-to-br from-safari-gold via-safari-gold/90 to-safari-gold/80 shadow-glow-gold transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 animate-back-to-top-in group"
      aria-label="Back to top"
    >
      <svg className="h-6 w-6 text-charcoal transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
