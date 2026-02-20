import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import { adminListDestinations, adminCreateDestination } from "@/lib/db/queries";

function mapDestination(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    name: String(r.name),
    slug: String(r.slug),
    region: r.region != null ? String(r.region) : undefined,
    teaser: r.teaser != null ? String(r.teaser) : undefined,
    tag: r.tag != null ? String(r.tag) : undefined,
    description: r.description != null ? String(r.description) : undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
    map_embed_url: undefined as string | undefined,
    display_order: Number(r.display_order ?? 0),
    is_featured: false,
    published_at: undefined as string | undefined,
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ destinations: [] });
  const list = await adminListDestinations();
  return NextResponse.json({ destinations: list.map((r) => mapDestination(r as Record<string, unknown>)) });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ message: "Database not configured" }, { status: 501 });
  const body = await request.json().catch(() => ({}));
  const idResult = await adminCreateDestination(body);
  if (!idResult) return NextResponse.json({ message: "Failed to create" }, { status: 500 });
  const slug = body.slug || String(body.name).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const destination = mapDestination({ ...body, id: idResult.id, slug, display_order: body.display_order ?? 0, is_active: body.is_active !== false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  return NextResponse.json({ destination: { ...destination, id: idResult.id } });
}
