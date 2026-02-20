import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { getUserByEmail } from "@/lib/db/queries";
import { hasDb } from "@/lib/db/client";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@gotzportal.local";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 422 }
      );
    }

    const token = ADMIN_PASSWORD || "dev-token";

    // 1. Try database user (email + password)
    if (hasDb()) {
      const user = await getUserByEmail(email.toLowerCase());
      if (user && (await compare(password, user.password_hash))) {
        return NextResponse.json({
          token,
          user: { id: user.id, name: user.name || "Admin", email: user.email },
        });
      }
    }

    // 2. Legacy: single admin password
    const legacyAllowed =
      !ADMIN_PASSWORD ||
      (password === ADMIN_PASSWORD &&
        (email === ADMIN_EMAIL || !ADMIN_EMAIL || ADMIN_EMAIL === "admin@gotzportal.local"));

    if (!legacyAllowed) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      token,
      user: { id: 1, name: "Admin", email: email || ADMIN_EMAIL },
    });
  } catch {
    return NextResponse.json(
      { message: "Invalid request." },
      { status: 400 }
    );
  }
}
