import { NextRequest, NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { getTourPackageBySlug } from "@/lib/db/queries";
import { fallbackTourPackages } from "@/lib/data/fallbacks";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (hasDb()) {
    try {
      const pkg = await getTourPackageBySlug(slug);
      if (pkg) return NextResponse.json({ data: pkg });
    } catch {}
  }
  const pkg = fallbackTourPackages.find((p) => p.slug === slug) ?? null;
  if (!pkg) {
    return NextResponse.json({ message: "Tour package not found." }, { status: 404 });
  }
  return NextResponse.json({ data: pkg });
}
