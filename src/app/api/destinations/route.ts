import { NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { getDestinationsWithImages } from "@/lib/db/queries";
import { fallbackDestinations } from "@/lib/data/fallbacks";

export async function GET() {
  if (hasDb()) {
    try {
      const data = await getDestinationsWithImages();
      return NextResponse.json({ data });
    } catch {}
  }
  return NextResponse.json({ data: fallbackDestinations });
}
