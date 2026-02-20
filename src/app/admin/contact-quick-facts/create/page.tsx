"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAdminContactQuickFact } from "@/lib/auth";

export default function AdminContactQuickFactsCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fact: "",
    display_order: 0,
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    createAdminContactQuickFact(form)
      .then(() => router.push("/admin/contact-quick-facts"))
      .catch((err) => {
        setError(err?.message || "Failed to create fact");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Quick Fact</h1>
            <p className="mt-1 text-sm text-gray-500">Add a quick fact for the contact section</p>
          </div>
          <Link href="/admin/contact-quick-facts" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Quick Facts
          </Link>
        </div>
      </header>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="space-y-6 p-6">
              <div>
                <label htmlFor="fact" className="block text-sm font-medium text-gray-700">
                  Fact *
                </label>
                <textarea
                  id="fact"
                  rows={4}
                  required
                  value={form.fact}
                  onChange={(e) => setForm((f) => ({ ...f, fact: e.target.value }))}
                  placeholder="e.g., 24/7 support available for all bookings"
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
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
                  Active
                </label>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-4">
            <Link href="/admin/contact-quick-facts" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create Fact"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
