import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { getAllBookings, getAllContactMessages } from "@/lib/data/store";
import { hasDb } from "@/lib/db/client";
import {
  getTourPackages,
  adminListBookings,
  adminListContactMessages,
} from "@/lib/db/queries";

function mapBooking(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    full_name: r.full_name,
    email: r.email,
    phone: r.phone,
    whatsapp: r.whatsapp ?? null,
    travel_date: r.travel_date != null ? String(r.travel_date).slice(0, 10) : null,
    number_of_travelers: Number(r.number_of_travelers ?? 1),
    status: String(r.status),
    created_at: String(r.created_at),
    updated_at: r.updated_at != null ? String(r.updated_at) : undefined,
    tour_package: (r.tour_package as { id: number; title: string; slug: string }) ?? null,
    special_requests: r.special_requests ?? undefined,
    admin_notes: r.admin_notes ?? undefined,
    completed_at: r.completed_at != null ? String(r.completed_at) : undefined,
    customization_data: r.customization_data ?? undefined,
  };
}

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

export async function GET(request: Request) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let bookings: Array<Record<string, unknown>>;
  let messages: Array<Record<string, unknown>>;

  if (hasDb()) {
    try {
      const [dbBookings, dbMessages] = await Promise.all([
        adminListBookings(),
        adminListContactMessages(),
      ]);
      bookings = dbBookings.map(mapBooking);
      messages = dbMessages.map(mapMessage);
    } catch {
      bookings = getAllBookings().map((b) => ({
        id: b.id,
        full_name: b.full_name,
        email: b.email,
        phone: b.phone,
        whatsapp: b.whatsapp,
        travel_date: b.travel_date,
        number_of_travelers: b.number_of_travelers,
        status: b.status,
        created_at: b.created_at,
        tour_package: b.tour_package_id ? { id: b.tour_package_id, title: "—", slug: "" } : null,
        customization_data: b.customization_data,
        special_requests: b.special_requests,
        admin_notes: b.admin_notes,
        completed_at: b.completed_at,
      }));
      messages = getAllContactMessages().map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        message: m.message,
        status: m.status,
        created_at: m.created_at,
        resolved_at: m.resolved_at ?? null,
      }));
    }
  } else {
    bookings = getAllBookings().map((b) => ({
      id: b.id,
      full_name: b.full_name,
      email: b.email,
      phone: b.phone,
      whatsapp: b.whatsapp,
      travel_date: b.travel_date,
      number_of_travelers: b.number_of_travelers,
      status: b.status,
      created_at: b.created_at,
      tour_package: b.tour_package_id ? { id: b.tour_package_id, title: "—", slug: "" } : null,
      customization_data: b.customization_data,
      special_requests: b.special_requests,
      admin_notes: b.admin_notes,
      completed_at: b.completed_at,
    }));
    messages = getAllContactMessages().map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      message: m.message,
      status: m.status,
      created_at: m.created_at,
      resolved_at: m.resolved_at ?? null,
    }));
  }

  const pending_bookings = bookings.filter((b) => b.status === "pending").length;
  const new_messages = messages.filter((m) => m.status === "new").length;

  let tour_packages_count = 0;
  if (hasDb()) {
    try {
      const pkgs = await getTourPackages(1000);
      tour_packages_count = pkgs.length;
    } catch {}
  }

  const recent_bookings = [...bookings]
    .sort((a, b) => new Date(String(b.created_at)).getTime() - new Date(String(a.created_at)).getTime())
    .slice(0, 5);
  const recent_messages = [...messages]
    .sort((a, b) => new Date(String(b.created_at)).getTime() - new Date(String(a.created_at)).getTime())
    .slice(0, 5);

  return NextResponse.json({
    pending_bookings,
    new_messages,
    total_bookings: bookings.length,
    total_messages: messages.length,
    tour_packages_count,
    recent_bookings,
    recent_messages,
  });
}
