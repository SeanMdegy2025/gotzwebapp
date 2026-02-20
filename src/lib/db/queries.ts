/**
 * Database queries for gotzportal. Used by API routes when DB is configured.
 */

import { getDb } from "./client";

// ---- Users ----
export type UserRow = { id: number; email: string; password_hash: string; name: string | null; role: string; created_at: Date; updated_at: Date };

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    SELECT id, email, password_hash, name, role, created_at, updated_at
    FROM users WHERE email = ${email} AND deleted_at IS NULL
  `;
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as UserRow[])?.[0];
  return row ? (row as UserRow) : null;
}

export async function createUser(data: { email: string; password_hash: string; name?: string | null; role?: string }): Promise<{ id: number } | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    INSERT INTO users (email, password_hash, name, role)
    VALUES (${data.email}, ${data.password_hash}, ${data.name ?? null}, ${data.role ?? "admin"})
    RETURNING id
  `;
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as { id: number }[])?.[0];
  return row ? { id: Number((row as { id: number }).id) } : null;
}

export type AdminUserRow = { id: number; email: string; name: string | null; role: string; created_at: Date };

export async function adminListUsers(): Promise<AdminUserRow[]> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`
    SELECT id, email, name, role, created_at
    FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC
  `;
  return (Array.isArray(rows) ? rows : []) as AdminUserRow[];
}

// ---- Contact ----
export async function insertContactMessage(data: {
  name: string;
  email: string;
  phone: string | null;
  message: string;
}): Promise<{ id: number } | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    INSERT INTO contact_messages (name, email, phone, message)
    VALUES (${data.name}, ${data.email}, ${data.phone}, ${data.message})
    RETURNING id
  `;
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as { id: number }[])?.[0];
  return row ? { id: Number((row as { id: number }).id) } : null;
}

// ---- Bookings ----
export async function getTourPackageIdBySlug(slug: string): Promise<number | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    SELECT id FROM tour_packages WHERE slug = ${slug} AND deleted_at IS NULL
  `;
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as { id: number }[])?.[0];
  return row ? Number((row as { id: number }).id) : null;
}

export async function insertBooking(data: {
  tour_package_id: number | null;
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  travel_date: string | null;
  number_of_travelers: number;
  customization_data: object | null;
  special_requests: string | null;
}): Promise<{ id: number } | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    INSERT INTO bookings (
      tour_package_id, full_name, email, phone, whatsapp,
      travel_date, number_of_travelers, customization_data, special_requests
    )
    VALUES (
      ${data.tour_package_id},
      ${data.full_name},
      ${data.email},
      ${data.phone},
      ${data.whatsapp},
      ${data.travel_date ? data.travel_date : null},
      ${data.number_of_travelers},
      ${data.customization_data ? JSON.stringify(data.customization_data) : null},
      ${data.special_requests}
    )
    RETURNING id
  `;
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as { id: number }[])?.[0];
  return row ? { id: Number((row as { id: number }).id) } : null;
}

// ---- Admin: bookings ----
export async function adminListBookings(status?: string): Promise<Array<Record<string, unknown>>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = status && status !== "all"
    ? await sql`SELECT b.*, tp.title AS tp_title, tp.slug AS tp_slug FROM bookings b LEFT JOIN tour_packages tp ON b.tour_package_id = tp.id AND tp.deleted_at IS NULL WHERE b.status = ${status} ORDER BY b.created_at DESC`
    : await sql`SELECT b.*, tp.title AS tp_title, tp.slug AS tp_slug FROM bookings b LEFT JOIN tour_packages tp ON b.tour_package_id = tp.id AND tp.deleted_at IS NULL ORDER BY b.created_at DESC`;
  return (rows as Array<Record<string, unknown>>).map((r) => {
    const { tp_title, tp_slug, ...rest } = r;
    return {
      ...rest,
      tour_package: r.tour_package_id
        ? { id: r.tour_package_id, title: tp_title ?? "—", slug: tp_slug ?? "" }
        : null,
    };
  });
}

export async function adminGetBooking(id: number): Promise<Record<string, unknown> | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`SELECT b.*, tp.title AS tp_title, tp.slug AS tp_slug FROM bookings b LEFT JOIN tour_packages tp ON b.tour_package_id = tp.id AND tp.deleted_at IS NULL WHERE b.id = ${id}`;
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as Record<string, unknown>[])?.[0];
  if (!row) return null;
  const r = row as Record<string, unknown>;
  const { tp_title, tp_slug, ...rest } = r;
  return {
    ...rest,
    tour_package: r.tour_package_id
      ? { id: r.tour_package_id, title: tp_title ?? "—", slug: tp_slug ?? "" }
      : null,
  };
}

export async function adminUpdateBooking(id: number, data: { admin_notes?: string; status?: string }): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  const updates: string[] = [];
  const vals: unknown[] = [];
  let i = 0;
  if (data.admin_notes !== undefined) {
    i++;
    updates.push(`admin_notes = $${i}`);
    vals.push(data.admin_notes);
  }
  if (data.status !== undefined) {
    i++;
    updates.push(`status = $${i}`);
    vals.push(data.status);
  }
  if (data.status === "completed") {
    updates.push("completed_at = NOW()");
  }
  if (updates.length === 0) return true;
  vals.push(id);
  await (sql as (q: string, p?: unknown[]) => Promise<unknown>)(
    `UPDATE bookings SET ${updates.join(", ")}, updated_at = NOW() WHERE id = $${i + 1}`,
    vals
  );
  return true;
}

export async function adminSetBookingCompleted(id: number): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  await sql`UPDATE bookings SET status = 'completed', completed_at = NOW(), updated_at = NOW() WHERE id = ${id}`;
  return true;
}

// ---- Admin: contact_messages ----
export async function adminListContactMessages(status?: string): Promise<Array<Record<string, unknown>>> {
  const sql = getDb();
  if (!sql) return [];
  const rows =
    status && status !== "all"
      ? await sql`SELECT * FROM contact_messages WHERE deleted_at IS NULL AND status = ${status} ORDER BY created_at DESC`
      : await sql`SELECT * FROM contact_messages WHERE deleted_at IS NULL ORDER BY created_at DESC`;
  return rows as Array<Record<string, unknown>>;
}

export async function adminGetContactMessage(id: number): Promise<Record<string, unknown> | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM contact_messages WHERE id = ${id} AND deleted_at IS NULL`;
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as Record<string, unknown>[])?.[0];
  return row != null ? (row as Record<string, unknown>) : null;
}

