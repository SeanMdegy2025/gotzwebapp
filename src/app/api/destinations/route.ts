import { NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { getDestinations } from "@/lib/db/queries";
import { fallbackDestinations } from "@/lib/data/fallbacks";

export async function GET() {
  if (hasDb()) {
    try {
      const data = await getDestinations();
      return NextResponse.json({ data });
    } catch {}
  }
  return NextResponse.json({ data: fallbackDestinations });
}
