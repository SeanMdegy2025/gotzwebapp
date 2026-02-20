import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import {
  adminListItineraries,
  adminCreateItinerary,
} from "@/lib/db/queries";

function mapItinerary(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    title: String(r.title),
    slug: String(r.slug),
    summary: r.summary != null ? String(r.summary) : undefined,
    badge: r.badge != null ? String(r.badge) : undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
    duration_days: r.duration_days != null ? Number(r.duration_days) : 0,
    price_from: r.price_from != null ? Number(r.price_from) : undefined,
    difficulty: r.difficulty != null ? String(r.difficulty) : undefined,
    highlights: [] as string[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    days: [] as { day_number: number; title?: string; description?: string; accommodation?: string; meals?: string }[],
    display_order: Number(r.display_order ?? 0),
    is_featured: false,
    published_at: undefined as string | undefined,
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ itineraries: [] });
  }
  const list = await adminListItineraries();
  const itineraries = list.map((r) => mapItinerary(r as Record<string, unknown>));
  return NextResponse.json({ itineraries });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ message: "Database not configured" }, { status: 501 });
  }
  const body = await request.json().catch(() => ({}));
  const idResult = await adminCreateItinerary(body);
  if (!idResult) {
    return NextResponse.json({ message: "Failed to create" }, { status: 500 });
  }
  const itinerary = mapItinerary({ ...body, id: idResult.id, slug: body.slug || (String(body.title).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")), display_order: body.display_order ?? 0, is_active: body.is_active !== false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  return NextResponse.json({ itinerary: { ...itinerary, id: idResult.id } });
}
