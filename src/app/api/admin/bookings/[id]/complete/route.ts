import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { getBookingById, updateBooking } from "@/lib/data/store";
import { hasDb } from "@/lib/db/client";
import { adminSetBookingCompleted, adminGetBooking } from "@/lib/db/queries";

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
      await adminSetBookingCompleted(id);
      const row = await adminGetBooking(id);
      if (!row) return NextResponse.json({ message: "Booking not found" }, { status: 404 });
      return NextResponse.json({ booking: mapBooking(row) });
    } catch {
      // fallback
    }
  }

  const updated = updateBooking(id, { status: "completed" });
  if (!updated) {
    return NextResponse.json({ message: "Booking not found" }, { status: 404 });
  }
  return NextResponse.json({
    booking: {
      ...updated,
      tour_package: updated.tour_package_id ? { id: updated.tour_package_id, title: "—", slug: "" } : null,
    },
  });
}
