import Link from "next/link";
import { notFound } from "next/navigation";
import { getLodgeBySlug } from "@/lib/db/queries";
import { getLodge } from "@/lib/api";
import { toImageSrc } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lodge = await getLodgeBySlug(slug) ?? await getLodge(slug);
  if (!lodge) return { title: "Lodges & Camps – Go Tanzania Safari" };
  return {
    title: `${lodge.name} – Lodges & Camps`,
    description: lodge.short_description ?? lodge.mood ?? undefined,
  };
}

export default async function LodgeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lodge = await getLodgeBySlug(slug) ?? await getLodge(slug);
  if (!lodge) notFound();

  const imageSrc = toImageSrc(lodge.image_base64) ?? "/images/safari/lodge-1.jpg";
  const priceFormatted =
    lodge.price_from != null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(Number(lodge.price_from))
      : null;

  return (
    <div className="min-h-screen text-charcoal">
      <article>
        <div className="relative h-[45vh] min-h-[280px] max-h-[480px] w-full overflow-hidden bg-charcoal">
          <img
            src={imageSrc}
            alt={lodge.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <div className="mx-auto max-w-4xl">
              {lodge.location && (
                <span className="inline-block rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">
                  {lodge.location}
                </span>
              )}
              <h1 className="text-3xl font-heading font-bold text-white sm:text-4xl leading-tight">
                {lodge.name}
              </h1>
              {priceFormatted && (
                <p className="mt-2 text-lg font-semibold text-safari-gold">
                  From {priceFormatted}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          {(lodge.short_description || lodge.mood) && (
            <div className="prose prose-lg max-w-none text-charcoal/90">
              <p className="text-lg leading-relaxed">
                {lodge.short_description ?? lodge.mood}
              </p>
            </div>
          )}

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-safari-green px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-safari-green/90 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 min-h-[48px]"
            >
              Request availability
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/#lodges"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-charcoal/20 px-6 py-3.5 text-sm font-semibold text-charcoal transition hover:bg-charcoal/5 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 min-h-[48px]"
            >
              ← All lodges & camps
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
