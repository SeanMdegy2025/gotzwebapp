import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import {
  adminListContactChannels,
  adminCreateContactChannel,
} from "@/lib/db/queries";

function mapChannel(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    label: String(r.label),
    value: String(r.value),
    detail: r.detail != null ? String(r.detail) : undefined,
    display_order: Number(r.display_order ?? 0),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ contact_channels: [] });
  }
  const list = await adminListContactChannels();
  const contact_channels = list.map((r) => mapChannel(r as Record<string, unknown>));
  return NextResponse.json({ contact_channels });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ message: "Database not configured" }, { status: 501 });
  }
  const body = await request.json().catch(() => ({}));
  const idResult = await adminCreateContactChannel(body);
  if (!idResult) {
    return NextResponse.json({ message: "Failed to create" }, { status: 500 });
  }
  const contact_channel = mapChannel({ ...body, id: idResult.id, display_order: body.display_order ?? 0, is_active: body.is_active !== false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  return NextResponse.json({ contact_channel: { ...contact_channel, id: idResult.id } });
}
