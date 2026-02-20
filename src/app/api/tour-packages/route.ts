import { NextRequest, NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { getTourPackages } from "@/lib/db/queries";
import { fallbackTourPackages } from "@/lib/data/fallbacks";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const perPage = Math.min(50, Math.max(1, Number(searchParams.get("per_page")) || 12));
  const featured = searchParams.get("featured") === "true";
  if (hasDb()) {
    try {
      let data = await getTourPackages(perPage);
      if (featured) data = data.filter((p) => p.is_featured);
      return NextResponse.json({ data, meta: { per_page: perPage, total: data.length } });
    } catch {}
  }
  let list = [...fallbackTourPackages];
  if (featured) list = list.filter((p) => p.is_featured);
  const data = list.slice(0, perPage);
  return NextResponse.json({ data, meta: { per_page: perPage, total: list.length } });
}
