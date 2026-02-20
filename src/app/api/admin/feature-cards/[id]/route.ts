import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import { adminGetFeatureCard, adminUpdateFeatureCard, adminDeleteFeatureCard } from "@/lib/db/queries";

function mapCard(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    icon: r.icon != null ? String(r.icon) : "",
    title: String(r.title),
    headline: r.headline != null ? String(r.headline) : undefined,
    copy: r.copy != null ? String(r.copy) : "",
    count_value: r.count_value != null ? Number(r.count_value) : undefined,
    display_order: Number(r.display_order ?? 0),
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
  const row = await adminGetFeatureCard(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ feature_card: mapCard(row) });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  const body = await request.json().catch(() => ({}));
  await adminUpdateFeatureCard(id, body);
  const row = await adminGetFeatureCard(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ feature_card: mapCard(row) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated(_req)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  await adminDeleteFeatureCard(id);
  return NextResponse.json({ message: "Deleted" });
}
