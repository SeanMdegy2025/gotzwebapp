/**
 * Admin auth: token storage and API client for same-origin /api/admin/* and /api/login.
 */

const TOKEN_KEY = "admin_token";

function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export async function fetchAuth<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? getToken() : null;
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      clearToken();
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    if (res.status === 422 && (data as { errors?: Record<string, string[]> }).errors) {
      const first = Object.values((data as { errors: Record<string, string[]> }).errors)[0];
      const msg = Array.isArray(first) ? first[0] : first;
      throw new Error(msg || (data as { message?: string }).message || "Validation failed.");
    }
    throw new Error((data as { message?: string }).message || `API error: ${res.status}`);
  }

  return data as T;
}

export type AdminBooking = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  travel_date: string | null;
  number_of_travelers: number;
  status: string;
  created_at: string;
  updated_at?: string;
  tour_package: { id: number; title: string; slug: string } | null;
  special_requests?: string;
  admin_notes?: string;
  completed_at?: string;
  customization_data?: { locations?: { location: string; days: number }[]; total_days?: number; special_preferences?: string } | null;
};

export type AdminContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
  updated_at?: string;
};

export async function getAdminDashboard() {
  return fetchAuth<{
    pending_bookings: number;
    new_messages: number;
    total_bookings: number;
    total_messages: number;
    tour_packages_count: number;
    recent_bookings: AdminBooking[];
    recent_messages: AdminContactMessage[];
  }>("/api/admin/dashboard");
}

export async function getAdminBookings(status?: string) {
  const q = status ? `?status=${status}` : "";
  return fetchAuth<{ bookings: AdminBooking[] }>(`/api/admin/bookings${q}`);
}

export async function getAdminBooking(id: number) {
  return fetchAuth<{ booking: AdminBooking }>(`/api/admin/bookings/${id}`);
}

export async function updateAdminBooking(id: number, data: { admin_notes?: string; status: string }) {
  return fetchAuth<{ booking: AdminBooking }>(`/api/admin/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function completeAdminBooking(id: number) {
  return fetchAuth<{ booking: AdminBooking }>(`/api/admin/bookings/${id}/complete`, { method: "POST" });
}

export async function getAdminContactMessages(status?: string) {
  const q = status ? `?status=${status}` : "";
  return fetchAuth<{ messages: AdminContactMessage[]; stats?: { total: number; new: number; closed: number } }>(
    `/api/admin/contact-messages${q}`
  );
}

export async function getAdminContactMessage(id: number) {
  return fetchAuth<{ message: AdminContactMessage }>(`/api/admin/contact-messages/${id}`);
}

export async function updateAdminContactMessage(id: number, data: { status: string }) {
  return fetchAuth<{ message: AdminContactMessage }>(`/api/admin/contact-messages/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function resolveAdminContactMessage(id: number) {
  return fetchAuth<{ message: AdminContactMessage }>(`/api/admin/contact-messages/${id}/resolve`, { method: "POST" });
}

export async function login(email: string, password: string) {
  const url = `${getBaseUrl()}/api/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || "Login failed.");
  }
  return data as { token: string; user: { id: number; name: string; email: string } };
}

export async function register(email: string, password: string, name?: string) {
  const url = `${getBaseUrl()}/api/register`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password, name: name || null }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || "Registration failed.");
  }
  return data as { message: string; user: { id: number; email: string; name: string | null } };
}

// Stub types and fetchers for content admin (return empty until we add CRUD APIs)
export type HeroSlide = { id: number; title: string; label?: string; subtitle?: string; description?: string; image_base64?: string; cta_label: string; cta_url: string; position: number; is_active: boolean; created_at: string; updated_at: string };
export type FeatureCard = { id: number; icon: string; title: string; headline?: string; copy: string; count_value?: number; display_order: number; is_active: boolean; created_at: string; updated_at: string };
export type AboutStat = { id: number; value: string; label: string; display_order: number; is_active: boolean; created_at: string; updated_at: string };
export type AboutHighlight = { id: number; title: string; copy: string; display_order: number; is_active: boolean; created_at: string; updated_at: string };
export type ItineraryDay = { id?: number; day_number: number; title?: string; description?: string; accommodation?: string; meals?: string };
export type Itinerary = { id: number; title: string; slug: string; summary?: string; badge?: string; image_base64?: string | null; duration_days: number; price_from?: number; difficulty?: string; highlights?: string[]; inclusions?: string[]; exclusions?: string[]; days: ItineraryDay[]; display_order: number; is_featured: boolean; published_at?: string; created_at: string; updated_at: string };
export type AdminTourPackage = { id: number; slug: string; title: string; short_description?: string; description?: string; price_from?: number; duration_days?: number; max_participants?: number; is_featured: boolean; display_order: number; created_at: string; updated_at: string };
export type AdminDestination = { id: number; name: string; slug: string; region?: string; teaser?: string; tag?: string; description?: string; image_base64?: string; map_embed_url?: string; display_order: number; is_featured: boolean; published_at?: string; created_at: string; updated_at: string };
export type AdminLodge = { id: number; name: string; slug?: string; location?: string; type?: string; mood?: string; short_description?: string; description?: string; image_base64?: string; amenities?: string[]; price_from?: number; capacity?: number; display_order: number; is_active: boolean; is_featured: boolean; published_at?: string; created_at: string; updated_at: string };
export type AdminContactChannel = { id: number; label: string; value: string; detail?: string; display_order: number; is_active: boolean; created_at: string; updated_at: string };
export type AdminContactQuickFact = { id: number; fact: string; display_order: number; is_active: boolean; created_at: string; updated_at: string };

async function stubEmpty<T>(key: string): Promise<T> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/admin/${key}`, {
      headers: { Accept: "application/json", ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) },
    });
    if (res.ok) return res.json() as Promise<T>;
  } catch {}
  return { [key.replace(/-/g, "_").replace(/\/(.*)/, "")]: [] } as unknown as T;
}

