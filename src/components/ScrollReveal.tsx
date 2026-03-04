"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = { children: React.ReactNode; className?: string; delay?: number; stagger?: number };

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (ref == null) return;
  if (typeof ref === "function") ref(value);
  else (ref as React.MutableRefObject<T | null>).current = value;
}

export function ScrollReveal({ children, className = "", delay = 0, stagger = 0 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const transitionClass = `transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`.trim();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const singleChild = React.Children.count(children) === 1 && React.isValidElement(children);
  const child = singleChild ? (children as React.ReactElement<{ ref?: React.Ref<unknown>; className?: string; style?: React.CSSProperties }>) : null;

  if (child && child.type === "div") {
    const mergedRef = (node: HTMLDivElement | null) => {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      const childRef = (child.props as { ref?: React.Ref<HTMLDivElement> }).ref;
      if (childRef) setRef(childRef, node);
    };
    const existingClassName = (child.props.className as string) ?? "";
    const existingStyle = (child.props.style as React.CSSProperties) ?? {};
    return React.cloneElement(child, {
      ref: mergedRef,
      className: `${existingClassName} ${transitionClass}`.trim(),
      style: { ...existingStyle, transitionDelay: visible ? `${delay + stagger}ms` : "0ms" },
    });
  }

  return (
    <div ref={ref} className={transitionClass} style={{ transitionDelay: visible ? `${delay + stagger}ms` : "0ms" }}>
      {children}
    </div>
  );
}
