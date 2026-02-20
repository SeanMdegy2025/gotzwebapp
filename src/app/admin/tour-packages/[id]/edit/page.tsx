"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAdminTourPackage,
  updateAdminTourPackage,
  type AdminTourPackage,
} from "@/lib/auth";

export default function AdminTourPackagesEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [pkg, setPkg] = useState<AdminTourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    if (!id || isNaN(id)) return;
    getAdminTourPackage(id)
      .then((r) => {
        const p = r.tour_package;
        setPkg(p);
        setForm({
          title: p.title || "",
          slug: p.slug || "",
          short_description: p.short_description || "",
          description: p.description || "",
          price_from: p.price_from ?? "",
          duration_days: p.duration_days ?? "",
          max_participants: p.max_participants ?? "",
          is_featured: p.is_featured ?? false,
          display_order: p.display_order ?? 0,
        });
      })
      .catch(() => setPkg(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;
    setError(null);
    setSaving(true);
    updateAdminTourPackage(pkg.id, {
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
        setError(err?.message || "Failed to update package");
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading package...</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-gray-500">Package not found.</p>
        <Link href="/admin/tour-packages" className="mt-2 text-sm text-safari-green hover:underline">
          ← Back to Tour Packages
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Tour Package</h1>
            <p className="mt-1 text-sm text-gray-500">Update the tour package</p>
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
              disabled={saving}
              className="rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 disabled:opacity-50"
            >
              {saving ? "Updating…" : "Update Tour Package"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
