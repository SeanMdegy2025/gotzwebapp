import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import {
  adminGetLodge,
  adminUpdateLodge,
  adminDeleteLodge,
} from "@/lib/db/queries";

function mapLodge(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    name: String(r.name),
    slug: String(r.slug),
    location: r.location != null ? String(r.location) : undefined,
    type: r.type != null ? String(r.type) : undefined,
    mood: r.mood != null ? String(r.mood) : undefined,
    short_description: r.short_description != null ? String(r.short_description) : undefined,
    description: undefined as string | undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
    amenities: [] as string[],
    price_from: r.price_from != null ? Number(r.price_from) : undefined,
    capacity: undefined as number | undefined,
    display_order: Number(r.display_order ?? 0),
    is_active: Boolean(r.is_active),
    is_featured: false,
    published_at: undefined as string | undefined,
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
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
  const row = await adminGetLodge(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ lodge: mapLodge(row) });
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
  await adminUpdateLodge(id, body);
  const row = await adminGetLodge(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ lodge: mapLodge(row) });
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
  await adminDeleteLodge(id);
  return NextResponse.json({ message: "Deleted" });
}
