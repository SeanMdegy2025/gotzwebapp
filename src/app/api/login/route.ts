import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { getUserByEmail } from "@/lib/db/queries";
import { hasDb } from "@/lib/db/client";

// Use Node runtime on Vercel so Neon + bcrypt work reliably (not Edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@gotzportal.local";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body. Send JSON with email and password." },
      { status: 400 }
    );
  }
  const email = typeof (body as Record<string, unknown>)?.email === "string" ? (body as Record<string, string>).email.trim() : "";
  const password = typeof (body as Record<string, unknown>)?.password === "string" ? (body as Record<string, string>).password : "";

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 422 }
    );
  }

  const token = ADMIN_PASSWORD || "dev-token";

  try {
    // 1. Try database user (email + password)
    if (hasDb()) {
      const user = await getUserByEmail(email.toLowerCase());
      if (user?.password_hash) {
        const match = await compare(password, user.password_hash);
        if (match) {
          return NextResponse.json({
            token,
            user: { id: user.id, name: user.name || "Admin", email: user.email },
          });
        }
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
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json(
      { message: "Something went wrong. Try again or check server logs." },
      { status: 500 }
    );
  }
}
