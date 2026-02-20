import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import { adminGetTourPackage, adminUpdateTourPackage, adminDeleteTourPackage } from "@/lib/db/queries";

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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated(_req)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const row = await adminGetTourPackage(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ tour_package: mapPackage(row) });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  const body = await request.json().catch(() => ({}));
  await adminUpdateTourPackage(id, body);
  const row = await adminGetTourPackage(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ tour_package: mapPackage(row) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated(_req)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  await adminDeleteTourPackage(id);
  return NextResponse.json({ message: "Deleted" });
}
