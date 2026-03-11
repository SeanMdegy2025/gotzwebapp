import Link from "next/link";
import { notFound } from "next/navigation";
import { getItineraryBySlug, getItineraryImages } from "@/lib/db/queries";
import { toImageSrc } from "@/lib/api";
import { SafariBookingForm } from "@/components/SafariBookingForm";
import { SafariGallery } from "@/components/SafariGallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const itinerary = await getItineraryBySlug(slug);
  if (!itinerary) return { title: "Safari – Go Tanzania Safari" };
  return {
    title: `${itinerary.title} – Go Tanzania Safari`,
    description: itinerary.summary ?? undefined,
  };
}

export default async function SafariDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const itinerary = await getItineraryBySlug(slug);
  if (!itinerary) notFound();

  const images = await getItineraryImages(itinerary.id);
  const allImageSrcs = [
    ...(itinerary.image_base64 ? [toImageSrc(itinerary.image_base64)] : []),
    ...images.map((img) => toImageSrc(img.image_base64)),
  ].filter(Boolean) as string[];
  const heroSrc = allImageSrcs[0] ?? "/images/safari/wildlife-zebra.jpg";

  const meta = [
    itinerary.duration_days ? `${itinerary.duration_days} days` : null,
    itinerary.badge,
  ]
    .filter(Boolean)
    .join(" · ") || "Safari";
  const priceFormatted =
    itinerary.price_from != null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(Number(itinerary.price_from))
      : null;

  return (
    <div className="min-h-screen text-charcoal">
      <article>
        <div className="relative h-[50vh] min-h-[320px] max-h-[560px] w-full overflow-hidden bg-charcoal">
          <img
            src={heroSrc}
            alt={itinerary.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-4xl">
              {itinerary.badge && (
                <span className="inline-block rounded-full bg-safari-gold px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-charcoal mb-4">
                  {itinerary.badge}
                </span>
              )}
              <h1 className="text-3xl font-heading font-bold text-white sm:text-4xl md:text-5xl leading-tight">
                {itinerary.title}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/90">{meta}</p>
              {priceFormatted && (
                <p className="mt-2 text-lg font-semibold text-safari-gold">
                  From {priceFormatted}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          {allImageSrcs.length > 1 && (
            <div className="mb-12">
              <h2 className="text-lg font-heading font-semibold text-charcoal mb-4">Gallery</h2>
              <SafariGallery images={allImageSrcs} title={itinerary.title} />
            </div>
          )}

          {itinerary.summary && (
            <div className="prose prose-lg max-w-none text-charcoal/90">
              <h2 className="text-xl font-heading font-semibold text-charcoal mt-0">Overview</h2>
              <p className="text-lg leading-relaxed">{itinerary.summary}</p>
            </div>
          )}

          {itinerary.description && (
            <div className="mt-10 prose prose-lg max-w-none text-charcoal/90">
              <h2 className="text-xl font-heading font-semibold text-charcoal">Details</h2>
              <div className="leading-relaxed whitespace-pre-wrap">{itinerary.description}</div>
            </div>
          )}

          {(itinerary.highlights?.length ?? 0) > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-heading font-semibold text-charcoal mb-4">Highlights</h2>
              <ul className="list-disc list-inside space-y-2 text-charcoal/90">
                {itinerary.highlights!.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {(itinerary.inclusions?.length ?? 0) > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-heading font-semibold text-charcoal mb-4">Included</h2>
              <ul className="list-disc list-inside space-y-2 text-charcoal/90">
                {itinerary.inclusions!.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          )}

          {(itinerary.exclusions?.length ?? 0) > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-heading font-semibold text-charcoal mb-4">Not included</h2>
              <ul className="list-disc list-inside space-y-2 text-charcoal/90">
                {itinerary.exclusions!.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          )}

          {(itinerary.days?.length ?? 0) > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-heading font-semibold text-charcoal mb-4">Day-by-day</h2>
              <div className="space-y-6">
                {itinerary.days!.map((d) => (
                  <div key={d.day_number} className="rounded-xl border border-safari-sand/40 bg-safari-sand/20 p-4 sm:p-5">
                    <h3 className="font-heading font-semibold text-charcoal">Day {d.day_number}{d.title ? ` – ${d.title}` : ""}</h3>
                    {d.description && <p className="mt-2 text-charcoal/90 text-sm sm:text-base">{d.description}</p>}
                    {(d.accommodation || d.meals) && (
                      <p className="mt-2 text-sm text-charcoal/70">
                        {d.accommodation && <span>Accommodation: {d.accommodation}</span>}
                        {d.accommodation && d.meals && " · "}
                        {d.meals && <span>Meals: {d.meals}</span>}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr,340px]">
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-safari-green px-6 py-3.5 text-sm font-semibold text-safari-green transition hover:bg-safari-green/10 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 min-h-[48px]"
              >
                Enquire about this safari
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/itineraries"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 px-6 py-3.5 text-sm font-semibold text-charcoal transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 min-h-[48px]"
              >
                ← All Safaris
              </Link>
            </div>
            <div>
              <SafariBookingForm
                itineraryId={itinerary.id}
                itinerarySlug={itinerary.slug}
                itineraryTitle={itinerary.title}
              />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
