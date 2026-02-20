import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import { adminListFeatureCards, adminCreateFeatureCard } from "@/lib/db/queries";

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

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ feature_cards: [] });
  const list = await adminListFeatureCards();
  return NextResponse.json({ feature_cards: list.map((r) => mapCard(r as Record<string, unknown>)) });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ message: "Database not configured" }, { status: 501 });
  const body = await request.json().catch(() => ({}));
  const idResult = await adminCreateFeatureCard(body);
  if (!idResult) return NextResponse.json({ message: "Failed to create" }, { status: 500 });
  const feature_card = mapCard({ ...body, id: idResult.id, display_order: body.display_order ?? 0, is_active: body.is_active !== false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  return NextResponse.json({ feature_card: { ...feature_card, id: idResult.id } });
}
