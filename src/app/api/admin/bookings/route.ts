import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { getAllBookings } from "@/lib/data/store";
import { hasDb } from "@/lib/db/client";
import { adminListBookings } from "@/lib/db/queries";

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
    tour_package: r.tour_package ?? (r.tour_package_id ? { id: r.tour_package_id, title: "—", slug: "" } : null),
    customization_data: r.customization_data,
    special_requests: r.special_requests,
    admin_notes: r.admin_notes,
    completed_at: r.completed_at != null ? String(r.completed_at) : undefined,
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status") ?? undefined;

  if (hasDb()) {
    try {
      const list = await adminListBookings(status);
      const bookings = list.map((r) => mapBooking(r));
      return NextResponse.json({ bookings });
    } catch {
      // fallback to store
    }
  }

  let bookings = getAllBookings();
  if (status && status !== "all") {
    bookings = bookings.filter((b) => b.status === status);
  }
  return NextResponse.json({
    bookings: bookings.map((b) => ({
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
    })),
  });
}
