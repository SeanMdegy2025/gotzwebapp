import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { isAdminAuthenticated } from "@/lib/auth-server";
import { hasDb } from "@/lib/db/client";
import { adminListUsers, createUser, getUserByEmail } from "@/lib/db/queries";

function mapUser(r: { id: number; email: string; name: string | null; role: string; created_at: Date }) {
  return {
    id: r.id,
    email: r.email,
    name: r.name,
    role: r.role,
    created_at: String(r.created_at),
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ users: [] });
  const list = await adminListUsers();
  return NextResponse.json({ users: list.map(mapUser) });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ message: "Database not configured" }, { status: 501 });
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim() || null : null;
  const role = typeof body.role === "string" ? body.role : "admin";

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 422 });
  }
  if (password.length < 8) {
    return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 422 });
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ message: "A user with this email already exists." }, { status: 409 });
  }

  const password_hash = await hash(password, 10);
  const result = await createUser({ email, password_hash, name, role });
  if (!result) return NextResponse.json({ message: "Failed to create user." }, { status: 500 });

  return NextResponse.json({
    user: mapUser({
      id: result.id,
      email,
      name,
      role,
      created_at: new Date(),
    }),
  });
}
