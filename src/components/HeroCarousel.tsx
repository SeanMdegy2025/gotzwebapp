"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getHeroSlides, toImageSrc, type HeroSlide } from "@/lib/api";

const FALLBACK_SLIDES: HeroSlide[] = [
  { id: 0, label: "Luxury Adventures", title: "Tanzania's wild soul – savannah to spice isles", description: "Expert-led safaris: iconic wildlife, Kilimanjaro summits, and barefoot beach retreats.", ctaLabel: "Explore Signature Safaris", ctaHref: "#safaris", image: undefined },
  { id: 1, label: "Kilimanjaro Expeditions", title: "Summit the roof of Africa", description: "Acclimatisation routes, private camps, expert leaders to Uhuru Peak.", ctaLabel: "Plan Your Climb", ctaHref: "#safaris", image: undefined },
  { id: 2, label: "Zanzibar Beach Retreats", title: "Unwind on Zanzibar's shores", description: "Stone Town heritage and villa resorts by coconut palms and lagoons.", ctaLabel: "Design My Escape", ctaHref: "#lodges", image: undefined },
];

const STATIC_IMAGES = ["/images/safari/lions.jpg", "/images/safari/wildlife-zebra.jpg", "/images/safari/wildlife-giraffe.jpg"];

export function HeroCarousel() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    getHeroSlides()
      .then((data) => setSlides(data.length > 0 ? data : FALLBACK_SLIDES))
      .catch(() => setSlides(FALLBACK_SLIDES))
      .finally(() => setLoading(false));
  }, []);

  const displaySlides = slides.length > 0 ? slides : FALLBACK_SLIDES;
  const activeSlide = displaySlides[currentSlide] ?? displaySlides[0];

  useEffect(() => {
    if (displaySlides.length <= 1) return;
    const id = setInterval(() => setCurrentSlide((prev) => (prev + 1) % displaySlides.length), 15000);
    return () => clearInterval(id);
  }, [displaySlides.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);

  const getImageSrc = (slide: HeroSlide, index: number) => {
    const raw = slide.image_base64 ?? (slide as { imageBase64?: string }).imageBase64 ?? slide.image;
    const src = toImageSrc(raw);
    if (src) return src;
    return STATIC_IMAGES[index % STATIC_IMAGES.length];
  };

  if (loading) {
    return (
      <section id="home" className="relative m-0">
        <div className="relative h-screen min-h-[600px] m-0 bg-charcoal animate-pulse" />
      </section>
    );
  }

  return (
    <section id="home" className="relative m-0">
      <div className="relative h-screen min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] m-0 overflow-hidden">
        {displaySlides.map((slide, index) => {
          const isActive = currentSlide === index;
          const imgSrc = getImageSrc(slide, index);
          return (
            <div
              key={slide.id ?? index}
              className="absolute inset-0 transition-all duration-700 ease-out"
              style={{ opacity: isActive ? 1 : 0, transform: isActive ? "scale(1)" : "scale(1.03)", pointerEvents: isActive ? "auto" : "none" }}
            >
              {imgSrc?.startsWith("data:") ? (
                <img src={imgSrc} alt={slide.title} className="h-full w-full object-cover transition-transform duration-700 ease-out" style={{ transform: isActive ? "scale(1)" : "scale(1.05)" }} />
              ) : (
                <Image src={STATIC_IMAGES[index % STATIC_IMAGES.length]} alt={slide.title} fill className="object-cover transition-transform duration-700 ease-out" priority sizes="100vw" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          );
        })}

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-5 sm:px-6 md:px-8 xl:pl-12 pb-24 sm:pb-20 pt-20 sm:pt-16 text-white translate-x-0 xl:-translate-x-24">
          <div className="max-w-xl w-full min-w-0">
            {activeSlide.label && (
              <p className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] sm:tracking-[0.5em] text-safari-gold animate-slide-content-in [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">{activeSlide.label}</p>
            )}
            <h1 className="mt-2 text-2xl font-heading font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-balance animate-slide-content-in [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]" style={{ animationDelay: "0.05s" }}>{activeSlide.title}</h1>
            {activeSlide.description && (
              <p className="mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm md:text-base leading-snug text-white/95 animate-slide-content-in [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]" style={{ animationDelay: "0.1s" }}>{activeSlide.description}</p>
            )}
          </div>
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 animate-slide-content-in" style={{ animationDelay: "0.15s" }}>
            {activeSlide.ctaLabel && activeSlide.ctaHref && (
              <Link href={activeSlide.ctaHref} className="group rounded-full bg-safari-gold px-6 py-3.5 sm:px-8 sm:py-4 text-sm font-semibold text-charcoal transition-all duration-300 hover:bg-safari-gold-light hover:shadow-glow-gold hover:scale-105 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-black/50 min-h-[44px] inline-flex items-center">
                {activeSlide.ctaLabel}
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            )}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {displaySlides.length > 1 && (
          <div className="absolute inset-x-0 bottom-5 sm:bottom-8 md:bottom-10 z-20 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <button type="button" className="pointer-events-auto rounded-full border-2 border-white/50 glass-dark p-3 sm:p-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 hover:border-safari-gold hover:scale-110 hover:shadow-glow-gold focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-black/50" onClick={prevSlide} aria-label="Previous slide">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
              </button>
              <button type="button" className="pointer-events-auto rounded-full border-2 border-white/50 glass-dark p-3 sm:p-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 hover:border-safari-gold hover:scale-110 hover:shadow-glow-gold focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-black/50" onClick={nextSlide} aria-label="Next slide">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5 15.75 12l-7.5 7.5" /></svg>
              </button>
            </div>
            <div className="pointer-events-auto flex gap-2 sm:gap-2.5 items-center">
              {displaySlides.map((_, index) => (
                <button key={index} type="button" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-black/50" onClick={() => goToSlide(index)} aria-label={`Go to slide ${index + 1}`}>
                  <span className={`block h-2 w-8 sm:w-10 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-safari-gold shadow-glow-gold" : "bg-white/40 hover:bg-white/70"}`} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
