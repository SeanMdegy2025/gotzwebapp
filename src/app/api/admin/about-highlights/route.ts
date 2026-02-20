import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import { adminListAboutHighlights, adminCreateAboutHighlight } from "@/lib/db/queries";

function mapHighlight(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    title: String(r.title),
    copy: String(r.copy),
    display_order: Number(r.display_order ?? 0),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ about_highlights: [] });
  const list = await adminListAboutHighlights();
  return NextResponse.json({ about_highlights: list.map((r) => mapHighlight(r as Record<string, unknown>)) });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ message: "Database not configured" }, { status: 501 });
  const body = await request.json().catch(() => ({}));
  const idResult = await adminCreateAboutHighlight(body);
  if (!idResult) return NextResponse.json({ message: "Failed to create" }, { status: 500 });
  const about_highlight = mapHighlight({ ...body, id: idResult.id, display_order: body.display_order ?? 0, is_active: body.is_active !== false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  return NextResponse.json({ about_highlight: { ...about_highlight, id: idResult.id } });
}