export async function getAdminHeroSlides() {
  return fetchAuth<{ hero_slides: HeroSlide[] }>("/api/admin/hero-slides").catch(() => ({ hero_slides: [] }));
}
export async function getAdminHeroSlide(id: number) {
  return fetchAuth<{ hero_slide: HeroSlide }>(`/api/admin/hero-slides/${id}`);
}
export async function createAdminHeroSlide(data: Partial<HeroSlide> & { title: string; cta_label: string; cta_url: string }) {
  return fetchAuth<{ hero_slide: HeroSlide }>("/api/admin/hero-slides", { method: "POST", body: JSON.stringify(data) });
}
export async function updateAdminHeroSlide(id: number, data: Partial<HeroSlide>) {
  return fetchAuth<{ hero_slide: HeroSlide }>(`/api/admin/hero-slides/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}
export async function deleteAdminHeroSlide(id: number) {
  return fetchAuth<{ message: string }>(`/api/admin/hero-slides/${id}`, { method: "DELETE" });
}

export async function getAdminFeatureCards() {
  return fetchAuth<{ feature_cards: FeatureCard[] }>("/api/admin/feature-cards").catch(() => ({ feature_cards: [] }));
}
export async function getAdminFeatureCard(id: number) {
  return fetchAuth<{ feature_card: FeatureCard }>(`/api/admin/feature-cards/${id}`);
}
export async function createAdminFeatureCard(data: Partial<FeatureCard> & { icon: string; title: string; copy: string }) {
  return fetchAuth<{ feature_card: FeatureCard }>("/api/admin/feature-cards", { method: "POST", body: JSON.stringify(data) });
}
export async function updateAdminFeatureCard(id: number, data: Partial<FeatureCard>) {
  return fetchAuth<{ feature_card: FeatureCard }>(`/api/admin/feature-cards/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}
export async function deleteAdminFeatureCard(id: number) {
  return fetchAuth<{ message: string }>(`/api/admin/feature-cards/${id}`, { method: "DELETE" });
}

export async function getAdminAboutStats() {
  return fetchAuth<{ about_stats: AboutStat[] }>("/api/admin/about-stats").catch(() => ({ about_stats: [] }));
}
export async function getAdminAboutStat(id: number) {
  return fetchAuth<{ about_stat: AboutStat }>(`/api/admin/about-stats/${id}`);
}
export async function createAdminAboutStat(data: Partial<AboutStat> & { value: string; label: string }) {
  return fetchAuth<{ about_stat: AboutStat }>("/api/admin/about-stats", { method: "POST", body: JSON.stringify(data) });
}
export async function updateAdminAboutStat(id: number, data: Partial<AboutStat>) {
  return fetchAuth<{ about_stat: AboutStat }>(`/api/admin/about-stats/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}
export async function deleteAdminAboutStat(id: number) {
  return fetchAuth<{ message: string }>(`/api/admin/about-stats/${id}`, { method: "DELETE" });
}

export async function getAdminAboutHighlights() {
  return fetchAuth<{ about_highlights: AboutHighlight[] }>("/api/admin/about-highlights").catch(() => ({ about_highlights: [] }));
}
export async function getAdminAboutHighlight(id: number) {
  return fetchAuth<{ about_highlight: AboutHighlight }>(`/api/admin/about-highlights/${id}`);
}
export async function createAdminAboutHighlight(data: Partial<AboutHighlight> & { title: string; copy: string }) {
  return fetchAuth<{ about_highlight: AboutHighlight }>("/api/admin/about-highlights", { method: "POST", body: JSON.stringify(data) });
}
export async function updateAdminAboutHighlight(id: number, data: Partial<AboutHighlight>) {
  return fetchAuth<{ about_highlight: AboutHighlight }>(`/api/admin/about-highlights/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}
export async function deleteAdminAboutHighlight(id: number) {
  return fetchAuth<{ message: string }>(`/api/admin/about-highlights/${id}`, { method: "DELETE" });
}

export async function getAdminItineraries() {
  return fetchAuth<{ itineraries: Itinerary[] }>("/api/admin/itineraries").catch(() => ({ itineraries: [] }));
}
export async function getAdminItinerary(id: number) {
  return fetchAuth<{ itinerary: Itinerary }>(`/api/admin/itineraries/${id}`);
}
export async function createAdminItinerary(data: Partial<Itinerary> & { title: string; duration_days: number }) {
  return fetchAuth<{ itinerary: Itinerary }>("/api/admin/itineraries", { method: "POST", body: JSON.stringify(data) });
}
export async function updateAdminItinerary(id: number, data: Partial<Itinerary>) {
  return fetchAuth<{ itinerary: Itinerary }>(`/api/admin/itineraries/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}
export async function deleteAdminItinerary(id: number) {
  return fetchAuth<{ message: string }>(`/api/admin/itineraries/${id}`, { method: "DELETE" });
}

export async function getAdminTourPackages() {
  return fetchAuth<{ tour_packages: AdminTourPackage[] }>("/api/admin/tour-packages").catch(() => ({ tour_packages: [] }));
}
export async function getAdminTourPackage(id: number) {
  return fetchAuth<{ tour_package: AdminTourPackage }>(`/api/admin/tour-packages/${id}`);
}
export async function createAdminTourPackage(data: Partial<AdminTourPackage> & { title: string }) {
  return fetchAuth<{ tour_package: AdminTourPackage }>("/api/admin/tour-packages", { method: "POST", body: JSON.stringify(data) });
}
export async function updateAdminTourPackage(id: number, data: Partial<AdminTourPackage>) {
  return fetchAuth<{ tour_package: AdminTourPackage }>(`/api/admin/tour-packages/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}
export async function deleteAdminTourPackage(id: number) {
  return fetchAuth<{ message: string }>(`/api/admin/tour-packages/${id}`, { method: "DELETE" });
}

export async function getAdminDestinations() {
  return fetchAuth<{ destinations: AdminDestination[] }>("/api/admin/destinations").catch(() => ({ destinations: [] }));
}
export async function getAdminDestination(id: number) {
  return fetchAuth<{ destination: AdminDestination }>(`/api/admin/destinations/${id}`);
}
export async function createAdminDestination(data: Partial<AdminDestination> & { name: string }) {
  return fetchAuth<{ destination: AdminDestination }>("/api/admin/destinations", { method: "POST", body: JSON.stringify(data) });
}
export async function updateAdminDestination(id: number, data: Partial<AdminDestination>) {
  return fetchAuth<{ destination: AdminDestination }>(`/api/admin/destinations/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}
export async function deleteAdminDestination(id: number) {
  return fetchAuth<{ message: string }>(`/api/admin/destinations/${id}`, { method: "DELETE" });
}

export async function getAdminLodges() {
  return fetchAuth<{ lodges: AdminLodge[] }>("/api/admin/lodges").catch(() => ({ lodges: [] }));
}
export async function getAdminLodge(id: number) {
  return fetchAuth<{ lodge: AdminLodge }>(`/api/admin/lodges/${id}`);
}
export async function createAdminLodge(data: Partial<AdminLodge> & { name: string }) {
  return fetchAuth<{ lodge: AdminLodge }>("/api/admin/lodges", { method: "POST", body: JSON.stringify(data) });
}
export async function updateAdminLodge(id: number, data: Partial<AdminLodge>) {
  return fetchAuth<{ lodge: AdminLodge }>(`/api/admin/lodges/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}
export async function deleteAdminLodge(id: number) {
  return fetchAuth<{ message: string }>(`/api/admin/lodges/${id}`, { method: "DELETE" });
}

export async function getAdminContactChannels() {
  return fetchAuth<{ contact_channels: AdminContactChannel[] }>("/api/admin/contact-channels").catch(() => ({ contact_channels: [] }));
}
export async function getAdminContactChannel(id: number) {
  return fetchAuth<{ contact_channel: AdminContactChannel }>(`/api/admin/contact-channels/${id}`);
}
export async function createAdminContactChannel(data: Partial<AdminContactChannel> & { label: string; value: string }) {
  return fetchAuth<{ contact_channel: AdminContactChannel }>("/api/admin/contact-channels", { method: "POST", body: JSON.stringify(data) });
}
export async function updateAdminContactChannel(id: number, data: Partial<AdminContactChannel>) {
  return fetchAuth<{ contact_channel: AdminContactChannel }>(`/api/admin/contact-channels/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}
export async function deleteAdminContactChannel(id: number) {
  return fetchAuth<{ message: string }>(`/api/admin/contact-channels/${id}`, { method: "DELETE" });
}

export async function getAdminContactQuickFacts() {
  return fetchAuth<{ contact_quick_facts: AdminContactQuickFact[] }>("/api/admin/contact-quick-facts").catch(() => ({ contact_quick_facts: [] }));
}
export async function getAdminContactQuickFact(id: number) {
  return fetchAuth<{ contact_quick_fact: AdminContactQuickFact }>(`/api/admin/contact-quick-facts/${id}`);
}
export async function createAdminContactQuickFact(data: Partial<AdminContactQuickFact> & { fact: string }) {
  return fetchAuth<{ contact_quick_fact: AdminContactQuickFact }>("/api/admin/contact-quick-facts", { method: "POST", body: JSON.stringify(data) });
}
export async function updateAdminContactQuickFact(id: number, data: Partial<AdminContactQuickFact>) {
  return fetchAuth<{ contact_quick_fact: AdminContactQuickFact }>(`/api/admin/contact-quick-facts/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}
export async function deleteAdminContactQuickFact(id: number) {
  return fetchAuth<{ message: string }>(`/api/admin/contact-quick-facts/${id}`, { method: "DELETE" });
}

export type AdminUser = { id: number; email: string; name: string | null; role: string; created_at: string };
export async function getAdminUsers() {
  return fetchAuth<{ users: AdminUser[] }>("/api/admin/users").catch(() => ({ users: [] }));
}
export async function createAdminUser(data: { email: string; password: string; name?: string | null; role?: string }) {
  return fetchAuth<{ user: AdminUser }>("/api/admin/users", { method: "POST", body: JSON.stringify(data) });
}
