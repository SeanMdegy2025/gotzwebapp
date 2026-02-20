import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import { adminListAboutStats, adminCreateAboutStat } from "@/lib/db/queries";

function mapStat(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    value: String(r.value),
    label: String(r.label),
    display_order: Number(r.display_order ?? 0),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ about_stats: [] });
  const list = await adminListAboutStats();
  return NextResponse.json({ about_stats: list.map((r) => mapStat(r as Record<string, unknown>)) });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ message: "Database not configured" }, { status: 501 });
  const body = await request.json().catch(() => ({}));
  const idResult = await adminCreateAboutStat(body);
  if (!idResult) return NextResponse.json({ message: "Failed to create" }, { status: 500 });
  const about_stat = mapStat({ ...body, id: idResult.id, display_order: body.display_order ?? 0, is_active: body.is_active !== false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  return NextResponse.json({ about_stat: { ...about_stat, id: idResult.id } });
}
