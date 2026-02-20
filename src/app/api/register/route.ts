import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { createUser, getUserByEmail } from "@/lib/db/queries";
import { hasDb } from "@/lib/db/client";

export async function POST(request: NextRequest) {
  try {
    if (!hasDb()) {
      return NextResponse.json(
        { message: "Registration is not available." },
        { status: 503 }
      );
    }
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name.trim() : null;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 422 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 422 }
      );
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const password_hash = await hash(password, 10);
    const result = await createUser({ email, password_hash, name });
    if (!result) {
      return NextResponse.json(
        { message: "Could not create account." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Account created.",
      user: { id: result.id, email, name: name || email },
    });
  } catch {
    return NextResponse.json(
      { message: "Invalid request." },
      { status: 400 }
    );
  }
}