export async function adminUpdateContactMessageStatus(id: number, status: string): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  await sql`UPDATE contact_messages SET status = ${status}, updated_at = NOW() WHERE id = ${id} AND deleted_at IS NULL`;
  return true;
}

// ---- Read-only content (return arrays for API response) ----

export async function getHeroSlides(): Promise<Array<{ id: number; title: string; label?: string; description?: string; image_base64?: string; cta_label?: string; cta_url?: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`
    SELECT id, title, label, description, image_base64, cta_label, cta_url
    FROM hero_slides
    WHERE is_active = true AND deleted_at IS NULL
    ORDER BY position ASC
  `;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    title: String(r.title),
    label: r.label != null ? String(r.label) : undefined,
    description: r.description != null ? String(r.description) : undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
    ctaLabel: r.cta_label != null ? String(r.cta_label) : undefined,
    ctaHref: r.cta_url != null ? String(r.cta_url) : undefined,
  }));
}

export async function getFeatureCards(): Promise<Array<{ icon?: string; title: string; headline?: string; copy?: string; count_value?: number }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`
    SELECT icon, title, headline, copy, count_value
    FROM feature_cards WHERE is_active = true AND deleted_at IS NULL
    ORDER BY display_order ASC
  `;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    icon: r.icon != null ? String(r.icon) : undefined,
    title: String(r.title),
    headline: r.headline != null ? String(r.headline) : undefined,
    copy: r.copy != null ? String(r.copy) : undefined,
    count_value: r.count_value != null ? Number(r.count_value) : undefined,
  }));
}

export async function getAboutStats(): Promise<Array<{ value: string; label: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`
    SELECT value, label FROM about_stats WHERE is_active = true AND deleted_at IS NULL
    ORDER BY display_order ASC
  `;
  return (rows as Array<Record<string, unknown>>).map((r) => ({ value: String(r.value), label: String(r.label) }));
}

export async function getAboutHighlights(): Promise<Array<{ title: string; copy: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`
    SELECT title, copy FROM about_highlights WHERE is_active = true AND deleted_at IS NULL
    ORDER BY display_order ASC
  `;
  return (rows as Array<Record<string, unknown>>).map((r) => ({ title: String(r.title), copy: String(r.copy) }));
}

export async function getContactChannels(): Promise<Array<{ label: string; value: string; detail?: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`
    SELECT label, value, detail FROM contact_channels WHERE is_active = true AND deleted_at IS NULL
    ORDER BY display_order ASC
  `;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    label: String(r.label),
    value: String(r.value),
    detail: r.detail != null ? String(r.detail) : undefined,
  }));
}

export async function getContactQuickFacts(): Promise<string[]> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`
    SELECT fact FROM contact_quick_facts WHERE is_active = true AND deleted_at IS NULL
    ORDER BY display_order ASC
  `;
  return (rows as Array<Record<string, unknown>>).map((r) => String(r.fact));
}

export async function getItineraries(): Promise<Array<{ id: number; slug: string; title: string; summary?: string; badge?: string; image_base64?: string; duration_days?: number; price_from?: number | null }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`
    SELECT id, slug, title, summary, badge, image_base64, duration_days, price_from
    FROM itineraries WHERE is_active = true AND deleted_at IS NULL
    ORDER BY display_order ASC
  `;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    slug: String(r.slug),
    title: String(r.title),
    summary: r.summary != null ? String(r.summary) : undefined,
    badge: r.badge != null ? String(r.badge) : undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
    duration_days: r.duration_days != null ? Number(r.duration_days) : undefined,
    price_from: r.price_from != null ? Number(r.price_from) : null,
  }));
}

export async function getDestinations(): Promise<Array<{ id: number; name: string; slug: string; region?: string; teaser?: string; tag?: string; description?: string; image_base64?: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`
    SELECT id, name, slug, region, teaser, tag, description, image_base64
    FROM destinations WHERE is_active = true AND deleted_at IS NULL
    ORDER BY display_order ASC
  `;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    slug: String(r.slug),
    region: r.region != null ? String(r.region) : undefined,
    teaser: r.teaser != null ? String(r.teaser) : undefined,
    tag: r.tag != null ? String(r.tag) : undefined,
    description: r.description != null ? String(r.description) : undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
  }));
}

