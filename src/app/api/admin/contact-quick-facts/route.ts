import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import { adminListContactQuickFacts, adminCreateContactQuickFact } from "@/lib/db/queries";

function mapFact(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    fact: String(r.fact),
    display_order: Number(r.display_order ?? 0),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ contact_quick_facts: [] });
  const list = await adminListContactQuickFacts();
  return NextResponse.json({ contact_quick_facts: list.map((r) => mapFact(r as Record<string, unknown>)) });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ message: "Database not configured" }, { status: 501 });
  const body = await request.json().catch(() => ({}));
  const idResult = await adminCreateContactQuickFact(body);
  if (!idResult) return NextResponse.json({ message: "Failed to create" }, { status: 500 });
  const contact_quick_fact = mapFact({ ...body, id: idResult.id, display_order: body.display_order ?? 0, is_active: body.is_active !== false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  return NextResponse.json({ contact_quick_fact: { ...contact_quick_fact, id: idResult.id } });
}
