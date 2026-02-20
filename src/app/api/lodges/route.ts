import { NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { getLodges } from "@/lib/db/queries";
import { fallbackLodges } from "@/lib/data/fallbacks";

export async function GET() {
  if (hasDb()) {
    try {
      const data = await getLodges();
      return NextResponse.json({ data });
    } catch {}
  }
  return NextResponse.json({ data: fallbackLodges });
}
