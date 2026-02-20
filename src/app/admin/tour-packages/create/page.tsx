"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAdminTourPackage } from "@/lib/auth";

export default function AdminTourPackagesCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    price_from: "" as string | number,
    duration_days: "" as string | number,
    max_participants: "" as string | number,
    is_featured: false,
    display_order: 0,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    createAdminTourPackage({
      ...form,
      slug: form.slug || undefined,
      short_description: form.short_description || undefined,
      description: form.description || undefined,
      price_from: form.price_from ? Number(form.price_from) : undefined,
      duration_days: form.duration_days ? Number(form.duration_days) : undefined,
      max_participants: form.max_participants ? Number(form.max_participants) : undefined,
    })
      .then(() => router.push("/admin/tour-packages"))
      .catch((err) => {
        setError(err?.message || "Failed to create package");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Tour Package</h1>
            <p className="mt-1 text-sm text-gray-500">Add a new tour package for booking</p>
          </div>
          <Link href="/admin/tour-packages" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Tour Packages
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
                  placeholder="e.g., Great Migration Serengeti"
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
                  placeholder="great-migration-serengeti"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
              </div>
              <div>
                <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
                  Short Description
                </label>
                <textarea
                  id="short_description"
                  rows={2}
                  value={form.short_description}
                  onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Full Description
                </label>
                <textarea
                  id="description"
                  rows={6}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
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
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                  />
                </div>
                <div>
                  <label htmlFor="duration_days" className="block text-sm font-medium text-gray-700">
                    Duration (days)
                  </label>
                  <input
                    id="duration_days"
                    type="number"
                    min={1}
                    value={form.duration_days}
                    onChange={(e) => setForm((f) => ({ ...f, duration_days: e.target.value }))}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                  />
                </div>
                <div>
                  <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700">
                    Max Participants
                  </label>
                  <input
                    id="max_participants"
                    type="number"
                    min={1}
                    value={form.max_participants}
                    onChange={(e) => setForm((f) => ({ ...f, max_participants: e.target.value }))}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
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
                  <label htmlFor="display_order" className="block text-sm font-medium text-gray-700">
                    Display Order
                  </label>
                  <input
                    id="display_order"
                    type="number"
                    min={0}
                    value={form.display_order}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, display_order: parseInt(e.target.value, 10) || 0 }))
                    }
                    className="mt-1 w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-4">
            <Link href="/admin/tour-packages" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create Tour Package"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
