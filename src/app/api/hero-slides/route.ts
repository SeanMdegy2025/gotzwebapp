import { NextResponse } from "next/server";
import { getHeroSlides } from "@/lib/db/queries";
import { fallbackHeroSlides } from "@/lib/data/fallbacks";
import { hasDb } from "@/lib/db/client";

export async function GET() {
  if (hasDb()) {
    try {
      const data = await getHeroSlides();
      return NextResponse.json({ data });
    } catch {
      // fall through to fallback
    }
  }
  return NextResponse.json({ data: fallbackHeroSlides });
}
