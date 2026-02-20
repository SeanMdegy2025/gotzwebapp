import { NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { getAboutStats } from "@/lib/db/queries";
import { fallbackAboutStats } from "@/lib/data/fallbacks";

export async function GET() {
  if (hasDb()) {
    try {
      const data = await getAboutStats();
      return NextResponse.json({ data });
    } catch {}
  }
  return NextResponse.json({ data: fallbackAboutStats });
}
