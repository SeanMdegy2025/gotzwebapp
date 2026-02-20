/**
 * Postgres client for gotzportal.
 * The database runs externally (Neon, Vercel Postgres, or any Postgres); only the
 * connection config and query code live in this Next.js repo.
 */

import { neon } from "@neondatabase/serverless";

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

export type SqlClient = ReturnType<typeof neon>;

let _sql: SqlClient | null = null;

/** Returns a query client when POSTGRES_URL or DATABASE_URL is set; otherwise null (use fallbacks). */
export function getDb(): SqlClient | null {
  if (!connectionString) return null;
  if (!_sql) _sql = neon(connectionString);
  return _sql;
}

/** True if a database is configured. */
export function hasDb(): boolean {
  return Boolean(connectionString);
}
