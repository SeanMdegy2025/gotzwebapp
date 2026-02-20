import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import { adminListHeroSlides, adminCreateHeroSlide } from "@/lib/db/queries";

function mapSlide(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    title: String(r.title),
    label: r.label != null ? String(r.label) : undefined,
    subtitle: r.subtitle != null ? String(r.subtitle) : undefined,
    description: r.description != null ? String(r.description) : undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
    cta_label: r.cta_label != null ? String(r.cta_label) : "",
    cta_url: r.cta_url != null ? String(r.cta_url) : "",
    position: Number(r.position ?? 0),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ hero_slides: [] });
  const list = await adminListHeroSlides();
  return NextResponse.json({ hero_slides: list.map((r) => mapSlide(r as Record<string, unknown>)) });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ message: "Database not configured" }, { status: 501 });
  const body = await request.json().catch(() => ({}));
  const idResult = await adminCreateHeroSlide(body);
  if (!idResult) return NextResponse.json({ message: "Failed to create" }, { status: 500 });
  const hero_slide = mapSlide({ ...body, id: idResult.id, position: body.position ?? 0, is_active: body.is_active !== false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  return NextResponse.json({ hero_slide: { ...hero_slide, id: idResult.id } });
}
