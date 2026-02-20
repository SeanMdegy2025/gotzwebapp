import { NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { getAboutHighlights } from "@/lib/db/queries";
import { fallbackAboutHighlights } from "@/lib/data/fallbacks";

export async function GET() {
  if (hasDb()) {
    try {
      const data = await getAboutHighlights();
      return NextResponse.json({ data });
    } catch {}
  }
  return NextResponse.json({ data: fallbackAboutHighlights });
}