export async function getLodges(): Promise<Array<{ id: number; name: string; slug: string; location?: string; type?: string; mood?: string; short_description?: string; image_base64?: string; price_from?: number | null }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`
    SELECT id, name, slug, location, type, mood, short_description, image_base64, price_from
    FROM lodges WHERE is_active = true AND deleted_at IS NULL
    ORDER BY display_order ASC
  `;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    slug: String(r.slug),
    location: r.location != null ? String(r.location) : undefined,
    type: r.type != null ? String(r.type) : undefined,
    mood: r.mood != null ? String(r.mood) : undefined,
    short_description: r.short_description != null ? String(r.short_description) : undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
    price_from: r.price_from != null ? Number(r.price_from) : null,
  }));
}

export async function getTourPackages(limit: number): Promise<Array<{
  id: number; slug: string; title: string; short_description: string | null; description?: string;
  price_from: number | string | null; duration_days: number | null; max_participants: number | null;
  is_featured: boolean; hero_image: null; gallery: []; images: string[];
}>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`
    SELECT id, slug, title, short_description, description, price_from, duration_days, max_participants, is_featured
    FROM tour_packages
    WHERE deleted_at IS NULL AND published_at IS NOT NULL
    ORDER BY is_featured DESC, display_order ASC
    LIMIT ${limit}
  `;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    slug: String(r.slug),
    title: String(r.title),
    short_description: r.short_description != null ? String(r.short_description) : null,
    description: r.description != null ? String(r.description) : undefined,
    price_from: r.price_from != null ? Number(r.price_from) : null,
    duration_days: r.duration_days != null ? Number(r.duration_days) : null,
    max_participants: r.max_participants != null ? Number(r.max_participants) : null,
    is_featured: Boolean(r.is_featured),
    hero_image: null,
    gallery: [],
    images: [],
  }));
}

export async function getTourPackageBySlug(slug: string): Promise<{
  id: number; slug: string; title: string; short_description: string | null; description?: string;
  price_from: number | string | null; duration_days: number | null; max_participants: number | null;
  is_featured: boolean; hero_image: null; gallery: []; images: string[];
} | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    SELECT id, slug, title, short_description, description, price_from, duration_days, max_participants, is_featured
    FROM tour_packages WHERE slug = ${slug} AND deleted_at IS NULL
  `;
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as Record<string, unknown>[])?.[0];
  if (!row) return null;
  const r = row as Record<string, unknown>;
  return {
    id: Number(r.id),
    slug: String(r.slug),
    title: String(r.title),
    short_description: r.short_description != null ? String(r.short_description) : null,
    description: r.description != null ? String(r.description) : undefined,
    price_from: r.price_from != null ? Number(r.price_from) : null,
    duration_days: r.duration_days != null ? Number(r.duration_days) : null,
    max_participants: r.max_participants != null ? Number(r.max_participants) : null,
    is_featured: Boolean(r.is_featured),
    hero_image: null,
    gallery: [],
    images: [],
  };
}

export async function getItineraryBySlug(slug: string): Promise<{ id: number; slug: string; title: string; summary?: string; badge?: string; image_base64?: string; duration_days?: number; price_from?: number | null } | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    SELECT id, slug, title, summary, badge, image_base64, duration_days, price_from
    FROM itineraries WHERE slug = ${slug} AND deleted_at IS NULL
  `;
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as Record<string, unknown>[])?.[0];
  if (!row) return null;
  const r = row as Record<string, unknown>;
  return {
    id: Number(r.id),
    slug: String(r.slug),
    title: String(r.title),
    summary: r.summary != null ? String(r.summary) : undefined,
    badge: r.badge != null ? String(r.badge) : undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
    duration_days: r.duration_days != null ? Number(r.duration_days) : undefined,
    price_from: r.price_from != null ? Number(r.price_from) : null,
  };
}

export async function getLodgeBySlug(slug: string): Promise<{ id: number; name: string; slug: string; location?: string; mood?: string; short_description?: string; image_base64?: string; price_from?: number | null } | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    SELECT id, name, slug, location, mood, short_description, image_base64, price_from
    FROM lodges WHERE slug = ${slug} AND deleted_at IS NULL
  `;
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as Record<string, unknown>[])?.[0];
  if (!row) return null;
  const r = row as Record<string, unknown>;
  return {
    id: Number(r.id),
    name: String(r.name),
    slug: String(r.slug),
    location: r.location != null ? String(r.location) : undefined,
    mood: r.mood != null ? String(r.mood) : undefined,
    short_description: r.short_description != null ? String(r.short_description) : undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
    price_from: r.price_from != null ? Number(r.price_from) : null,
  };
}

// ---- Admin: list all (including inactive), get by id, create, update, soft delete ----

function one<T>(rows: unknown): T | null {
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as T[])?.[0];
  return row ? (row as T) : null;
}

// Hero slides
export async function adminListHeroSlides(): Promise<Array<{ id: number; title: string; label?: string; subtitle?: string; description?: string; image_base64?: string; cta_label?: string; cta_url?: string; position: number; is_active: boolean; created_at: string; updated_at: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`SELECT id, title, label, subtitle, description, image_base64, cta_label, cta_url, position, is_active, created_at, updated_at FROM hero_slides WHERE deleted_at IS NULL ORDER BY position ASC`;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    title: String(r.title),
    label: r.label != null ? String(r.label) : undefined,
    subtitle: r.subtitle != null ? String(r.subtitle) : undefined,
    description: r.description != null ? String(r.description) : undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
    cta_label: r.cta_label != null ? String(r.cta_label) : undefined,
    cta_url: r.cta_url != null ? String(r.cta_url) : undefined,
    position: Number(r.position ?? 0),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function adminGetHeroSlide(id: number): Promise<Record<string, unknown> | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM hero_slides WHERE id = ${id} AND deleted_at IS NULL`;
  const row = one<Record<string, unknown>>(rows);
  return row ? { ...row, id: Number(row.id), position: Number(row.position ?? 0), is_active: Boolean(row.is_active), created_at: String(row.created_at), updated_at: String(row.updated_at) } : null;
}

