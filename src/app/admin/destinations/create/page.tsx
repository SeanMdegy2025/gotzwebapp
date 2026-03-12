"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAdminDestination } from "@/lib/auth";

export default function AdminDestinationsCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    region: "",
    teaser: "",
    tag: "",
    description: "",
    image_base64: null as string | null,
    images: [] as Array<{ image_base64: string }>,
    map_embed_url: "",
    is_featured: false,
    display_order: 0,
    published_at: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const genSlug = () => {
    if (!form.name) return;
    setForm((f) => ({
      ...f,
      slug: form.name
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

  const addGalleryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setForm((f) => ({ ...f, images: [...f.images, { image_base64: base64 }] }));
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const removeGalleryImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const moveGalleryImage = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= form.images.length) return;
    setForm((f) => {
      const arr = [...f.images];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return { ...f, images: arr };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    createAdminDestination({
      ...form,
      image_base64: form.image_base64 ?? undefined,
      images: form.images,
      map_embed_url: form.map_embed_url || undefined,
      published_at: form.published_at || undefined,
    })
      .then(() => router.push("/admin/destinations"))
      .catch((err) => {
        setError(err?.message || "Failed to create destination");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Destination</h1>
            <p className="mt-1 text-sm text-gray-500">Add a new destination</p>
          </div>
          <Link href="/admin/destinations" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Destinations
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
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-safari-green file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-4 h-48 w-full rounded-lg border object-cover"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gallery images</label>
                <p className="mt-1 text-xs text-gray-500">Extra images for the destination (card and modal on the home page). Order: first = card when no main image.</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img.image_base64} alt="" className="h-24 w-28 rounded-lg border border-gray-200 object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-lg bg-black/50 opacity-0 transition group-hover:opacity-100">
                        <button type="button" onClick={() => moveGalleryImage(idx, -1)} disabled={idx === 0} className="rounded bg-white/90 p-1.5 text-gray-800 disabled:opacity-40" title="Move left">←</button>
                        <button type="button" onClick={() => removeGalleryImage(idx)} className="rounded bg-red-500 p-1.5 text-white" title="Remove">×</button>
                        <button type="button" onClick={() => moveGalleryImage(idx, 1)} disabled={idx === form.images.length - 1} className="rounded bg-white/90 p-1.5 text-gray-800 disabled:opacity-40" title="Move right">→</button>
                      </div>
                    </div>
                  ))}
                  <label className="flex h-24 w-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-xs text-gray-500 hover:border-safari-green hover:bg-safari-green/5">
                    <span className="font-medium">+ Add</span>
                    <input type="file" accept="image/*" onChange={addGalleryImage} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  onBlur={genSlug}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <input
                  id="slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                    Region
                  </label>
                  <input
                    id="region"
                    type="text"
                    value={form.region}
                    onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                  />
                </div>
                <div>
                  <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
                    Tag
                  </label>
                  <input
                    id="tag"
                    type="text"
                    value={form.tag}
                    onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="teaser" className="block text-sm font-medium text-gray-700">
                  Teaser
                </label>
                <input
                  id="teaser"
                  type="text"
                  value={form.teaser}
                  onChange={(e) => setForm((f) => ({ ...f, teaser: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
              </div>
              <div>
                <label htmlFor="map_embed_url" className="block text-sm font-medium text-gray-700">
                  Map Embed URL
                </label>
                <input
                  id="map_embed_url"
                  type="url"
                  value={form.map_embed_url}
                  onChange={(e) => setForm((f) => ({ ...f, map_embed_url: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
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
            <Link href="/admin/destinations" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create Destination"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
