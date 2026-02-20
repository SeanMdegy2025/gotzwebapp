"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAdminItinerary, type ItineraryDay } from "@/lib/auth";

export default function AdminItinerariesCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    badge: "",
    slug: "",
    image_base64: null as string | null,
    duration_days: 7,
    price_from: "" as string | number,
    difficulty: "",
    highlights: [] as string[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    display_order: 0,
    is_featured: false,
    published_at: "" as string,
    days: [{ day_number: 1, title: "", description: "", accommodation: "", meals: "" }] as ItineraryDay[],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const genSlug = () => {
    if (!form.title) return;
    setForm((f) => ({
      ...f,
      slug: form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setForm((f) => ({ ...f, image_base64: base64 }));
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const addDay = () => {
    const nextNum = Math.max(...form.days.map((d) => d.day_number), 0) + 1;
    setForm((f) => ({
      ...f,
      days: [...f.days, { day_number: nextNum, title: "", description: "", accommodation: "", meals: "" }],
    }));
  };

  const removeDay = (idx: number) => {
    if (form.days.length <= 1) return;
    setForm((f) => ({ ...f, days: f.days.filter((_, i) => i !== idx) }));
  };

  const updateDay = (idx: number, field: keyof ItineraryDay, value: string | number) => {
    setForm((f) => ({
      ...f,
      days: f.days.map((d, i) => (i === idx ? { ...d, [field]: value } : d)),
    }));
  };

  const addArrayItem = (key: "highlights" | "inclusions" | "exclusions") => {
    setForm((f) => ({ ...f, [key]: [...f[key], ""] }));
  };

  const removeArrayItem = (key: "highlights" | "inclusions" | "exclusions", idx: number) => {
    setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }));
  };

  const updateArrayItem = (key: "highlights" | "inclusions" | "exclusions", idx: number, value: string) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].map((v, i) => (i === idx ? value : v)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const payload = {
      title: form.title,
      summary: form.summary || undefined,
      badge: form.badge || undefined,
      slug: form.slug || undefined,
      image_base64: form.image_base64 ?? undefined,
      duration_days: form.duration_days,
      price_from: form.price_from ? Number(form.price_from) : undefined,
      difficulty: form.difficulty || undefined,
      highlights: form.highlights.filter(Boolean),
      inclusions: form.inclusions.filter(Boolean),
      exclusions: form.exclusions.filter(Boolean),
      display_order: form.display_order,
      is_featured: form.is_featured,
      published_at: form.published_at || undefined,
      days: form.days.map((d) => ({
        day_number: d.day_number,
        title: d.title || undefined,
        description: d.description || undefined,
        accommodation: d.accommodation || undefined,
        meals: d.meals || undefined,
      })),
    };
    createAdminItinerary(payload)
      .then(() => router.push("/admin/itineraries"))
      .catch((err) => {
        setError(err?.message || "Failed to create safari");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Safari</h1>
            <p className="mt-1 text-sm text-gray-500">Add a new safari package to your website</p>
          </div>
          <Link href="/admin/itineraries" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Safaris
          </Link>
        </div>
      </header>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="space-y-6 p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Safari Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-safari-green file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-safari-green/90"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-4 h-48 w-full rounded-lg border border-gray-200 object-cover"
                  />
                )}
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  onBlur={genSlug}
                  placeholder="e.g., Great Migration Serengeti Safari"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  URL Slug
                </label>
                <input
                  id="slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="great-migration-serengeti-safari"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
              </div>

              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                  Summary
                </label>
                <textarea
                  id="summary"
                  rows={3}
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="badge" className="block text-sm font-medium text-gray-700">
                    Badge
                  </label>
                  <input
                    id="badge"
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                    placeholder="e.g., Best Seller"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                  />
                </div>
                <div>
                  <label htmlFor="duration_days" className="block text-sm font-medium text-gray-700">
                    Duration (days) *
                  </label>
                  <input
                    id="duration_days"
                    type="number"
                    min={1}
                    required
                    value={form.duration_days}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, duration_days: parseInt(e.target.value, 10) || 1 }))
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price_from" className="block text-sm font-medium text-gray-700">
                    Price From ($)
                  </label>
                  <input
                    id="price_from"
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.price_from}
                    onChange={(e) => setForm((f) => ({ ...f, price_from: e.target.value }))}
                    placeholder="2500"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                  />
                </div>
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                    Difficulty
                  </label>
                  <input
                    id="difficulty"
                    type="text"
                    value={form.difficulty}
                    onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                    placeholder="e.g., Moderate"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Highlights</label>
                  <button
                    type="button"
                    onClick={() => addArrayItem("highlights")}
                    className="text-sm text-safari-green hover:underline"
                  >
                    + Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {form.highlights.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => updateArrayItem("highlights", i, e.target.value)}
                        placeholder="Highlight item"
                        className="block flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("highlights", i)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Inclusions</label>
                  <button
                    type="button"
                    onClick={() => addArrayItem("inclusions")}
                    className="text-sm text-safari-green hover:underline"
                  >
                    + Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {form.inclusions.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => updateArrayItem("inclusions", i, e.target.value)}
                        placeholder="Included item"
                        className="block flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("inclusions", i)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Exclusions</label>
                  <button
                    type="button"
                    onClick={() => addArrayItem("exclusions")}
                    className="text-sm text-safari-green hover:underline"
                  >
                    + Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {form.exclusions.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => updateArrayItem("exclusions", i, e.target.value)}
                        placeholder="Excluded item"
                        className="block flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("exclusions", i)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Itinerary Days</label>
                <div className="mt-2 space-y-4">
                  {form.days.map((day, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">Day {day.day_number}</span>
                        <button
                          type="button"
                          onClick={() => removeDay(idx)}
                          disabled={form.days.length <= 1}
                          className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid gap-2">
                        <input
                          type="number"
                          min={1}
                          value={day.day_number}
                          onChange={(e) =>
                            updateDay(idx, "day_number", parseInt(e.target.value, 10) || 1)
                          }
                          placeholder="Day #"
                          className="block w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={day.title || ""}
                          onChange={(e) => updateDay(idx, "title", e.target.value)}
                          placeholder="Day title"
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                        <textarea
                          rows={2}
                          value={day.description || ""}
                          onChange={(e) => updateDay(idx, "description", e.target.value)}
                          placeholder="Description"
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={day.accommodation || ""}
                            onChange={(e) => updateDay(idx, "accommodation", e.target.value)}
                            placeholder="Accommodation"
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          />
                          <input
                            type="text"
                            value={day.meals || ""}
                            onChange={(e) => updateDay(idx, "meals", e.target.value)}
                            placeholder="Meals"
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addDay}
                  className="mt-2 text-sm text-safari-green hover:underline"
                >
                  + Add Day
                </button>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-safari-green focus:ring-safari-green"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
                <div>
                  <label htmlFor="published_at" className="block text-sm font-medium text-gray-700">
                    Publish Date
                  </label>
                  <input
                    id="published_at"
                    type="date"
                    value={form.published_at}
                    onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
                    className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link href="/admin/itineraries" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create Safari"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
