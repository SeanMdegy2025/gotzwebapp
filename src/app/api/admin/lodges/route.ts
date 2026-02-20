import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import { adminListLodges, adminCreateLodge } from "@/lib/db/queries";

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

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ lodges: [] });
  }
  const list = await adminListLodges();
  const lodges = list.map((r) => mapLodge(r as Record<string, unknown>));
  return NextResponse.json({ lodges });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ message: "Database not configured" }, { status: 501 });
  }
  const body = await request.json().catch(() => ({}));
  const idResult = await adminCreateLodge(body);
  if (!idResult) {
    return NextResponse.json({ message: "Failed to create" }, { status: 500 });
  }
  const lodge = mapLodge({ ...body, id: idResult.id, slug: body.slug || String(body.name).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""), display_order: body.display_order ?? 0, is_active: body.is_active !== false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  return NextResponse.json({ lodge: { ...lodge, id: idResult.id } });
}