export async function adminCreateHeroSlide(data: Record<string, unknown>): Promise<{ id: number } | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    INSERT INTO hero_slides (title, label, subtitle, description, image_base64, cta_label, cta_url, position, is_active)
    VALUES (${String(data.title)}, ${data.label != null ? String(data.label) : null}, ${data.subtitle != null ? String(data.subtitle) : null}, ${data.description != null ? String(data.description) : null}, ${data.image_base64 != null ? String(data.image_base64) : null}, ${data.cta_label != null ? String(data.cta_label) : null}, ${data.cta_url != null ? String(data.cta_url) : null}, ${Number(data.position ?? 0)}, ${Boolean(data.is_active !== false)})
    RETURNING id
  `;
  const row = one<{ id: number }>(rows);
  return row ? { id: Number(row.id) } : null;
}

export async function adminUpdateHeroSlide(id: number, data: Record<string, unknown>): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  const sets: string[] = [];
  const vals: unknown[] = [];
  let i = 0;
  for (const k of ["title", "label", "subtitle", "description", "image_base64", "cta_label", "cta_url", "position", "is_active"]) {
    if (data[k] !== undefined) {
      i++;
      sets.push(`${k} = $${i}`);
      if (k === "position") vals.push(Number(data[k]));
      else if (k === "is_active") vals.push(Boolean(data[k]));
      else vals.push(data[k] != null ? String(data[k]) : null);
    }
  }
  if (sets.length === 0) return true;
  vals.push(id);
  await (sql as (q: string, p?: unknown[]) => Promise<unknown>)(
    `UPDATE hero_slides SET ${sets.join(", ")}, updated_at = NOW() WHERE id = $${i + 1} AND deleted_at IS NULL`,
    vals
  );
  return true;
}

export async function adminDeleteHeroSlide(id: number): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  await sql`UPDATE hero_slides SET deleted_at = NOW() WHERE id = ${id}`;
  return true;
}

// Feature cards
export async function adminListFeatureCards(): Promise<Array<{ id: number; icon?: string; title: string; headline?: string; copy?: string; count_value?: number; display_order: number; is_active: boolean; created_at: string; updated_at: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`SELECT id, icon, title, headline, copy, count_value, display_order, is_active, created_at, updated_at FROM feature_cards WHERE deleted_at IS NULL ORDER BY display_order ASC`;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    icon: r.icon != null ? String(r.icon) : undefined,
    title: String(r.title),
    headline: r.headline != null ? String(r.headline) : undefined,
    copy: r.copy != null ? String(r.copy) : undefined,
    count_value: r.count_value != null ? Number(r.count_value) : undefined,
    display_order: Number(r.display_order ?? 0),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function adminGetFeatureCard(id: number): Promise<Record<string, unknown> | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM feature_cards WHERE id = ${id} AND deleted_at IS NULL`;
  return one<Record<string, unknown>>(rows);
}

export async function adminCreateFeatureCard(data: Record<string, unknown>): Promise<{ id: number } | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    INSERT INTO feature_cards (icon, title, headline, copy, count_value, display_order, is_active)
    VALUES (${data.icon != null ? String(data.icon) : null}, ${String(data.title)}, ${data.headline != null ? String(data.headline) : null}, ${data.copy != null ? String(data.copy) : null}, ${data.count_value != null ? Number(data.count_value) : null}, ${Number(data.display_order ?? 0)}, ${Boolean(data.is_active !== false)})
    RETURNING id
  `;
  const row = one<{ id: number }>(rows);
  return row ? { id: Number(row.id) } : null;
}

export async function adminUpdateFeatureCard(id: number, data: Record<string, unknown>): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  const allowed = ["icon", "title", "headline", "copy", "count_value", "display_order", "is_active"];
  const updates: string[] = [];
  const vals: unknown[] = [];
  let i = 0;
  for (const k of allowed) {
    if (data[k] === undefined) continue;
    i++;
    updates.push(`${k} = $${i}`);
    if (k === "count_value" || k === "display_order") vals.push(Number(data[k]));
    else if (k === "is_active") vals.push(Boolean(data[k]));
    else vals.push(data[k] != null ? String(data[k]) : null);
  }
  if (updates.length === 0) return true;
  vals.push(id);
  await (sql as (q: string, p?: unknown[]) => Promise<unknown>)(
    `UPDATE feature_cards SET ${updates.join(", ")}, updated_at = NOW() WHERE id = $${i + 1} AND deleted_at IS NULL`,
    vals
  );
  return true;
}

export async function adminDeleteFeatureCard(id: number): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  await sql`UPDATE feature_cards SET deleted_at = NOW() WHERE id = ${id}`;
  return true;
}

// About stats
export async function adminListAboutStats(): Promise<Array<{ id: number; value: string; label: string; display_order: number; is_active: boolean; created_at: string; updated_at: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`SELECT id, value, label, display_order, is_active, created_at, updated_at FROM about_stats WHERE deleted_at IS NULL ORDER BY display_order ASC`;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    value: String(r.value),
    label: String(r.label),
    display_order: Number(r.display_order ?? 0),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function adminGetAboutStat(id: number): Promise<Record<string, unknown> | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM about_stats WHERE id = ${id} AND deleted_at IS NULL`;
  return one<Record<string, unknown>>(rows);
}

