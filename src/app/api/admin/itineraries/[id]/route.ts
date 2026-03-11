import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import {
  adminGetItinerary,
  adminUpdateItinerary,
  adminDeleteItinerary,
  getItineraryImages,
  adminSetItineraryImages,
} from "@/lib/db/queries";

function parseJson<T>(v: unknown): T | undefined {
  if (v == null) return undefined;
  if (typeof v === "string") {
    try { return JSON.parse(v) as T; } catch { return undefined; }
  }
  return v as T;
}

function mapItinerary(r: Record<string, unknown>, images?: Array<{ id: number; image_base64: string; display_order: number }>) {
  return {
    id: Number(r.id),
    title: String(r.title),
    slug: String(r.slug),
    summary: r.summary != null ? String(r.summary) : undefined,
    description: r.description != null ? String(r.description) : undefined,
    badge: r.badge != null ? String(r.badge) : undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
    duration_days: r.duration_days != null ? Number(r.duration_days) : 0,
    price_from: r.price_from != null ? Number(r.price_from) : undefined,
    difficulty: r.difficulty != null ? String(r.difficulty) : undefined,
    highlights: parseJson<string[]>(r.highlights) ?? [],
    inclusions: parseJson<string[]>(r.inclusions) ?? [],
    exclusions: parseJson<string[]>(r.exclusions) ?? [],
    days: parseJson<Array<{ day_number: number; title?: string; description?: string; accommodation?: string; meals?: string }>>(r.days) ?? [],
    display_order: Number(r.display_order ?? 0),
    is_featured: false,
    published_at: undefined as string | undefined,
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
    images: images ?? [],
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(_request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const row = await adminGetItinerary(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const images = await getItineraryImages(id);
  return NextResponse.json({ itinerary: mapItinerary(row, images) });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) {
    return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  }
  const body = await request.json().catch(() => ({}));
  const { images: imagesPayload, ...rest } = body as { images?: Array<{ image_base64: string }>; [k: string]: unknown };
  await adminUpdateItinerary(id, rest);
  if (Array.isArray(imagesPayload)) {
    await adminSetItineraryImages(id, imagesPayload);
  }
  const row = await adminGetItinerary(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const images = await getItineraryImages(id);
  return NextResponse.json({ itinerary: mapItinerary(row, images) });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(_request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) {
    return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  }
  await adminDeleteItinerary(id);
  return NextResponse.json({ message: "Deleted" });
}
