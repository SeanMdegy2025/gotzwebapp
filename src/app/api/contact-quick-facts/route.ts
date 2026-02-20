import { NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { getContactQuickFacts } from "@/lib/db/queries";
import { fallbackContactQuickFacts } from "@/lib/data/fallbacks";

export async function GET() {
  if (hasDb()) {
    try {
      const data = await getContactQuickFacts();
      return NextResponse.json({ data });
    } catch {}
  }
  return NextResponse.json({ data: fallbackContactQuickFacts });
}
