"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAdminAboutHighlight } from "@/lib/auth";

export default function AdminAboutHighlightsCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    copy: "",
    display_order: 0,
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    createAdminAboutHighlight(form)
      .then(() => router.push("/admin/about-highlights"))
      .catch((err) => {
        setError(err?.message || "Failed to create highlight");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create About Highlight</h1>
            <p className="mt-1 text-sm text-gray-500">Add a new highlight card to the About section</p>
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
                  Highlight Title (Main heading) *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g., Dedicated Journey Architect"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This is the main heading that appears on the highlight card.
                </p>
              </div>
              <div>
                <label htmlFor="copy" className="block text-sm font-medium text-gray-700">
                  Description Text (What the highlight says) *
                </label>
                <textarea
                  id="copy"
                  rows={4}
                  required
                  value={form.copy}
                  onChange={(e) => setForm((f) => ({ ...f, copy: e.target.value }))}
                  placeholder="e.g., A single expert consultant curates, books, and monitors every detail..."
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
                <p className="mt-1 text-xs text-gray-500">
                  A short description that explains what this highlight offers to visitors.
                </p>
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
                <p className="mt-1 text-xs text-gray-500">0 = First highlight, 1 = Second, etc.</p>
              </div>
              <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-4">
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
              disabled={loading}
              className="rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create About Highlight"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
