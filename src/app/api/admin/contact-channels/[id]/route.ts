import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import {
  adminGetContactChannel,
  adminUpdateContactChannel,
  adminDeleteContactChannel,
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(_request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const row = await adminGetContactChannel(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ contact_channel: mapChannel(row) });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) {
    return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  }
  const body = await request.json().catch(() => ({}));
  await adminUpdateContactChannel(id, body);
  const row = await adminGetContactChannel(id);
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ contact_channel: mapChannel(row) });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(_request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  if (!hasDb()) {
    return NextResponse.json({ message: "Not implemented" }, { status: 501 });
  }
  await adminDeleteContactChannel(id);
  return NextResponse.json({ message: "Deleted" });
}
