import { NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { getFeatureCards } from "@/lib/db/queries";
import { fallbackFeatureCards } from "@/lib/data/fallbacks";

export async function GET() {
  if (hasDb()) {
    try {
      const data = await getFeatureCards();
      return NextResponse.json({ data });
    } catch {}
  }
  return NextResponse.json({ data: fallbackFeatureCards });
}
