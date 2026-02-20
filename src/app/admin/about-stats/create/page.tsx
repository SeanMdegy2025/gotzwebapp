"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAdminAboutStat } from "@/lib/auth";

export default function AdminAboutStatsCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    value: "",
    label: "",
    display_order: 0,
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    createAdminAboutStat(form)
      .then(() => router.push("/admin/about-stats"))
      .catch((err) => {
        setError(err?.message || "Failed to create stat");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create About Stat</h1>
            <p className="mt-1 text-sm text-gray-500">Add a new statistic to the About section</p>
          </div>
          <Link href="/admin/about-stats" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to About Stats
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
                <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                  Stat Value (The number or percentage) *
                </label>
                <input
                  id="value"
                  type="text"
                  required
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                  placeholder="e.g., 18+, 32, 96%"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This is the big number that appears prominently. Can include symbols like + or %.
                </p>
              </div>
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                  Stat Label (What it represents) *
                </label>
                <input
                  id="label"
                  type="text"
                  required
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  placeholder="e.g., Years curating luxury safaris"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
                <p className="mt-1 text-xs text-gray-500">
                  A short description of what this statistic represents.
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
                <p className="mt-1 text-xs text-gray-500">0 = First stat, 1 = Second stat, etc.</p>
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
                  Show this stat on the website
                </label>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-4">
            <Link href="/admin/about-stats" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create About Stat"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
