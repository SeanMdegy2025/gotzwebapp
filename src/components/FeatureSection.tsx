"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getFeatureCards, type FeatureCard } from "@/lib/api";

const FALLBACK_CARDS: FeatureCard[] = [
  { icon: "travellers", title: "500+ Happy Travellers Yearly", copy: "Expert travel designers crafting hand-picked itineraries and seamless logistics for every guest.", count_value: 500 },
  { icon: "pricing", title: "Best Price Guarantee", copy: "Preferred partner rates across lodges, charter flights, and experiences tailored to your budget.", count_value: undefined },
  { icon: "support", title: "24/7 Top-Notch Support", copy: "Dedicated concierge before, during, and after your safari—always a WhatsApp or call away.", count_value: undefined },
];

function TravellersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82 82" fill="none" className="h-14 w-14 text-safari-gold">
      <circle cx={41} cy={41} r={40} stroke="currentColor" strokeWidth={2} />
      <path d="M30 34c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 59.5c1.8-9.4 9.467-16 18-16s16.2 6.6 18 16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
function PricingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82 82" fill="none" className="h-14 w-14 text-safari-gold">
      <circle cx={41} cy={41} r={40} stroke="currentColor" strokeWidth={2} />
      <path d="M50 29H36.5a5.5 5.5 0 0 0 0 11h9a5.5 5.5 0 0 1 0 11H28" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path d="M41 21v40" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82 82" fill="none" className="h-14 w-14 text-safari-gold">
      <circle cx={41} cy={41} r={40} stroke="currentColor" strokeWidth={2} />
      <path d="M26 50.5V36.8c0-6.8 5.5-12.3 12.3-12.3h5.4c6.8 0 12.3 5.5 12.3 12.3v13.7c0 .7-.3 1.3-.8 1.8l-7.6 6.6c-1 1-2.8.3-2.8-1.1v-4.6h-7.5c-6.8 0-12.3-5.5-12.3-12.3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const icons: Record<string, React.ComponentType> = { travellers: TravellersIcon, pricing: PricingIcon, support: SupportIcon };

export function FeatureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [cards, setCards] = useState<FeatureCard[]>([]);
  const [visible, setVisible] = useState(false);
  const [travellerCount, setTravellerCount] = useState(0);

  useEffect(() => {
    getFeatureCards()
      .then((data) => setCards(data.length > 0 ? data : FALLBACK_CARDS))
      .catch(() => setCards(FALLBACK_CARDS));
  }, []);

  const displayCards = cards.length > 0 ? cards : FALLBACK_CARDS;
  const countCard = displayCards.find((c) => (c.count_value ?? 0) > 0);
  const targetCount = countCard?.count_value ?? 500;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          const target = targetCount;
          const duration = 1200;
          const startTime = performance.now();
          const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setTravellerCount(Math.round(target * easeOutQuad(progress)));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [targetCount]);

  return (
    <section ref={sectionRef} className={`relative overflow-hidden py-16 sm:py-20 md:py-28 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      <div className="absolute inset-0 z-0">
        <Image src="/images/safari/why-travel-bg.png" alt="" fill className="object-cover object-center" priority={false} sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/88 via-white/92 to-white/90" />
      </div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(217,154,56,0.05),transparent_50%)]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(31,59,43,0.02),transparent_50%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 h-px w-3/4 bg-gradient-to-r from-transparent via-safari-gold/25 to-transparent" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 sm:mb-16 lg:mb-20 text-center">
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 sm:gap-3">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-safari-gold/60" />
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] sm:tracking-[0.5em] text-safari-gold drop-shadow-sm">Our Promise</p>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-safari-gold/60" />
          </div>
          <h2 className="mt-3 sm:mt-4 text-3xl font-heading font-bold text-charcoal sm:text-4xl md:text-5xl lg:text-6xl text-balance leading-tight drop-shadow-sm [text-shadow:0_1px_2px_rgba(255,255,255,0.9)]">Why Travel With Us</h2>
          <p className="mx-auto mt-4 sm:mt-6 max-w-3xl text-base sm:text-lg lg:text-xl leading-relaxed text-charcoal/90 px-1 [text-shadow:0_1px_2px_rgba(255,255,255,0.8)]">We blend decades of on-the-ground knowledge with bespoke planning to deliver effortless journeys beyond the guidebooks.</p>
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-4 sm:gap-6 md:gap-8 md:grid-cols-3">
          {displayCards.map((feature, index) => {
            const iconKey = (feature.icon ?? "").toLowerCase();
            const Icon = icons[iconKey] ?? icons.support;
            const hasCount = (feature.count_value ?? 0) > 0;
            return (
              <article
                key={`${feature.title}-${index}`}
                className={`group relative rounded-2xl sm:rounded-3xl border border-safari-sand/40 bg-white/98 backdrop-blur-md p-6 sm:p-8 md:p-10 text-center transition-all duration-500 ease-out shadow-lg hover:-translate-y-3 hover:shadow-2xl hover:shadow-safari-gold/20 hover:border-safari-gold/50 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: visible ? `${index * 120}ms` : "0ms" }}
              >
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-safari-gold/8 via-transparent to-safari-green/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative mx-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-xl sm:rounded-2xl border-2 border-safari-gold/40 bg-gradient-to-br from-safari-gold/5 via-white to-safari-sand/10 text-safari-gold shadow-md transition-all duration-300 group-hover:scale-110 group-hover:border-safari-gold group-hover:shadow-lg group-hover:shadow-safari-gold/30">
                  <Icon />
                </div>
                {hasCount ? (
                  <>
                    <p className="mt-6 sm:mt-8 text-4xl sm:text-5xl font-heading font-bold text-safari-green transition-transform duration-300 group-hover:scale-105">
                      {travellerCount.toLocaleString()}<span className="text-2xl sm:text-3xl font-bold text-safari-gold">+</span>
                    </p>
                    <h3 className="mt-4 text-xl sm:text-2xl font-semibold tracking-tight text-charcoal">{feature.headline || feature.title}</h3>
                  </>
                ) : (
                  <h3 className="mt-6 sm:mt-8 text-xl sm:text-2xl font-semibold tracking-tight text-charcoal">{feature.headline || feature.title}</h3>
                )}
                <div className="mx-auto mt-5 sm:mt-6 h-0.5 w-20 bg-gradient-to-r from-transparent via-safari-gold/60 to-transparent transition-all duration-300 group-hover:w-24 group-hover:via-safari-gold" />
                {(feature.copy || feature.title) && <p className="mt-5 sm:mt-6 text-sm sm:text-base leading-relaxed text-charcoal/85">{feature.copy || feature.title}</p>}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-0 bg-gradient-to-r from-safari-gold to-safari-green transition-all duration-500 group-hover:w-3/4 rounded-full" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
