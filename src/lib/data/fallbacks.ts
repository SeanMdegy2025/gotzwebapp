/**
 * Static fallbacks for read-only content when no DB is configured.
 * Replace with Vercel Postgres (or other store) in production.
 */

export const fallbackHeroSlides = [] as Array<{
  id: number;
  label?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: string;
}>;

export const fallbackFeatureCards = [] as Array<{ icon?: string; title: string; headline?: string; copy?: string; count_value?: number }>;
export const fallbackAboutStats = [] as Array<{ value: string; label: string }>;
export const fallbackAboutHighlights = [] as Array<{ title: string; copy: string }>;
export const fallbackContactChannels = [] as Array<{ label: string; value: string; detail?: string }>;
export const fallbackContactQuickFacts = [] as string[];
export const fallbackItineraries = [] as Array<{
  id: number;
  slug: string;
  title: string;
  summary?: string;
  badge?: string;
  image_base64?: string;
  duration_days?: number;
  price_from?: number | null;
  difficulty?: string;
}>;
export const fallbackDestinations = [] as Array<{
  id: number;
  name: string;
  slug: string;
  region?: string;
  teaser?: string;
  tag?: string;
  description?: string;
  image_base64?: string;
}>;
export const fallbackLodges = [] as Array<{
  id: number;
  name: string;
  slug: string;
  location?: string;
  type?: string;
  mood?: string;
  short_description?: string;
  image_base64?: string;
  price_from?: number | null;
}>;
export const fallbackTourPackages = [] as Array<{
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
  gallery: Array<{ id: number; url: string; thumb: string; cover: string }>;
  images: string[];
}>;
