"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAdminAboutHighlight,
  updateAdminAboutHighlight,
  type AboutHighlight,
} from "@/lib/auth";

export default function AdminAboutHighlightsEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [highlight, setHighlight] = useState<AboutHighlight | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    copy: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (!id || isNaN(id)) return;
    getAdminAboutHighlight(id)
      .then((r) => {
        setHighlight(r.about_highlight);
        setForm({
          title: r.about_highlight.title || "",
          copy: r.about_highlight.copy || "",
          display_order: r.about_highlight.display_order ?? 0,
          is_active: r.about_highlight.is_active ?? true,
        });
      })
      .catch(() => setHighlight(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!highlight) return;
    setError(null);
    setSaving(true);
    updateAdminAboutHighlight(highlight.id, form)
      .then(() => router.push("/admin/about-highlights"))
      .catch((err) => {
        setError(err?.message || "Failed to update highlight");
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading highlight...</p>
      </div>
    );
  }

  if (!highlight) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-gray-500">Highlight not found.</p>
        <Link href="/admin/about-highlights" className="mt-2 text-sm text-safari-green hover:underline">
          ← Back to About Highlights
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit About Highlight</h1>
            <p className="mt-1 text-sm text-gray-500">Update the highlight content</p>
          </div>
          <Link href="/admin/about-highlights" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to About Highlights
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
                  Highlight Title *
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
                <label htmlFor="copy" className="block text-sm font-medium text-gray-700">
                  Description Text *
                </label>
                <textarea
                  id="copy"
                  rows={4}
                  required
                  value={form.copy}
                  onChange={(e) => setForm((f) => ({ ...f, copy: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
              </div>
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
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-safari-green focus:ring-safari-green"
                />
                <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                  Show this highlight on the website
                </label>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-4">
            <Link href="/admin/about-highlights" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 disabled:opacity-50"
            >
              {saving ? "Updating…" : "Update About Highlight"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
