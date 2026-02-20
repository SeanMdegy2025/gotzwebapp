import { NextRequest, NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { getItineraryBySlug } from "@/lib/db/queries";
import { fallbackItineraries } from "@/lib/data/fallbacks";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (hasDb()) {
    try {
      const item = await getItineraryBySlug(slug);
      if (item) {
        return NextResponse.json({ data: { ...item, highlights: [], inclusions: [], exclusions: [], days: [] } });
      }
    } catch {}
  }
  const item = fallbackItineraries.find((i) => i.slug === slug) ?? null;
  if (!item) {
    return NextResponse.json({ message: "Itinerary not found." }, { status: 404 });
  }
  return NextResponse.json({ data: { ...item, highlights: [], inclusions: [], exclusions: [], days: [] } });
}