export async function adminCreateAboutStat(data: Record<string, unknown>): Promise<{ id: number } | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    INSERT INTO about_stats (value, label, display_order, is_active)
    VALUES (${String(data.value)}, ${String(data.label)}, ${Number(data.display_order ?? 0)}, ${Boolean(data.is_active !== false)})
    RETURNING id
  `;
  const row = one<{ id: number }>(rows);
  return row ? { id: Number(row.id) } : null;
}

export async function adminUpdateAboutStat(id: number, data: Record<string, unknown>): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  const allowed = ["value", "label", "display_order", "is_active"];
  const updates: string[] = [];
  const vals: unknown[] = [];
  let i = 0;
  for (const k of allowed) {
    if (data[k] === undefined) continue;
    i++;
    updates.push(`${k} = $${i}`);
    if (k === "display_order") vals.push(Number(data[k]));
    else if (k === "is_active") vals.push(Boolean(data[k]));
    else vals.push(String(data[k]));
  }
  if (updates.length === 0) return true;
  vals.push(id);
  await (sql as (q: string, p?: unknown[]) => Promise<unknown>)(
    `UPDATE about_stats SET ${updates.join(", ")}, updated_at = NOW() WHERE id = $${i + 1} AND deleted_at IS NULL`,
    vals
  );
  return true;
}

export async function adminDeleteAboutStat(id: number): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  await sql`UPDATE about_stats SET deleted_at = NOW() WHERE id = ${id}`;
  return true;
}

// About highlights
export async function adminListAboutHighlights(): Promise<Array<{ id: number; title: string; copy: string; display_order: number; is_active: boolean; created_at: string; updated_at: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`SELECT id, title, copy, display_order, is_active, created_at, updated_at FROM about_highlights WHERE deleted_at IS NULL ORDER BY display_order ASC`;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    title: String(r.title),
    copy: String(r.copy),
    display_order: Number(r.display_order ?? 0),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function adminGetAboutHighlight(id: number): Promise<Record<string, unknown> | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM about_highlights WHERE id = ${id} AND deleted_at IS NULL`;
  return one<Record<string, unknown>>(rows);
}

export async function adminCreateAboutHighlight(data: Record<string, unknown>): Promise<{ id: number } | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    INSERT INTO about_highlights (title, copy, display_order, is_active)
    VALUES (${String(data.title)}, ${String(data.copy)}, ${Number(data.display_order ?? 0)}, ${Boolean(data.is_active !== false)})
    RETURNING id
  `;
  const row = one<{ id: number }>(rows);
  return row ? { id: Number(row.id) } : null;
}

export async function adminUpdateAboutHighlight(id: number, data: Record<string, unknown>): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  const allowed = ["title", "copy", "display_order", "is_active"];
  const updates: string[] = [];
  const vals: unknown[] = [];
  let i = 0;
  for (const k of allowed) {
    if (data[k] === undefined) continue;
    i++;
    updates.push(`${k} = $${i}`);
    if (k === "display_order") vals.push(Number(data[k]));
    else if (k === "is_active") vals.push(Boolean(data[k]));
    else vals.push(String(data[k]));
  }
  if (updates.length === 0) return true;
  vals.push(id);
  await (sql as (q: string, p?: unknown[]) => Promise<unknown>)(
    `UPDATE about_highlights SET ${updates.join(", ")}, updated_at = NOW() WHERE id = $${i + 1} AND deleted_at IS NULL`,
    vals
  );
  return true;
}

export async function adminDeleteAboutHighlight(id: number): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  await sql`UPDATE about_highlights SET deleted_at = NOW() WHERE id = ${id}`;
  return true;
}

// Contact channels
export async function adminListContactChannels(): Promise<Array<{ id: number; label: string; value: string; detail?: string; display_order: number; is_active: boolean; created_at: string; updated_at: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`SELECT id, label, value, detail, display_order, is_active, created_at, updated_at FROM contact_channels WHERE deleted_at IS NULL ORDER BY display_order ASC`;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    label: String(r.label),
    value: String(r.value),
    detail: r.detail != null ? String(r.detail) : undefined,
    display_order: Number(r.display_order ?? 0),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function adminGetContactChannel(id: number): Promise<Record<string, unknown> | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM contact_channels WHERE id = ${id} AND deleted_at IS NULL`;
  return one<Record<string, unknown>>(rows);
}

