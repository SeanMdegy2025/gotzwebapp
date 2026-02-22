import Link from "next/link";
import { notFound } from "next/navigation";
import { getItinerary, toImageSrc } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const itinerary = await getItinerary(slug);
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
  const itinerary = await getItinerary(slug);
  if (!itinerary) notFound();

  const imageSrc =
    toImageSrc(itinerary.image_base64) ?? "/images/safari/wildlife-zebra.jpg";
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
            src={imageSrc}
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
          {itinerary.summary && (
            <div className="prose prose-lg max-w-none text-charcoal/90">
              <p className="text-lg leading-relaxed">{itinerary.summary}</p>
            </div>
          )}
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-safari-green px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-safari-green-dark hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 min-h-[48px]"
            >
              Enquire about this safari
              <svg
                className="h-4 w-4"
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
            <Link
              href="/itineraries"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-safari-green px-6 py-3.5 text-sm font-semibold text-safari-green transition hover:bg-safari-green/10 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 min-h-[48px]"
            >
              ← All Safaris
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
