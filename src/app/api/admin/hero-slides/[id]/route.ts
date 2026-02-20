import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import { adminGetHeroSlide, adminUpdateHeroSlide, adminDeleteHeroSlide } from "@/lib/db/queries";

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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated(_req)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const row = await adminGetHeroSlide(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ hero_slide: mapSlide(row) });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  const body = await request.json().catch(() => ({}));
  await adminUpdateHeroSlide(id, body);
  const row = await adminGetHeroSlide(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ hero_slide: mapSlide(row) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated(_req)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  await adminDeleteHeroSlide(id);
  return NextResponse.json({ message: "Deleted" });
}
