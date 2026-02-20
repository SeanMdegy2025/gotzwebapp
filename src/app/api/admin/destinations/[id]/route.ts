import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import { adminGetDestination, adminUpdateDestination, adminDeleteDestination } from "@/lib/db/queries";

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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated(_req)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const row = await adminGetDestination(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ destination: mapDestination(row) });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  const body = await request.json().catch(() => ({}));
  await adminUpdateDestination(id, body);
  const row = await adminGetDestination(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ destination: mapDestination(row) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated(_req)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  await adminDeleteDestination(id);
  return NextResponse.json({ message: "Deleted" });
}
