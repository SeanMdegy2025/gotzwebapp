import { NextRequest, NextResponse } from "next/server";
import { hasDb } from "@/lib/db/client";
import { insertContactMessage } from "@/lib/db/queries";
import { createContactMessage } from "@/lib/data/store";

const MAX_NAME = 120;
const MAX_EMAIL = 160;
const MAX_PHONE = 40;
const MAX_MESSAGE = 2000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = body.phone != null ? String(body.phone).trim() : null;
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Name, email, and message are required." },
        { status: 422 }
      );
    }
    if (name.length > MAX_NAME) {
      return NextResponse.json(
        { message: `Name must not exceed ${MAX_NAME} characters.` },
        { status: 422 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 422 }
      );
    }
    if (email.length > MAX_EMAIL) {
      return NextResponse.json(
        { message: `Email must not exceed ${MAX_EMAIL} characters.` },
        { status: 422 }
      );
    }
    if (phone && phone.length > MAX_PHONE) {
      return NextResponse.json(
        { message: `Phone must not exceed ${MAX_PHONE} characters.` },
        { status: 422 }
      );
    }
    if (message.length > MAX_MESSAGE) {
      return NextResponse.json(
        { message: `Message must not exceed ${MAX_MESSAGE} characters.` },
        { status: 422 }
      );
    }

    if (hasDb()) {
      const row = await insertContactMessage({ name, email, phone: phone || null, message });
      if (row) {
        return NextResponse.json(
          { status: "received", message_id: row.id },
          { status: 202 }
        );
      }
    }

    const msg = createContactMessage({
      name,
      email,
      phone: phone || null,
      message,
    });

    return NextResponse.json(
      { status: "received", message_id: msg.id },
      { status: 202 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
