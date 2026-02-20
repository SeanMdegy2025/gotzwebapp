import { NextRequest, NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { getLodgeBySlug } from "@/lib/db/queries";
import { fallbackLodges } from "@/lib/data/fallbacks";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (hasDb()) {
    try {
      const lodge = await getLodgeBySlug(slug);
      if (lodge) return NextResponse.json({ data: lodge });
    } catch {}
  }
  const lodge = fallbackLodges.find((l) => l.slug === slug) ?? null;
  if (!lodge) {
    return NextResponse.json({ message: "Lodge not found." }, { status: 404 });
  }
  return NextResponse.json({ data: lodge });
}
