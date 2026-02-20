import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { getAllContactMessages } from "@/lib/data/store";
import { hasDb } from "@/lib/db/client";
import { adminListContactMessages } from "@/lib/db/queries";

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

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status") ?? undefined;

  if (hasDb()) {
    try {
      const list = await adminListContactMessages(status);
      const messages = list.map(mapMessage);
      const all = await adminListContactMessages();
      const stats = {
        total: all.length,
        new: all.filter((m) => m.status === "new").length,
        closed: all.filter((m) => m.status === "closed").length,
      };
      return NextResponse.json({ messages, stats });
    } catch {
      // fallback
    }
  }

  let messages = getAllContactMessages();
  if (status && status !== "all") {
    messages = messages.filter((m) => m.status === status);
  }
  const all = getAllContactMessages();
  const stats = {
    total: all.length,
    new: all.filter((m) => m.status === "new").length,
    closed: all.filter((m) => m.status === "closed").length,
  };
  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      message: m.message,
      status: m.status,
      created_at: m.created_at,
      resolved_at: m.resolved_at ?? null,
    })),
    stats,
  });
}
