import { NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { getContactChannels } from "@/lib/db/queries";
import { fallbackContactChannels } from "@/lib/data/fallbacks";

export async function GET() {
  if (hasDb()) {
    try {
      const data = await getContactChannels();
      return NextResponse.json({ data });
    } catch {}
  }
  return NextResponse.json({ data: fallbackContactChannels });
}
