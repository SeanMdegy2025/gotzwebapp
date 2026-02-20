/**
 * Server-side auth check for admin API routes.
 * Expects Authorization: Bearer <token>; token must match ADMIN_PASSWORD or "dev-token" when unset.
 */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const VALID_TOKEN = ADMIN_PASSWORD || "dev-token";

export function getAdminToken(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7).trim() || null;
}

export function isAdminAuthenticated(request: Request): boolean {
  const token = getAdminToken(request);
  return token === VALID_TOKEN;
}
