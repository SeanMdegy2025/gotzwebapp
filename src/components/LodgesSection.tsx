"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";

export type LodgeSpot = {
  name: string;
  location: string;
  image: string;
  mood: string;
  slug: string;
  type?: string;
  short_description?: string;
  price_from?: number | null;
};

function formatPrice(value: number | null | undefined): string | null {
  if (value == null || Number.isNaN(value)) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function LodgesSection({ lodges }: { lodges: LodgeSpot[] }) {
  const [openLodge, setOpenLodge] = useState<LodgeSpot | null>(null);

  const closeModal = useCallback(() => setOpenLodge(null), []);

  useEffect(() => {
    if (!openLodge) return;
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && closeModal();
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [openLodge, closeModal]);

  return (
    <>
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {lodges.map((lodge, index) => (
          <button
            key={lodge.slug ?? `lodge-${index}`}
            type="button"
            onClick={() => setOpenLodge(lodge)}
            className="group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-charcoal/10 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] transition-[transform,box-shadow] duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 text-left"
          >
            <div className="relative aspect-[4/3] min-h-[220px] overflow-hidden">
              <img
                src={lodge.image}
                alt={lodge.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              {lodge.location && (
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal">
                  {lodge.location}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-heading font-semibold text-charcoal leading-tight">
                {lodge.name}
              </h3>
              {(lodge.mood || lodge.short_description) && (
                <p className="text-sm text-charcoal/75 leading-relaxed line-clamp-2 flex-1">
                  {lodge.short_description || lodge.mood}
                </p>
              )}
              <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-safari-green transition-colors group-hover:text-safari-gold">
                View details
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lodge detail modal */}
      {openLodge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lodge-modal-title"
        >
          <div
            className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden
          />
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-52 sm:h-64 flex-shrink-0 overflow-hidden bg-charcoal/10">
              <img
                src={openLodge.image}
                alt={openLodge.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white pointer-events-none">
                {openLodge.location && (
                  <span className="inline-block rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                    {openLodge.location}
                  </span>
                )}
                <h2 id="lodge-modal-title" className="text-xl sm:text-2xl font-heading font-semibold leading-tight">
                  {openLodge.name}
                </h2>
                {openLodge.type && (
                  <p className="text-sm uppercase tracking-wider text-white/90 mt-0.5">
                    {openLodge.type}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-charcoal shadow-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {openLodge.type && (
                  <span className="rounded-full border border-safari-green/30 bg-safari-green/5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-safari-green">
                    {openLodge.type}
                  </span>
                )}
                {openLodge.mood && openLodge.short_description && (
                  <span className="rounded-full border border-charcoal/20 bg-charcoal/5 px-3 py-1.5 text-xs font-medium text-charcoal/80">
                    {openLodge.mood}
                  </span>
                )}
                {formatPrice(openLodge.price_from ?? null) && (
                  <span className="text-lg font-semibold text-safari-gold">
                    From {formatPrice(openLodge.price_from ?? null)}
                  </span>
                )}
              </div>
              {(openLodge.short_description || openLodge.mood) && (
                <p className="text-charcoal/80 text-[15px] sm:text-base leading-relaxed">
                  {openLodge.short_description || openLodge.mood}
                </p>
              )}
              <div className="mt-8">
                <Link
                  href="/#contact"
                  onClick={closeModal}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-safari-green px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-safari-green/90 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 min-h-[48px]"
                >
                  Request availability
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
