"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAdminHeroSlide } from "@/lib/auth";

export default function AdminHeroSlidesCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    label: "",
    subtitle: "",
    description: "",
    cta_label: "",
    cta_url: "#safaris",
    position: 0,
    is_active: true,
    image_base64: null as string | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    createAdminHeroSlide({
      ...form,
      image_base64: form.image_base64 ?? undefined,
    })
      .then(() => router.push("/admin/hero-slides"))
      .catch((err) => {
        setError(err?.message || "Failed to create slide");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Hero Slide</h1>
            <p className="mt-1 text-sm text-gray-500">
              Add a new slide to your homepage carousel
            </p>
          </div>
          <Link
            href="/admin/hero-slides"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Hero Slides
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
              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Slide Image (The background picture) *
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-safari-green file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-safari-green/90"
                />
                <div className="mt-2 rounded-lg border border-purple-200 bg-purple-50 p-3">
                  <p className="text-xs font-medium text-purple-900">Image tips:</p>
                  <ul className="ml-4 mt-1 list-disc space-y-0.5 text-xs text-purple-700">
                    <li>Use high-quality images (1920×1080px or larger recommended)</li>
                    <li>Choose images that represent Tanzania safaris, wildlife, or landscapes</li>
                    <li>Make sure text will be readable over the image (darker images work better)</li>
                  </ul>
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-medium text-gray-700">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-48 w-full rounded-lg border border-gray-200 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Label */}
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                  Small Text Above Title (Optional)
                </label>
                <input
                  id="label"
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  placeholder="e.g., Tailored Luxury Adventures"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This appears as small text above the main title. Leave empty if not needed.
                </p>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Main Title (The Big Heading) *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g., Encounter Tanzania's wild soul – from savannah to spice isles"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This is the main headline that visitors will see first. Make it compelling!
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description Text (Optional)
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="e.g., Join expert guides for once-in-a-lifetime safaris..."
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
                <p className="mt-1 text-xs text-gray-500">
                  A short paragraph that describes what this slide is about. Appears below the title.
                </p>
              </div>

              {/* CTA Label */}
              <div>
                <label htmlFor="cta_label" className="block text-sm font-medium text-gray-700">
                  Button Text (What the button says) *
                </label>
                <input
                  id="cta_label"
                  type="text"
                  required
                  value={form.cta_label}
                  onChange={(e) => setForm((f) => ({ ...f, cta_label: e.target.value }))}
                  placeholder="e.g., Explore Signature Safaris"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
                <p className="mt-1 text-xs text-gray-500">
                  The text that appears on the main call-to-action button.
                </p>
              </div>

              {/* CTA URL */}
              <div>
                <label htmlFor="cta_url" className="block text-sm font-medium text-gray-700">
                  Where should the button link to? *
                </label>
                <input
                  id="cta_url"
                  type="text"
                  required
                  value={form.cta_url}
                  onChange={(e) => setForm((f) => ({ ...f, cta_url: e.target.value }))}
                  placeholder="#safaris"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
                <div className="mt-2 space-y-1 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-xs font-medium text-blue-900">Examples:</p>
                  <ul className="ml-4 list-disc space-y-0.5 text-xs text-blue-700">
                    <li><code className="rounded bg-blue-100 px-1">#safaris</code> – Links to Safaris section</li>
                    <li><code className="rounded bg-blue-100 px-1">#about</code> – Links to About section</li>
                    <li><code className="rounded bg-blue-100 px-1">#contact</code> – Links to Contact section</li>
                  </ul>
                </div>
              </div>

              {/* Position */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                  Display Order (Which slide appears first?)
                </label>
                <input
                  id="position"
                  type="number"
                  min={0}
                  value={form.position}
                  onChange={(e) => setForm((f) => ({ ...f, position: parseInt(e.target.value, 10) || 0 }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
                <p className="mt-1 text-xs text-gray-500">
                  0 = First slide, 1 = Second slide, etc. Leave as 0 for first.
                </p>
              </div>

              {/* Active Status */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <label className="flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-safari-green focus:ring-safari-green"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Show this slide on the website
                  </span>
                </label>
                <p className="mt-2 text-xs text-gray-600">
                  Checked = Visible on website | Unchecked = Hidden from website
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link
              href="/admin/hero-slides"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create Hero Slide"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
