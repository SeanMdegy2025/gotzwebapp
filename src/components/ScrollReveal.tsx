"use client";

import { useEffect, useRef, useState } from "react";

type Props = { children: React.ReactNode; className?: string; delay?: number; stagger?: number };

export function ScrollReveal({ children, className = "", delay = 0, stagger = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`} style={{ transitionDelay: visible ? `${delay + stagger}ms` : "0ms" }}>
      {children}
    </div>
  );
}
