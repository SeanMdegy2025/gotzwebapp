import { NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { getItineraries } from "@/lib/db/queries";
import { fallbackItineraries } from "@/lib/data/fallbacks";

export async function GET() {
  if (hasDb()) {
    try {
      const data = await getItineraries();
      return NextResponse.json({ data });
    } catch {}
  }
  return NextResponse.json({ data: fallbackItineraries });
}
