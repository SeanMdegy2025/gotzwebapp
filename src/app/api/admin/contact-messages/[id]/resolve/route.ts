import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { getContactMessageById, updateContactMessageStatus } from "@/lib/data/store";
import { hasDb } from "@/lib/db/client";
import { adminGetContactMessage, adminUpdateContactMessageStatus } from "@/lib/db/queries";

function mapMessage(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    name: r.name,
    email: r.email,
    phone: r.phone ?? null,
    message: r.message,
    status: r.status,
    created_at: String(r.created_at),
    resolved_at: r.status === "closed" && r.updated_at ? String(r.updated_at) : null,
    updated_at: r.updated_at != null ? String(r.updated_at) : undefined,
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const id = Number((await params).id);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  if (hasDb()) {
    try {
      await adminUpdateContactMessageStatus(id, "closed");
      const row = await adminGetContactMessage(id);
      if (!row) return NextResponse.json({ message: "Message not found" }, { status: 404 });
      return NextResponse.json({ message: mapMessage(row) });
    } catch {
      // fallback
    }
  }

  const updated = updateContactMessageStatus(id, "closed");
  if (!updated) {
    return NextResponse.json({ message: "Message not found" }, { status: 404 });
  }
  return NextResponse.json({ message: updated });
}