export async function adminCreateContactChannel(data: Record<string, unknown>): Promise<{ id: number } | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    INSERT INTO contact_channels (label, value, detail, display_order, is_active)
    VALUES (${String(data.label)}, ${String(data.value)}, ${data.detail != null ? String(data.detail) : null}, ${Number(data.display_order ?? 0)}, ${Boolean(data.is_active !== false)})
    RETURNING id
  `;
  const row = one<{ id: number }>(rows);
  return row ? { id: Number(row.id) } : null;
}

export async function adminUpdateContactChannel(id: number, data: Record<string, unknown>): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  const allowed = ["label", "value", "detail", "display_order", "is_active"];
  const updates: string[] = [];
  const vals: unknown[] = [];
  let i = 0;
  for (const k of allowed) {
    if (data[k] === undefined) continue;
    i++;
    updates.push(`${k} = $${i}`);
    if (k === "display_order") vals.push(Number(data[k]));
    else if (k === "is_active") vals.push(Boolean(data[k]));
    else vals.push(data[k] != null ? String(data[k]) : null);
  }
  if (updates.length === 0) return true;
  vals.push(id);
  await (sql as (q: string, p?: unknown[]) => Promise<unknown>)(
    `UPDATE contact_channels SET ${updates.join(", ")}, updated_at = NOW() WHERE id = $${i + 1} AND deleted_at IS NULL`,
    vals
  );
  return true;
}

export async function adminDeleteContactChannel(id: number): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  await sql`UPDATE contact_channels SET deleted_at = NOW() WHERE id = ${id}`;
  return true;
}

// Contact quick facts
export async function adminListContactQuickFacts(): Promise<Array<{ id: number; fact: string; display_order: number; is_active: boolean; created_at: string; updated_at: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`SELECT id, fact, display_order, is_active, created_at, updated_at FROM contact_quick_facts WHERE deleted_at IS NULL ORDER BY display_order ASC`;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    fact: String(r.fact),
    display_order: Number(r.display_order ?? 0),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function adminGetContactQuickFact(id: number): Promise<Record<string, unknown> | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM contact_quick_facts WHERE id = ${id} AND deleted_at IS NULL`;
  return one<Record<string, unknown>>(rows);
}

export async function adminCreateContactQuickFact(data: Record<string, unknown>): Promise<{ id: number } | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    INSERT INTO contact_quick_facts (fact, display_order, is_active)
    VALUES (${String(data.fact)}, ${Number(data.display_order ?? 0)}, ${Boolean(data.is_active !== false)})
    RETURNING id
  `;
  const row = one<{ id: number }>(rows);
  return row ? { id: Number(row.id) } : null;
}

export async function adminUpdateContactQuickFact(id: number, data: Record<string, unknown>): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  const allowed = ["fact", "display_order", "is_active"];
  const updates: string[] = [];
  const vals: unknown[] = [];
  let i = 0;
  for (const k of allowed) {
    if (data[k] === undefined) continue;
    i++;
    updates.push(`${k} = $${i}`);
    if (k === "display_order") vals.push(Number(data[k]));
    else if (k === "is_active") vals.push(Boolean(data[k]));
    else vals.push(String(data[k]));
  }
  if (updates.length === 0) return true;
  vals.push(id);
  await (sql as (q: string, p?: unknown[]) => Promise<unknown>)(
    `UPDATE contact_quick_facts SET ${updates.join(", ")}, updated_at = NOW() WHERE id = $${i + 1} AND deleted_at IS NULL`,
    vals
  );
  return true;
}

export async function adminDeleteContactQuickFact(id: number): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  await sql`UPDATE contact_quick_facts SET deleted_at = NOW() WHERE id = ${id}`;
  return true;
}

// Itineraries
export async function adminListItineraries(): Promise<Array<{ id: number; slug: string; title: string; summary?: string; badge?: string; image_base64?: string; duration_days?: number; price_from?: number; difficulty?: string; display_order: number; is_active: boolean; created_at: string; updated_at: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`SELECT id, slug, title, summary, badge, image_base64, duration_days, price_from, difficulty, display_order, is_active, created_at, updated_at FROM itineraries WHERE deleted_at IS NULL ORDER BY display_order ASC`;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    slug: String(r.slug),
    title: String(r.title),
    summary: r.summary != null ? String(r.summary) : undefined,
    badge: r.badge != null ? String(r.badge) : undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
    duration_days: r.duration_days != null ? Number(r.duration_days) : undefined,
    price_from: r.price_from != null ? Number(r.price_from) : undefined,
    difficulty: r.difficulty != null ? String(r.difficulty) : undefined,
    display_order: Number(r.display_order ?? 0),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function adminGetItinerary(id: number): Promise<Record<string, unknown> | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM itineraries WHERE id = ${id} AND deleted_at IS NULL`;
  return one<Record<string, unknown>>(rows);
}

export async function adminCreateItinerary(data: Record<string, unknown>): Promise<{ id: number } | null> {
  const sql = getDb();
  if (!sql) return null;
  const slug = (data.slug as string) || String(data.title).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const rows = await sql`
    INSERT INTO itineraries (slug, title, summary, badge, image_base64, duration_days, price_from, difficulty, display_order, is_active)
    VALUES (${slug}, ${String(data.title)}, ${data.summary != null ? String(data.summary) : null}, ${data.badge != null ? String(data.badge) : null}, ${data.image_base64 != null ? String(data.image_base64) : null}, ${data.duration_days != null ? Number(data.duration_days) : null}, ${data.price_from != null ? Number(data.price_from) : null}, ${data.difficulty != null ? String(data.difficulty) : null}, ${Number(data.display_order ?? 0)}, ${Boolean(data.is_active !== false)})
    RETURNING id
  `;
  const row = one<{ id: number }>(rows);
  return row ? { id: Number(row.id) } : null;
}

