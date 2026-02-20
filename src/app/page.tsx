import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ContactForm } from "@/components/ContactForm";
import { FeatureSection } from "@/components/FeatureSection";
import { BackToTop } from "@/components/BackToTop";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionDivider, SectionDividerMuted } from "@/components/SectionDivider";
import {
  getAboutStats,
  getAboutHighlights,
  getItineraries,
  getDestinations,
  getLodges,
  getContactChannels,
  getContactQuickFacts,
  getTourPackages,
  toImageSrc,
} from "@/lib/api";

const FALLBACK_STATS = [
  { value: "18+", label: "Years curating luxury safaris" },
  { value: "32", label: "Handpicked camps & lodges" },
  { value: "96%", label: "Guest satisfaction rating" },
];

const FALLBACK_HIGHLIGHTS = [
  { title: "Dedicated Journey Architect", copy: "A single expert consultant curates, books, and monitors every detail from the first call to your return home." },
  { title: "Conservation First", copy: "Partnerships with community conservancies, carbon offset initiatives, and low-impact travel practices." },
  { title: "Seamless Logistics", copy: "Private charters, VIP fast-track on arrival, and on-call concierges ensure your itinerary flows effortlessly." },
];

const FALLBACK_DESTINATIONS = [
  { name: "Serengeti National Park", tag: "Great Migration", image: "/images/safari/wildlife-herd.jpg", description: "River-crossing drama, predator action, endless horizons under technicolour sunsets." },
  { name: "Ngorongoro Crater", tag: "World Heritage", image: "/images/safari/wildlife-herd.jpg", description: "A collapsed caldera teeming with BIG5 sightings, Maasai culture, and mist-draped mornings." },
  { name: "Mount Kilimanjaro", tag: "Summit Trek", image: "/images/safari/beach-2.jpg", description: "Africa's rooftop crowned by glaciers, alpine desert moonscapes, and iconic Uhuru sunrise." },
  { name: "Ruaha & Selous Reserves", tag: "Southern Circuit", image: "/images/safari/wildlife-herd.jpg", description: "Remote fly-in safaris with boating on the Rufiji, walking trails, and off-grid luxury camps." },
  { name: "Zanzibar Archipelago", tag: "Coastal Haven", image: "/images/safari/beach-2.jpg", description: "From Matemwe reefs to Mnemba atoll, drift between spice farms and barefoot luxury hideaways." },
];

const FALLBACK_CHANNELS = [
  { label: "Call", value: "+255 (0) 742 123 456", detail: "Daily 08:00 – 20:00 East Africa Time" },
  { label: "Email", value: "bookings@gotanzaniasafari.com", detail: "Expect a crafted itinerary within 24 hours" },
  { label: "WhatsApp", value: "+255 (0) 742 123 456", detail: "Instant updates & on-trip assistance" },
];

const FALLBACK_QUICK_FACTS = [
  "Dedicated concierge from pre-trip briefing to touchdown back home.",
  "Access to a private guest portal with live itinerary updates.",
  "Emergency response network spanning Tanzania and Zanzibar.",
];

