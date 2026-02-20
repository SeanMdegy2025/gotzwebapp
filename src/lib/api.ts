/**
 * gotzportal API client – all requests go to same-origin Next.js API routes (Vercel-compatible).
 * No Laravel backend; backend logic lives in app/api/* Route Handlers.
 */

function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function toImageSrc(value: string | null | undefined): string | null {
  if (!value || typeof value !== "string") return null;
  if (value.startsWith("data:")) return value;
  return `data:image/jpeg;base64,${value}`;
}

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const base = getBaseUrl();
  const url = `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options?.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 422 && (data as { errors?: Record<string, string[]> }).errors) {
      const first = Object.values((data as { errors: Record<string, string[]> }).errors)[0];
      const msg = Array.isArray(first) ? first[0] : first;
      throw new Error(msg || (data as { message?: string }).message || "Validation failed.");
    }
    throw new Error(
      (data as { message?: string }).message || `API error: ${res.status} ${res.statusText}`
    );
  }

  return data as T;
}

export type TourPackage = {
  id: number;
  slug: string;
  title: string;
  short_description: string | null;
  description?: string;
  price_from: number | string | null;
  duration_days: number | null;
  max_participants: number | null;
  is_featured: boolean;
  hero_image: { url: string; thumb: string; cover: string } | null;
  gallery: Array<{ id: number; url: string; thumb: string; cover: string; name?: string; alt?: string }>;
  images: string[];
};

export type HeroSlide = {
  id: number;
  label?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** From API: base64 image data (with or without data: prefix) */
  image_base64?: string;
  /** Fallback / legacy */
  image?: string;
};

export type FeatureCard = { icon?: string; title: string; headline?: string; copy?: string; count_value?: number };
export type AboutStat = { value: string; label: string };
export type AboutHighlight = { title: string; copy: string };
export type Itinerary = {
  id: number;
  slug: string;
  title: string;
  summary?: string;
  badge?: string;
  image_base64?: string;
  duration_days?: number;
  price_from?: number | null;
  difficulty?: string;
};
export type ItineraryDetail = Itinerary & {
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  days?: Array<{ day_number: number; title: string; description?: string; accommodation?: string; meals?: string }>;
};
export type Destination = {
  id: number;
  name: string;
  slug: string;
  region?: string;
  teaser?: string;
  tag?: string;
  description?: string;
  image_base64?: string;
};
export type Lodge = {
  id: number;
  name: string;
  slug: string;
  location?: string;
  type?: string;
  mood?: string;
  short_description?: string;
  image_base64?: string;
  price_from?: number | null;
};
export type ContactChannel = { label: string; value: string; detail?: string };

async function getData<T>(path: string): Promise<T[]> {
  try {
    const data = await fetchApi<{ data?: T[] }>(path);
    return (data as { data?: T[] }).data ?? [];
  } catch {
    return [];
  }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return getData<HeroSlide>("/api/hero-slides");
}

export async function getFeatureCards(): Promise<FeatureCard[]> {
  return getData<FeatureCard>("/api/feature-cards");
}

export async function getAboutStats(): Promise<AboutStat[]> {
  return getData<AboutStat>("/api/about-stats");
}

export async function getAboutHighlights(): Promise<AboutHighlight[]> {
  return getData<AboutHighlight>("/api/about-highlights");
}

export async function getItineraries(): Promise<Itinerary[]> {
  return getData<Itinerary>("/api/itineraries");
}

export async function getItinerary(slug: string): Promise<ItineraryDetail | null> {
  try {
    const data = await fetchApi<{ data?: ItineraryDetail }>(`/api/itineraries/${slug}`);
    return (data as { data?: ItineraryDetail }).data ?? null;
  } catch {
    return null;
  }
}

export async function getDestinations(): Promise<Destination[]> {
  return getData<Destination>("/api/destinations");
}

export async function getLodges(): Promise<Lodge[]> {
  return getData<Lodge>("/api/lodges");
}

export async function getContactChannels(): Promise<ContactChannel[]> {
  return getData<ContactChannel>("/api/contact-channels");
}

export async function getContactQuickFacts(): Promise<string[]> {
  try {
    const data = await fetchApi<{ data?: string[] }>("/api/contact-quick-facts");
    return (data as { data?: string[] }).data ?? [];
  } catch {
    return [];
  }
}

export async function getTourPackages(): Promise<TourPackage[]> {
  try {
    const data = await fetchApi<{ data?: TourPackage[] } | TourPackage[]>(`/api/tour-packages?per_page=50`);
    const packages = Array.isArray(data) ? data : (data as { data?: TourPackage[] }).data ?? [];
    return packages.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0;
    });
  } catch {
    return [];
  }
}

export async function getTourPackage(slug: string): Promise<TourPackage | null> {
  try {
    const data = await fetchApi<{ data?: TourPackage } | TourPackage>(`/api/tour-packages/${slug}`);
    return (data as { data?: TourPackage }).data ?? (data as TourPackage) ?? null;
  } catch {
    return null;
  }
}

export async function submitContact(payload: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const res = await fetch(`${getBaseUrl()}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let data: { message?: string; errors?: Record<string, string[]>; status?: string; message_id?: number } = {};
  try {
    if (text) data = JSON.parse(text);
  } catch {}
  if (!res.ok) {
    let msg = data.message;
    if (!msg && res.status === 422 && data.errors) {
      const first = Object.values(data.errors).flat()[0];
      msg = Array.isArray(first) ? first[0] : String(first ?? "");
    }
    throw new Error(msg || `Request failed (${res.status}). Please try again.`);
  }
  return (data || {}) as { status: string; message: string; message_id: number };
}

export async function submitBooking(payload: {
  tour_package_id?: number;
  package_slug?: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  travel_date?: string;
  number_of_travelers: number;
  customization_data?: object;
  special_requests?: string;
}) {
  const res = await fetch(`${getBaseUrl()}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let data: { message?: string; errors?: Record<string, string[]>; status?: string; booking_id?: number } = {};
  try {
    if (text) data = JSON.parse(text);
  } catch {}
  if (!res.ok) {
    let msg = data.message;
    if (!msg && res.status === 422 && data.errors) {
      const first = Object.values(data.errors).flat()[0];
      msg = Array.isArray(first) ? first[0] : String(first ?? "");
    }
    throw new Error(msg || `Request failed (${res.status}). Please try again.`);
  }
  return (data || {}) as { status: string; message: string; booking_id: number };
}