export async function adminUpdateItinerary(id: number, data: Record<string, unknown>): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  const allowed = ["slug", "title", "summary", "badge", "image_base64", "duration_days", "price_from", "difficulty", "display_order", "is_active"];
  const updates: string[] = [];
  const vals: unknown[] = [];
  let i = 0;
  for (const k of allowed) {
    if (data[k] === undefined) continue;
    i++;
    updates.push(`${k} = $${i}`);
    if (k === "duration_days" || k === "display_order") vals.push(Number(data[k]));
    else if (k === "price_from") vals.push(data[k] != null ? Number(data[k]) : null);
    else if (k === "is_active") vals.push(Boolean(data[k]));
    else vals.push(data[k] != null ? String(data[k]) : null);
  }
  if (updates.length === 0) return true;
  vals.push(id);
  await (sql as (q: string, p?: unknown[]) => Promise<unknown>)(
    `UPDATE itineraries SET ${updates.join(", ")}, updated_at = NOW() WHERE id = $${i + 1} AND deleted_at IS NULL`,
    vals
  );
  return true;
}

export async function adminDeleteItinerary(id: number): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  await sql`UPDATE itineraries SET deleted_at = NOW() WHERE id = ${id}`;
  return true;
}

// Destinations
export async function adminListDestinations(): Promise<Array<{ id: number; name: string; slug: string; region?: string; teaser?: string; tag?: string; description?: string; image_base64?: string; display_order: number; is_active: boolean; created_at: string; updated_at: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`SELECT id, name, slug, region, teaser, tag, description, image_base64, display_order, is_active, created_at, updated_at FROM destinations WHERE deleted_at IS NULL ORDER BY display_order ASC`;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    slug: String(r.slug),
    region: r.region != null ? String(r.region) : undefined,
    teaser: r.teaser != null ? String(r.teaser) : undefined,
    tag: r.tag != null ? String(r.tag) : undefined,
    description: r.description != null ? String(r.description) : undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
    display_order: Number(r.display_order ?? 0),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function adminGetDestination(id: number): Promise<Record<string, unknown> | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM destinations WHERE id = ${id} AND deleted_at IS NULL`;
  return one<Record<string, unknown>>(rows);
}

export async function adminCreateDestination(data: Record<string, unknown>): Promise<{ id: number } | null> {
  const sql = getDb();
  if (!sql) return null;
  const slug = (data.slug as string) || String(data.name).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const rows = await sql`
    INSERT INTO destinations (name, slug, region, teaser, tag, description, image_base64, display_order, is_active)
    VALUES (${String(data.name)}, ${slug}, ${data.region != null ? String(data.region) : null}, ${data.teaser != null ? String(data.teaser) : null}, ${data.tag != null ? String(data.tag) : null}, ${data.description != null ? String(data.description) : null}, ${data.image_base64 != null ? String(data.image_base64) : null}, ${Number(data.display_order ?? 0)}, ${Boolean(data.is_active !== false)})
    RETURNING id
  `;
  const row = one<{ id: number }>(rows);
  return row ? { id: Number(row.id) } : null;
}

export async function adminUpdateDestination(id: number, data: Record<string, unknown>): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  const allowed = ["name", "slug", "region", "teaser", "tag", "description", "image_base64", "display_order", "is_active"];
  const updates: string[] = [];
  const vals: unknown[] = [];
  let i = 0;
  for (const k of allowed) {
    if (data[k] === undefined) continue;
    i++;
    updates.push(`${k} = $${i}`);
    if (k === "display_order") vals.push(Number(data[k]));
    else if (k === "is_active") vals.push(Boolean(data[k]));
    else vals.push(data[k] != null ? String(data[k]) : null);
  }
  if (updates.length === 0) return true;
  vals.push(id);
  await (sql as (q: string, p?: unknown[]) => Promise<unknown>)(
    `UPDATE destinations SET ${updates.join(", ")}, updated_at = NOW() WHERE id = $${i + 1} AND deleted_at IS NULL`,
    vals
  );
  return true;
}

export async function adminDeleteDestination(id: number): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  await sql`UPDATE destinations SET deleted_at = NOW() WHERE id = ${id}`;
  return true;
}

// Lodges
export async function adminListLodges(): Promise<Array<{ id: number; name: string; slug: string; location?: string; type?: string; mood?: string; short_description?: string; image_base64?: string; price_from?: number; display_order: number; is_active: boolean; created_at: string; updated_at: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`SELECT id, name, slug, location, type, mood, short_description, image_base64, price_from, display_order, is_active, created_at, updated_at FROM lodges WHERE deleted_at IS NULL ORDER BY display_order ASC`;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    slug: String(r.slug),
    location: r.location != null ? String(r.location) : undefined,
    type: r.type != null ? String(r.type) : undefined,
    mood: r.mood != null ? String(r.mood) : undefined,
    short_description: r.short_description != null ? String(r.short_description) : undefined,
    image_base64: r.image_base64 != null ? String(r.image_base64) : undefined,
    price_from: r.price_from != null ? Number(r.price_from) : undefined,
    display_order: Number(r.display_order ?? 0),
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function adminGetLodge(id: number): Promise<Record<string, unknown> | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM lodges WHERE id = ${id} AND deleted_at IS NULL`;
  return one<Record<string, unknown>>(rows);
}