export default async function Home() {
  let aboutStats = FALLBACK_STATS;
  let aboutHighlights = FALLBACK_HIGHLIGHTS;
  let safariItems: Array<{ slug: string; title: string; summary?: string; meta: string; image: string; linkTo: "itinerary" | "tour-package" }> = [];
  let destinationSpots = FALLBACK_DESTINATIONS;
  let signatureLodges: Array<{ name: string; location: string; image: string; mood: string }> = [];
  let contactChannels: Array<{ label: string; value: string; detail?: string }> = FALLBACK_CHANNELS;
  let contactQuickFacts = FALLBACK_QUICK_FACTS;

  try {
    const [stats, highlights, itineraries, destinations, lodges, channels, quickFacts, tourPackages] = await Promise.all([
      getAboutStats(),
      getAboutHighlights(),
      getItineraries(),
      getDestinations(),
      getLodges(),
      getContactChannels(),
      getContactQuickFacts(),
      getTourPackages(),
    ]);
    if (stats.length > 0) aboutStats = stats;
    if (highlights.length > 0) aboutHighlights = highlights;
    if (channels.length > 0) contactChannels = channels;
    if (quickFacts.length > 0) contactQuickFacts = quickFacts;

    if (itineraries.length > 0) {
      safariItems = itineraries.slice(0, 6).map((i) => ({
        slug: i.slug,
        title: i.title,
        summary: i.summary ?? undefined,
        meta: [i.duration_days ? `${i.duration_days} days` : null, i.badge].filter(Boolean).join(" · ") || "Safari",
        image: toImageSrc(i.image_base64) ?? "/images/safari/wildlife-zebra.jpg",
        linkTo: "itinerary" as const,
      }));
    } else if (tourPackages.length > 0) {
      safariItems = tourPackages.slice(0, 6).map((p) => {
        const img = p.hero_image?.cover || p.hero_image?.url || (p.images?.[0] as string) || "/images/safari/wildlife-zebra.jpg";
        return {
          slug: p.slug,
          title: p.title,
          summary: p.short_description ?? undefined,
          meta: [p.duration_days ? `${p.duration_days} days` : null].filter(Boolean).join(" · ") || "Package",
          image: img,
          linkTo: "tour-package" as const,
        };
      });
    } else {
      safariItems = [
        { slug: "great-migration-serengeti", title: "Great Migration Serengeti Safari", summary: "Witness river crossings and endless savannah herds with private guides.", meta: "7 days · Serengeti & Grumeti", image: "/images/safari/wildlife-zebra.jpg", linkTo: "tour-package" },
        { slug: "kilimanjaro-machame", title: "Kilimanjaro Machame Summit Trek", summary: "Small-group climbs with acclimatisation camps and expert mountain crew.", meta: "8 days · Machame Route", image: "/images/safari/wildlife-giraffe.jpg", linkTo: "tour-package" },
        { slug: "zanzibar-spice-beach", title: "Zanzibar Spice & Beach Escape", summary: "Boutique Stone Town stays paired with barefoot luxury on Nungwi sands.", meta: "5 days · Zanzibar Archipelago", image: "/images/safari/beach-1.jpg", linkTo: "tour-package" },
      ];
    }

    if (destinations.length > 0) {
      destinationSpots = destinations.map((d) => ({
        name: d.name,
        tag: d.tag || d.region || "",
        image: toImageSrc(d.image_base64) ?? "/images/safari/wildlife-herd.jpg",
        description: d.description || d.teaser || "",
      }));
    }

    if (lodges.length > 0) {
      signatureLodges = lodges.slice(0, 6).map((l) => ({
        name: l.name,
        location: l.location || "",
        image: toImageSrc(l.image_base64) ?? "/images/safari/lodge-1.jpg",
        mood: l.short_description || l.mood || "",
      }));
    } else {
      signatureLodges = [
        { name: "Four Seasons Safari Lodge", location: "Serengeti Plains", image: "/images/safari/lodge-1.jpg", mood: "Waterhole-facing infinity pools & spa sanctuaries in the savannah canopy." },
        { name: "Gibb's Farm Manor House", location: "Ngorongoro Highlands", image: "/images/safari/lodge-2.jpg", mood: "Artist cottages, organic farm-to-table dining, and valley views wrapped in coffee estates." },
        { name: "The Residence Zanzibar", location: "Kizimkazi Peninsula", image: "/images/safari/beach-3.jpg", mood: "Private pool villas, butler-led service, and azure lagoons inspired by Swahili heritage." },
      ];
    }
  } catch {
    safariItems = [
      { slug: "great-migration-serengeti", title: "Great Migration Serengeti Safari", summary: "Witness river crossings and endless savannah herds with private guides.", meta: "7 days · Serengeti & Grumeti", image: "/images/safari/wildlife-zebra.jpg", linkTo: "tour-package" },
      { slug: "kilimanjaro-machame", title: "Kilimanjaro Machame Summit Trek", summary: "Small-group climbs with acclimatisation camps and expert mountain crew.", meta: "8 days · Machame Route", image: "/images/safari/wildlife-giraffe.jpg", linkTo: "tour-package" },
      { slug: "zanzibar-spice-beach", title: "Zanzibar Spice & Beach Escape", summary: "Boutique Stone Town stays paired with barefoot luxury on Nungwi sands.", meta: "5 days · Zanzibar Archipelago", image: "/images/safari/beach-1.jpg", linkTo: "tour-package" },
    ];
    signatureLodges = [
      { name: "Four Seasons Safari Lodge", location: "Serengeti Plains", image: "/images/safari/lodge-1.jpg", mood: "Waterhole-facing infinity pools & spa sanctuaries in the savannah canopy." },
      { name: "Gibb's Farm Manor House", location: "Ngorongoro Highlands", image: "/images/safari/lodge-2.jpg", mood: "Artist cottages, organic farm-to-table dining, and valley views wrapped in coffee estates." },
      { name: "The Residence Zanzibar", location: "Kizimkazi Peninsula", image: "/images/safari/beach-3.jpg", mood: "Private pool villas, butler-led service, and azure lagoons inspired by Swahili heritage." },
    ];
  }

  return (
    <div className="min-h-screen text-charcoal m-0 p-0 overflow-x-hidden w-full max-w-[100vw]">
      <main className="pt-0 m-0 w-full min-w-0">
        <HeroCarousel />
        <FeatureSection />

        {/* About - dark section */}
        <section id="about" className="relative overflow-hidden bg-gradient-to-b from-charcoal via-charcoal-dark to-charcoal text-white py-20 sm:py-28 lg:py-32">
          <div className="absolute inset-0 z-0 opacity-[0.12]">
            <Image src="/images/safari/wildlife-zebra.jpg" alt="" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/90 via-charcoal/85 to-charcoal/90" />
          </div>
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,154,56,0.15),transparent_60%)]" />
          <div className="noise-overlay z-[1]" />
          <SectionDivider />
          <ScrollReveal>
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-10 lg:gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-6">
                <span className="inline-block rounded-full border-2 border-safari-gold/50 bg-safari-gold/10 px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-safari-gold">
                  Authentic Tanzanian Expertise
                </span>
                <h2 className="text-3xl font-heading font-bold text-white leading-tight sm:text-4xl md:text-5xl lg:text-6xl text-balance border-b-2 border-safari-gold/40 pb-4 sm:pb-6">
                  Journeys designed by locals who live, breathe, and protect Tanzania
                </h2>
                <p className="text-lg sm:text-xl leading-relaxed text-white/85 max-w-2xl">
                  We move beyond brochure itineraries. Our Dar es Salaam and Arusha teams collaborate daily with guides, lodge owners, and conservation partners to secure privileged access and real-time intelligence.
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4 pt-4">
                  <Link href="#contact" className="group relative overflow-hidden rounded-full bg-gradient-to-r from-safari-green to-safari-green/90 px-6 py-3.5 sm:px-8 sm:py-4 text-sm font-semibold text-white transition-all duration-300 hover:from-charcoal hover:to-charcoal/90 hover:shadow-xl hover:shadow-safari-green/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-charcoal min-h-[44px] inline-flex items-center">
                    <span className="relative z-10 flex items-center">
                      Speak to a Journey Architect
                      <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                  <Link href="#safaris" className="group rounded-full border-2 border-safari-gold bg-white/10 backdrop-blur-sm px-6 py-3.5 sm:px-8 sm:py-4 text-sm font-semibold text-safari-gold transition-all duration-300 hover:bg-safari-gold hover:text-charcoal hover:shadow-lg hover:shadow-safari-gold/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-charcoal min-h-[44px] inline-flex items-center">
                    View Safaris
                    <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-xl transition-all duration-300 hover:border-safari-gold/50 hover:shadow-2xl hover:shadow-safari-gold/20">
                <ul className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
                  {aboutStats.map((stat) => (
                    <li key={stat.label} className="group relative rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 border border-white/20 px-5 py-4 sm:px-8 sm:py-6 text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:from-safari-gold/20 hover:via-white/15 hover:to-white/10 hover:border-safari-gold/40">
                      <p className="text-3xl sm:text-4xl font-heading font-bold text-safari-gold transition-transform duration-300 group-hover:scale-110">{stat.value}</p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">{stat.label}</p>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-gradient-to-r from-safari-gold to-transparent transition-all duration-300 group-hover:w-full rounded-full" />
                    </li>
                  ))}
                </ul>
                <div className="mt-8 sm:mt-10 rounded-xl sm:rounded-2xl border border-safari-gold/40 bg-gradient-to-br from-safari-gold/15 via-safari-gold/10 to-transparent p-7 sm:p-8 transition-all duration-300 hover:border-safari-gold/60 hover:shadow-lg hover:shadow-safari-gold/20">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-safari-gold/80 to-transparent" />
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-safari-gold">Accreditations</p>
                    <div className="h-px flex-1 bg-gradient-to-l from-safari-gold/80 to-transparent" />
                  </div>
                  <p className="text-sm leading-relaxed text-white/90">
                    Proud members of the Tanzania Association of Tour Operators (TATO), ATTA, and Leave No Trace. We hand-select suppliers championing eco-conscious luxury.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 grid gap-6 sm:gap-8 md:grid-cols-3">
              {aboutHighlights.map((h) => (
                <article key={h.title} className="group relative rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md p-7 sm:p-8 transition-all duration-500 hover:-translate-y-2 hover:border-safari-gold/50 hover:shadow-2xl hover:shadow-safari-gold/20">
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-safari-gold/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative inline-flex rounded-full bg-gradient-to-r from-safari-gold/25 to-safari-gold/15 border border-safari-gold/40 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-white shadow-sm transition-all duration-300 group-hover:border-safari-gold/60 group-hover:shadow-md">
                    Core Pillar
                  </div>
                  <h3 className="mt-6 text-xl sm:text-2xl font-heading font-bold text-white transition-transform duration-300 group-hover:scale-105">{h.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-white/80">{h.copy}</p>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-0 bg-gradient-to-r from-safari-gold to-safari-green transition-all duration-500 group-hover:w-3/4 rounded-full" />
                </article>
              ))}
            </div>
          </div>
          </ScrollReveal>
        </section>

        {/* Packages - safari green */}
        <section id="safaris" className="relative overflow-hidden bg-gradient-to-b from-safari-green via-safari-green-dark to-safari-green py-20 sm:py-28 lg:py-32 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)", backgroundSize: "50px 50px" }} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/30" />
          <ScrollReveal>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 sm:mb-16 lg:mb-20 text-center">
              <span className="inline-block rounded-full border-2 border-safari-gold/50 bg-safari-gold/10 px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-safari-gold mb-4 sm:mb-6">
                Safaris and Itineraries
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white leading-tight lg:text-6xl xl:text-7xl text-balance mx-auto max-w-4xl border-b-2 border-safari-gold/40 pb-4 sm:pb-6 mb-4 sm:mb-6">
                Preview a few of our most-requested{" "}
                <span className="text-safari-gold block sm:inline">tailored itineraries</span>
              </h2>
              <p className="mx-auto max-w-3xl text-base sm:text-lg lg:text-xl leading-relaxed text-white/90 px-1">
                Every journey is individually reimagined around your pace, interests, and travel style.
              </p>
            </div>
            <div className="grid gap-6 sm:gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3 mb-16 sm:mb-20">
              {safariItems.map((pkg, index) => (
                <article
                  key={pkg.slug ? `${pkg.slug}-${index}` : `safari-${index}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] hover:border-white/40 hover:border-safari-gold/30 card-shine"
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <div className="absolute left-4 top-4 sm:left-6 sm:top-6 z-10">
                      <span className="inline-flex items-center rounded-full bg-safari-gold px-3 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-charcoal shadow-glow-gold backdrop-blur-sm">
                        Package
                      </span>
                    </div>
                    <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                      <p className="text-xs sm:text-sm font-semibold text-white">{pkg.meta}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 sm:gap-5 p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-heading text-white mb-2 sm:mb-3 leading-tight">{pkg.title}</h3>
                    <p className="text-sm leading-relaxed text-white/75 line-clamp-3">{pkg.summary}</p>
                    <div className="mt-auto pt-6 border-t border-white/10">
                      <Link
                        href={pkg.linkTo === "itinerary" ? `/itineraries/${pkg.slug}` : `/tour-packages/${pkg.slug}`}
                        className="group flex items-center justify-center rounded-full border-2 border-white/40 bg-white/5 backdrop-blur-sm px-5 py-3 sm:px-6 sm:py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-safari-green min-h-[44px]"
                      >
                        View Details
                        <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center">
              <Link
                href={safariItems[0]?.linkTo === "itinerary" ? "/itineraries" : "/tour-packages"}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-safari-gold via-safari-gold/95 to-orange-500 px-6 py-4 sm:px-10 sm:py-5 text-sm sm:text-base font-bold text-charcoal shadow-lg transition-all duration-300 hover:from-safari-gold-light hover:via-safari-gold hover:to-orange-400 hover:shadow-2xl hover:shadow-safari-gold/40 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-safari-green min-h-[48px]"
              >
                <span className="relative z-10 flex items-center">
                  {safariItems[0]?.linkTo === "itinerary" ? "View All Itineraries" : "View All Packages"}
                  <svg className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
          </ScrollReveal>
        </section>

        {/* Destinations - 6-col grid */}
        <section id="destinations" className="relative overflow-hidden py-20 sm:py-28 lg:py-32 pb-24 sm:pb-28 lg:pb-36">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/safari/why-travel-bg.png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-safari-sand/95 to-white" />
          </div>
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(217,154,56,0.04),transparent_60%)]" />
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_20%_70%,rgba(31,59,43,0.02),transparent_55%)]" />
          <SectionDividerMuted />
          <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-10 sm:mb-16 text-center">
              <span className="inline-block rounded-full border-2 border-safari-gold/50 bg-safari-gold/10 px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-safari-gold mb-4 sm:mb-6">
                Iconic Destinations
              </span>
              <h2 className="text-3xl font-heading font-bold text-charcoal leading-tight sm:text-4xl md:text-5xl lg:text-6xl text-balance mx-auto max-w-4xl border-b-2 border-safari-gold/40 pb-4 sm:pb-6 mb-4 sm:mb-6">
                Choose the landscapes that speak to your sense of wonder
              </h2>
              <p className="mx-auto max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-charcoal/75 mb-6 sm:mb-8">
                We orchestrate seamless multi-region journeys that stitch together the north's wildlife circuits, the remote south, and island escapes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                <Link href="#safaris" className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-safari-green to-safari-green/90 px-5 py-3.5 sm:px-7 sm:py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:from-charcoal hover:to-charcoal/90 hover:shadow-xl hover:shadow-safari-green/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 min-h-[44px] w-full sm:w-auto">
                  View sample itineraries
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
                <Link href="#lodges" className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-safari-green bg-white/90 px-5 py-3.5 sm:px-7 sm:py-3.5 text-sm font-semibold text-safari-green transition-all duration-300 hover:bg-safari-green hover:text-white focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 min-h-[44px] w-full sm:w-auto">
                  Explore our lodge collection
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
            <div className="grid gap-5 sm:gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-6">
              {destinationSpots.map((spot, index) => (
                <article
                  key={spot.name ? `dest-${spot.name}-${index}` : `dest-${index}`}
                  className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-large transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] hover:-translate-y-2 card-shine min-h-[280px] sm:min-h-[320px] ${
                    index === 0 ? "md:col-span-2 min-h-[320px] sm:min-h-[380px] lg:col-span-3 lg:row-span-2 lg:min-h-[480px]" : "lg:col-span-3 lg:min-h-[320px]"
                  }`}
                >
                  <div className="absolute inset-0">
                    <img
                      src={typeof spot.image === "string" ? spot.image : "/images/safari/wildlife-herd.jpg"}
                      alt={spot.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
                  <div className="absolute inset-x-0 bottom-0 space-y-2 sm:space-y-4 p-4 sm:p-6 md:p-8 text-white">
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-safari-gold">{spot.tag}</p>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold leading-tight">{spot.name}</h3>
                    <p className="max-w-lg text-sm sm:text-base leading-relaxed text-white/90 line-clamp-2 sm:line-clamp-none">{spot.description}</p>
                    <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-4">
                      <span className="rounded-full border border-white/40 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/90">Sample Itinerary</span>
                      <span className="rounded-full border border-white/40 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/90">Best Season</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          </ScrollReveal>
        </section>

        {/* Lodges */}
        <section id="lodges" className="relative overflow-hidden border-t-2 border-safari-sand/60 bg-gradient-to-b from-safari-sand/40 via-white to-safari-sand/10 pt-20 sm:pt-28 lg:pt-36 pb-20 sm:pb-24 lg:pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(31,59,43,0.05),transparent_60%)]" />
          <SectionDividerMuted />
          <ScrollReveal>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-10 sm:mb-16 text-center">
              <span className="inline-block rounded-full border-2 border-safari-green/50 bg-safari-green/10 px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-safari-green mb-4 sm:mb-6">
                Lodges & Camps
              </span>
              <h2 className="text-3xl font-heading font-bold text-charcoal leading-tight sm:text-4xl md:text-5xl lg:text-6xl text-balance mx-auto max-w-4xl border-b-2 border-safari-green/40 pb-4 sm:pb-6 mb-4 sm:mb-6">
                Hand-selected stays that marry safari romance with elevated comfort
              </h2>
              <p className="mx-auto max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-charcoal/75 mb-6 sm:mb-8">
                From treehouse suites and star-bed sleepouts to oceanfront sanctuaries, we recommend properties that align with your style.
              </p>
              <Link href="#contact" className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-safari-green to-safari-green/90 px-6 py-3.5 sm:px-8 sm:py-4 text-sm font-semibold text-white transition-all duration-300 hover:from-charcoal hover:to-charcoal/90 hover:shadow-xl hover:shadow-safari-green/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 min-h-[44px]">
                <span className="relative z-10 flex items-center">
                  Request Availability
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </div>
            <div className="grid gap-5 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {signatureLodges.map((lodge, index) => (
                  <article key={lodge.name ? `lodge-${lodge.name}-${index}` : `lodge-${index}`} className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-safari-sand/30 bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-md shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-safari-gold/50 card-shine">
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-safari-gold/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative h-56 sm:h-64 overflow-hidden">
                      <img
                        src={lodge.image}
                        alt={lodge.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute left-5 sm:left-6 top-5 sm:top-6 rounded-full bg-white/90 backdrop-blur-sm border border-white/30 px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-[0.3em] text-charcoal shadow-md">
                        {lodge.location}
                      </div>
                    </div>
                    <div className="relative flex flex-col gap-4 sm:gap-5 p-6 sm:p-8">
                      <h3 className="text-xl sm:text-2xl font-heading font-bold text-charcoal transition-transform duration-300 group-hover:scale-105">{lodge.name}</h3>
                      <p className="text-sm sm:text-base leading-relaxed text-charcoal/75">{lodge.mood}</p>
                      <div className="mt-auto flex items-center justify-between pt-5 sm:pt-6 border-t border-safari-sand/40 text-sm font-bold uppercase tracking-[0.3em] text-safari-gold">
                        <span>Inquire</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-0 bg-gradient-to-r from-safari-gold to-safari-green transition-all duration-500 group-hover:w-3/4 rounded-full" />
                  </article>
                ))}
            </div>
          </div>
          </ScrollReveal>
        </section>

        {/* Contact */}
        <section id="contact" className="relative overflow-hidden bg-gradient-to-b from-charcoal via-charcoal-dark to-charcoal text-white py-20 sm:py-28 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,154,56,0.12),transparent_60%)]" />
          <div className="noise-overlay z-[1]" />
          <SectionDivider />
          <ScrollReveal>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 sm:mb-16 text-center lg:mb-24">
              <span className="inline-block rounded-full border-2 border-safari-gold/50 bg-safari-gold/10 px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-safari-gold mb-4 sm:mb-6">
                Start Planning
              </span>
              <h2 className="mx-auto max-w-4xl text-3xl font-heading font-bold text-white leading-tight sm:text-4xl md:text-5xl lg:text-6xl text-balance border-b-2 border-safari-gold/40 pb-4 sm:pb-6 mb-4 sm:mb-6">
                Share your dream safari—we'll craft a tailored itinerary within 24 hours
              </h2>
              <p className="mx-auto max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-white/80">
                Tell us who you are travelling with, the wildlife you are eager to witness, and your ideal travel window.
              </p>
            </div>
            <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
              <div className="flex flex-col space-y-6 sm:space-y-8 order-2 lg:order-1">
                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-1">
                  {contactChannels.map((channel) => (
                    <div
                      key={channel.label}
                      className="group relative flex flex-col rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-br from-white/8 via-white/5 to-white/3 backdrop-blur-md p-6 sm:p-7 transition-all duration-500 hover:border-safari-gold/50 hover:shadow-xl hover:shadow-safari-gold/20 hover:-translate-y-1"
                    >
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-safari-gold">{channel.label}</p>
                      <p className="mb-auto text-lg sm:text-xl md:text-2xl font-heading font-bold leading-tight text-white break-all">{channel.value}</p>
                      <p className="mt-3 text-sm uppercase tracking-[0.2em] leading-relaxed text-white/70">{channel.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-br from-white/8 via-white/5 to-white/3 backdrop-blur-md p-7 sm:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-safari-gold/60 to-transparent" />
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-safari-gold">Why Choose Us</p>
                    <div className="h-px flex-1 bg-gradient-to-l from-safari-gold/60 to-transparent" />
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-white/80">
                    Dedicated concierge, live itinerary updates, and emergency support across Tanzania and Zanzibar.{" "}
                    <Link href="#about" className="font-semibold text-safari-gold underline decoration-safari-gold/60 underline-offset-2 hover:decoration-safari-gold focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-charcoal rounded">
                      See how we work
                    </Link>
                  </p>
                </div>
                <div className="rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-br from-white/8 via-white/5 to-white/3 backdrop-blur-md p-7 sm:p-8 transition-all duration-500 hover:border-safari-gold/50 hover:shadow-xl hover:shadow-safari-gold/20 hover:-translate-y-1">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-safari-gold/60 to-transparent" />
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-safari-gold">Meet us in person</p>
                    <div className="h-px flex-1 bg-gradient-to-l from-safari-gold/60 to-transparent" />
                  </div>
                  <p className="mb-6 text-base leading-relaxed text-white/90">
                    Go Tanzania Safari Studio · Sokoine Road, Arusha 23100 · Visits by appointment only
                  </p>
                  <div className="h-48 sm:h-56 overflow-hidden rounded-xl sm:rounded-2xl border border-white/20 shadow-md transition-all duration-300 hover:border-safari-gold/40 hover:shadow-lg group">
                    <iframe
                      title="Go Tanzania Safari Studio Map"
                      src="https://maps.google.com/maps?q=Sokoine+Road%2C+Arusha%2C+Tanzania&t=&z=14&ie=UTF8&iwloc=&output=embed"
                      className="h-full w-full opacity-90 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
              <div className="lg:sticky lg:top-8 lg:h-fit order-1 lg:order-2">
                <div className="rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md p-7 sm:p-9 lg:p-10 shadow-2xl">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
          </ScrollReveal>
        </section>
      </main>

      <footer className="relative bg-gradient-to-b from-white via-safari-sand/20 to-white border-t border-safari-sand/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,154,56,0.04),transparent_60%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-safari-gold/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs sm:text-sm lg:text-base text-charcoal/70 text-center sm:text-left">© {new Date().getFullYear()} Go Tanzania Safari Ltd. All rights reserved.</p>
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <Link href="https://www.instagram.com/gotanzaniasafariltd/?hl=en" target="_blank" rel="noopener noreferrer" className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 text-[#E4405F]" aria-label="Instagram">
                <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="https://www.facebook.com/gotanzaniasafariltd" target="_blank" rel="noopener noreferrer" className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2" aria-label="Facebook">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1877F2" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link href="#" className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2" aria-label="X (Twitter)">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#0F0F0F" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link href="#" className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2" aria-label="TikTok">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#000000" aria-hidden>
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
