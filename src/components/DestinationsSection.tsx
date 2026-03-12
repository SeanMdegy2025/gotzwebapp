"use client";

import { useState, useCallback, useEffect } from "react";

export type DestinationSpot = {
  name: string;
  tag: string;
  image: string;
  description: string;
  images?: string[];
};

const DESCRIPTION_LINES = 2;
const MAX_CHARS = 100;

function truncateDescription(text: string): { short: string; isTruncated: boolean } {
  if (!text || !text.trim()) return { short: "", isTruncated: false };
  const trimmed = text.trim();
  if (trimmed.length <= MAX_CHARS) return { short: trimmed, isTruncated: false };
  const short = trimmed.slice(0, MAX_CHARS).trim();
  const lastSpace = short.lastIndexOf(" ");
  const final = lastSpace > 50 ? short.slice(0, lastSpace) : short;
  return { short: final + "…", isTruncated: true };
}

function getSpotImages(spot: DestinationSpot): string[] {
  if (spot.images && spot.images.length > 0) return spot.images;
  return [spot.image ?? "/images/safari/wildlife-herd.jpg"];
}

const CHEVRON = (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const CHEVRON_R = (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export function DestinationsSection({ spots }: { spots: DestinationSpot[] }) {
  const [openSpot, setOpenSpot] = useState<DestinationSpot | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [cardImageIndices, setCardImageIndices] = useState<Record<number, number>>({});

  const totalSlides = Math.max(1, Math.ceil(spots.length / 2));
  const canPrevSlide = slideIndex > 0;
  const canNextSlide = slideIndex < totalSlides - 1;

  const closeModal = useCallback(() => {
    setOpenSpot(null);
    setModalImageIndex(0);
  }, []);

  const openModal = useCallback((spot: DestinationSpot) => {
    setOpenSpot(spot);
    setModalImageIndex(0);
  }, []);

  const setCardImage = useCallback((spotIdx: number, imageIdx: number) => {
    setCardImageIndices((prev) => ({ ...prev, [spotIdx]: imageIdx }));
  }, []);

  const modalImages = openSpot ? getSpotImages(openSpot) : [];
  const canPrev = modalImages.length > 1 && modalImageIndex > 0;
  const canNext = modalImages.length > 1 && modalImageIndex < modalImages.length - 1;

  useEffect(() => {
    if (!openSpot) return;
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && closeModal();
    const handleArrow = (e: KeyboardEvent) => {
      const imgs = getSpotImages(openSpot);
      if (imgs.length <= 1) return;
      if (e.key === "ArrowLeft") setModalImageIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setModalImageIndex((i) => Math.min(imgs.length - 1, i + 1));
    };
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleArrow);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleArrow);
      document.body.style.overflow = "";
    };
  }, [openSpot, closeModal]);

  const AUTO_SLIDE_MS = 7500;
  useEffect(() => {
    if (totalSlides <= 1 || openSpot) return;
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % totalSlides);
    }, AUTO_SLIDE_MS);
    return () => clearInterval(id);
  }, [totalSlides, openSpot]);

  return (
    <>
      <div className="relative w-full">
        <div className="overflow-hidden">
          <div
            className="flex transition-[transform] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ transform: `translateX(-${slideIndex * (100 / totalSlides)}%)` }}
          >
            {spots.map((spot, index) => {
              const spotImages = getSpotImages(spot);
              const cardImgIdx = cardImageIndices[index] ?? 0;
              const currentImg = spotImages[cardImgIdx] ?? spot.image ?? "/images/safari/wildlife-herd.jpg";
              const canPrevImg = spotImages.length > 1 && cardImgIdx > 0;
              const canNextImg = spotImages.length > 1 && cardImgIdx < spotImages.length - 1;
              const { short, isTruncated } = truncateDescription(spot.description);
              const displayDesc = isTruncated ? short : spot.description;

              return (
                <article
                  key={spot.name ? `dest-${spot.name}-${index}` : `dest-${index}`}
                  className="group relative flex-[0_0_50%] min-w-0 px-3 sm:px-4"
                >
                  <div
                    className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-charcoal/5 transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 cursor-pointer border border-white/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.08)]"
                    onClick={() => openModal(spot)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openModal(spot)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${spot.name}`}
                  >
                    <div className="relative aspect-[4/3] min-h-[340px] sm:min-h-[380px] overflow-hidden">
                      <img
                        src={typeof currentImg === "string" ? currentImg : "/images/safari/wildlife-herd.jpg"}
                        alt={spot.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      {/* In-card image nav: visible on hover, minimal */}
                      {spotImages.length > 1 && (
                        <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCardImage(index, Math.max(0, cardImgIdx - 1));
                            }}
                            disabled={!canPrevImg}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            aria-label="Previous image"
                          >
                            {CHEVRON}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCardImage(index, Math.min(spotImages.length - 1, cardImgIdx + 1));
                            }}
                            disabled={!canNextImg}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            aria-label="Next image"
                          >
                            {CHEVRON_R}
                          </button>
                        </div>
                      )}
                      {/* Dots: bottom center, only when multiple images */}
                      {spotImages.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                          {spotImages.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setCardImage(index, i); }}
                              className={`h-1 rounded-full transition-all ${i === cardImgIdx ? "w-5 bg-white" : "w-1 bg-white/50 hover:bg-white/70"}`}
                              aria-label={`Image ${i + 1} of ${spotImages.length}`}
                            />
                          ))}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-end p-4 sm:p-5 text-white pointer-events-none">
                      <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-safari-gold/95 mb-1">
                        {spot.tag}
                      </span>
                      <h3 className="text-lg sm:text-xl font-heading font-semibold leading-tight tracking-tight">
                        {spot.name}
                      </h3>
                      <p className="mt-2 text-sm text-white/90 line-clamp-2 leading-snug">
                        {displayDesc}
                        {isTruncated && (
                          <span className="text-safari-gold/90 font-medium ml-0.5">Read more</span>
                        )}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Section controls: minimal */}
        {spots.length > 2 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
              disabled={!canPrevSlide}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 bg-white text-charcoal/80 shadow-sm transition hover:bg-charcoal/5 hover:border-safari-gold/40 hover:text-charcoal disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Previous destinations"
            >
              {CHEVRON}
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlideIndex(i)}
                  className={`rounded-full transition-all ${i === slideIndex ? "h-2 w-6 bg-safari-gold" : "h-1.5 w-1.5 bg-charcoal/25 hover:bg-charcoal/40"}`}
                  aria-label={`Slide ${i + 1} of ${totalSlides}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSlideIndex((i) => Math.min(totalSlides - 1, i + 1))}
              disabled={!canNextSlide}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 bg-white text-charcoal/80 shadow-sm transition hover:bg-charcoal/5 hover:border-safari-gold/40 hover:text-charcoal disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Next destinations"
            >
              {CHEVRON_R}
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {openSpot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="destination-modal-title"
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
                src={modalImages[modalImageIndex] ?? openSpot.image ?? "/images/safari/wildlife-herd.jpg"}
                alt={openSpot.name}
                className="h-full w-full object-cover"
              />
              {modalImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setModalImageIndex((i) => Math.max(0, i - 1)); }}
                    disabled={!canPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-charcoal shadow-md transition hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Previous image"
                  >
                    {CHEVRON}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setModalImageIndex((i) => Math.min(modalImages.length - 1, i + 1)); }}
                    disabled={!canNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-charcoal shadow-md transition hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Next image"
                  >
                    {CHEVRON_R}
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {modalImages.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setModalImageIndex(i); }}
                        className={`h-1.5 rounded-full transition-all ${i === modalImageIndex ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"}`}
                        aria-label={`Image ${i + 1} of ${modalImages.length}`}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white pointer-events-none">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-safari-gold/95">{openSpot.tag}</p>
                <h2 id="destination-modal-title" className="text-xl sm:text-2xl font-heading font-semibold leading-tight mt-0.5">
                  {openSpot.name}
                </h2>
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
              <p className="text-charcoal/80 text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap">
                {openSpot.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-safari-green/30 bg-safari-green/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-safari-green">
                  Sample Itinerary
                </span>
                <span className="rounded-full border border-safari-gold/30 bg-safari-gold/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-safari-gold">
                  Best Season
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
