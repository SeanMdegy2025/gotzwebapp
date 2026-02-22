import Link from "next/link";
import { getItineraries, toImageSrc } from "@/lib/api";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata = {
  title: "Safaris & Itineraries – Go Tanzania Safari",
  description:
    "Preview our most-requested tailored itineraries. Every journey is individually reimagined around your pace, interests, and travel style.",
};

export default async function SafarisPage() {
  const itineraries = await getItineraries();

  return (
    <div className="min-h-screen text-charcoal">
      <section className="relative overflow-hidden bg-gradient-to-b from-safari-green via-safari-green-dark to-safari-green py-20 sm:py-28 lg:py-32 text-white">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/30" />
        <ScrollReveal>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 sm:mb-16 lg:mb-20 text-center">
              <span className="inline-block rounded-full border-2 border-safari-gold/50 bg-safari-gold/10 px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-safari-gold mb-4 sm:mb-6">
                Safaris and Itineraries
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white leading-tight lg:text-6xl xl:text-7xl text-balance mx-auto max-w-4xl border-b-2 border-safari-gold/40 pb-4 sm:pb-6 mb-4 sm:mb-6">
                Our most-requested{" "}
                <span className="text-safari-gold block sm:inline">tailored itineraries</span>
              </h1>
              <p className="mx-auto max-w-3xl text-base sm:text-lg lg:text-xl leading-relaxed text-white/90 px-1">
                Every journey is individually reimagined around your pace, interests, and travel style.
              </p>
            </div>
            <div className="grid gap-6 sm:gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
              {itineraries.map((it, index) => {
                const meta = [
                  it.duration_days ? `${it.duration_days} days` : null,
                  it.badge,
                ]
                  .filter(Boolean)
                  .join(" · ") || "Safari";
                const imageSrc =
                  toImageSrc(it.image_base64) ?? "/images/safari/wildlife-zebra.jpg";
                return (
                  <article
                    key={it.slug ?? it.id ?? index}
                    className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] hover:border-white/40 hover:border-safari-gold/30 card-shine"
                  >
                    <div className="relative h-56 sm:h-64 overflow-hidden">
                      <img
                        src={imageSrc}
                        alt={it.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      <div className="absolute left-4 top-4 sm:left-6 sm:top-6 z-10">
                        <span className="inline-flex items-center rounded-full bg-safari-gold px-3 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-charcoal shadow-glow-gold backdrop-blur-sm">
                          Safari
                        </span>
                      </div>
                      <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                        <p className="text-xs sm:text-sm font-semibold text-white">{meta}</p>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-4 sm:gap-5 p-6 sm:p-8">
                      <h2 className="text-xl sm:text-2xl font-heading text-white mb-2 sm:mb-3 leading-tight">
                        {it.title}
                      </h2>
                      <p className="text-sm leading-relaxed text-white/75 line-clamp-3">
                        {it.summary ?? ""}
                      </p>
                      <div className="mt-auto pt-6 border-t border-white/10">
                        <Link
                          href={`/itineraries/${it.slug}`}
                          className="group flex items-center justify-center rounded-full border-2 border-white/40 bg-white/5 backdrop-blur-sm px-5 py-3 sm:px-6 sm:py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-safari-green min-h-[44px]"
                        >
                          View Details
                          <svg
                            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            {itineraries.length === 0 && (
              <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center">
                <p className="text-white/90">No safaris published yet. Check back soon.</p>
                <Link
                  href="/#safaris"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-safari-gold px-6 py-3 text-sm font-semibold text-charcoal hover:bg-safari-gold-light"
                >
                  Back to Home
                </Link>
              </div>
            )}
            <div className="mt-16 text-center">
              <Link
                href="/#contact"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-safari-gold via-safari-gold/95 to-orange-500 px-6 py-4 sm:px-10 sm:py-5 text-sm sm:text-base font-bold text-charcoal shadow-lg transition-all duration-300 hover:from-safari-gold-light hover:via-safari-gold hover:to-orange-400 hover:shadow-2xl hover:shadow-safari-gold/40 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-safari-green min-h-[48px]"
              >
                <span className="relative z-10 flex items-center">
                  Start Planning
                  <svg
                    className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
