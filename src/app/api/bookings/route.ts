import { NextRequest, NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { getTourPackageIdBySlug as getTourPackageIdBySlugDb, insertBooking } from "@/lib/db/queries";
import { createBooking, getTourPackageIdBySlug } from "@/lib/data/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tour_package_id = body.tour_package_id != null ? Number(body.tour_package_id) : undefined;
    const package_slug = typeof body.package_slug === "string" ? body.package_slug.trim() : undefined;
    const full_name = typeof body.full_name === "string" ? body.full_name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const whatsapp = body.whatsapp != null ? String(body.whatsapp).trim() : null;
    const travel_date = body.travel_date != null ? String(body.travel_date).trim() : null;
    const number_of_travelers = body.number_of_travelers != null ? Number(body.number_of_travelers) : undefined;
    const customization_data = body.customization_data != null && typeof body.customization_data === "object" ? body.customization_data : null;
    const special_requests = body.special_requests != null ? String(body.special_requests).trim() : null;

    if (!full_name || !email || !phone) {
      return NextResponse.json(
        { message: "Full name, email, and phone are required." },
        { status: 422 }
      );
    }
    if (number_of_travelers == null || number_of_travelers < 1 || number_of_travelers > 100) {
      return NextResponse.json(
        { message: "Number of travelers must be between 1 and 100." },
        { status: 422 }
      );
    }

    let resolvedTourPackageId: number | null = tour_package_id ?? null;
    if (resolvedTourPackageId == null && package_slug) {
      if (hasDb()) {
        resolvedTourPackageId = await getTourPackageIdBySlugDb(package_slug);
      } else {
        resolvedTourPackageId = getTourPackageIdBySlug(package_slug);
      }
    }
    // Allow booking without a package (inquiry)
    if (resolvedTourPackageId == null && (tour_package_id != null || package_slug)) {
      return NextResponse.json(
        { message: "The selected tour package could not be found." },
        { status: 422 }
      );
    }

    const payload = {
      tour_package_id: resolvedTourPackageId,
      full_name,
      email,
      phone,
      whatsapp,
      travel_date: travel_date || null,
      number_of_travelers,
      customization_data,
      special_requests,
    };

    if (hasDb()) {
      const row = await insertBooking(payload);
      if (row) {
        return NextResponse.json(
          { status: "created", message: "Booking received.", booking_id: row.id },
          { status: 201 }
        );
      }
    }

    const booking = createBooking(payload);

    return NextResponse.json(
      { status: "created", message: "Booking received.", booking_id: booking.id },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
