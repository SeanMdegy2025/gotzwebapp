import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import { adminListTourPackages, adminCreateTourPackage } from "@/lib/db/queries";

function mapPackage(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    slug: String(r.slug),
    title: String(r.title),
    short_description: r.short_description != null ? String(r.short_description) : undefined,
    description: r.description != null ? String(r.description) : undefined,
    price_from: r.price_from != null ? Number(r.price_from) : undefined,
    duration_days: r.duration_days != null ? Number(r.duration_days) : undefined,
    max_participants: r.max_participants != null ? Number(r.max_participants) : undefined,
    is_featured: Boolean(r.is_featured),
    display_order: Number(r.display_order ?? 0),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ tour_packages: [] });
  const list = await adminListTourPackages();
  return NextResponse.json({ tour_packages: list.map((r) => mapPackage(r as Record<string, unknown>)) });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ message: "Database not configured" }, { status: 501 });
  const body = await request.json().catch(() => ({}));
  const idResult = await adminCreateTourPackage(body);
  if (!idResult) return NextResponse.json({ message: "Failed to create" }, { status: 500 });
  const slug = body.slug || String(body.title).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const tour_package = mapPackage({ ...body, id: idResult.id, slug, display_order: body.display_order ?? 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  return NextResponse.json({ tour_package: { ...tour_package, id: idResult.id } });
}