export async function adminCreateLodge(data: Record<string, unknown>): Promise<{ id: number } | null> {
  const sql = getDb();
  if (!sql) return null;
  const slug = (data.slug as string) || String(data.name).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const rows = await sql`
    INSERT INTO lodges (name, slug, location, type, mood, short_description, image_base64, price_from, display_order, is_active)
    VALUES (${String(data.name)}, ${slug}, ${data.location != null ? String(data.location) : null}, ${data.type != null ? String(data.type) : null}, ${data.mood != null ? String(data.mood) : null}, ${data.short_description != null ? String(data.short_description) : null}, ${data.image_base64 != null ? String(data.image_base64) : null}, ${data.price_from != null ? Number(data.price_from) : null}, ${Number(data.display_order ?? 0)}, ${Boolean(data.is_active !== false)})
    RETURNING id
  `;
  const row = one<{ id: number }>(rows);
  return row ? { id: Number(row.id) } : null;
}

export async function adminUpdateLodge(id: number, data: Record<string, unknown>): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  const allowed = ["name", "slug", "location", "type", "mood", "short_description", "image_base64", "price_from", "display_order", "is_active"];
  const updates: string[] = [];
  const vals: unknown[] = [];
  let i = 0;
  for (const k of allowed) {
    if (data[k] === undefined) continue;
    i++;
    updates.push(`${k} = $${i}`);
    if (k === "display_order") vals.push(Number(data[k]));
    else if (k === "price_from") vals.push(data[k] != null ? Number(data[k]) : null);
    else if (k === "is_active") vals.push(Boolean(data[k]));
    else vals.push(data[k] != null ? String(data[k]) : null);
  }
  if (updates.length === 0) return true;
  vals.push(id);
  await (sql as (q: string, p?: unknown[]) => Promise<unknown>)(
    `UPDATE lodges SET ${updates.join(", ")}, updated_at = NOW() WHERE id = $${i + 1} AND deleted_at IS NULL`,
    vals
  );
  return true;
}

export async function adminDeleteLodge(id: number): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  await sql`UPDATE lodges SET deleted_at = NOW() WHERE id = ${id}`;
  return true;
}

// Tour packages
export async function adminListTourPackages(): Promise<Array<{ id: number; slug: string; title: string; short_description?: string; description?: string; price_from?: number; duration_days?: number; max_participants?: number; is_featured: boolean; display_order: number; created_at: string; updated_at: string }>> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`SELECT id, slug, title, short_description, description, price_from, duration_days, max_participants, is_featured, display_order, created_at, updated_at FROM tour_packages WHERE deleted_at IS NULL ORDER BY display_order ASC`;
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: Number(r.id),
    slug: String(r.slug),
    title: String(r.title),
    short_description: r.short_description != null ? String(r.short_description) : undefined,
    description: r.description != null ? String(r.description) : undefined,
    price_from: r.price_from != null ? Number(r.price_from) : undefined,
    duration_days: r.duration_days != null ? Number(r.duration_days) : undefined,
    max_participants: r.max_participants != null ? Number(r.max_participants) : undefined,
    is_featured: Boolean(r.is_featured),
    display_order: Number(r.display_order ?? 0),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function adminGetTourPackage(id: number): Promise<Record<string, unknown> | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM tour_packages WHERE id = ${id} AND deleted_at IS NULL`;
  return one<Record<string, unknown>>(rows);
}

export async function adminCreateTourPackage(data: Record<string, unknown>): Promise<{ id: number } | null> {
  const sql = getDb();
  if (!sql) return null;
  const slug = (data.slug as string) || String(data.title).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const rows = await sql`
    INSERT INTO tour_packages (title, slug, short_description, description, price_from, duration_days, max_participants, is_featured, display_order, published_at)
    VALUES (${String(data.title)}, ${slug}, ${data.short_description != null ? String(data.short_description) : null}, ${data.description != null ? String(data.description) : null}, ${data.price_from != null ? Number(data.price_from) : null}, ${data.duration_days != null ? Number(data.duration_days) : null}, ${data.max_participants != null ? Number(data.max_participants) : null}, ${Boolean(data.is_featured)}, ${Number(data.display_order ?? 0)}, NOW())
    RETURNING id
  `;
  const row = one<{ id: number }>(rows);
  return row ? { id: Number(row.id) } : null;
}

export async function adminUpdateTourPackage(id: number, data: Record<string, unknown>): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  const allowed = ["title", "slug", "short_description", "description", "price_from", "duration_days", "max_participants", "is_featured", "display_order", "published_at"];
  const updates: string[] = [];
  const vals: unknown[] = [];
  let i = 0;
  for (const k of allowed) {
    if (data[k] === undefined) continue;
    i++;
    updates.push(`${k} = $${i}`);
    if (k === "price_from" || k === "duration_days" || k === "max_participants" || k === "display_order") vals.push(data[k] != null ? Number(data[k]) : null);
    else if (k === "is_featured") vals.push(Boolean(data[k]));
    else if (k === "published_at") vals.push(data[k] != null ? data[k] : null);
    else vals.push(data[k] != null ? String(data[k]) : null);
  }
  if (updates.length === 0) return true;
  vals.push(id);
  await (sql as (q: string, p?: unknown[]) => Promise<unknown>)(
    `UPDATE tour_packages SET ${updates.join(", ")}, updated_at = NOW() WHERE id = $${i + 1} AND deleted_at IS NULL`,
    vals
  );
  return true;
}

export async function adminDeleteTourPackage(id: number): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  await sql`UPDATE tour_packages SET deleted_at = NOW() WHERE id = ${id}`;
  return true;
}
