"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAdminFeatureCard } from "@/lib/auth";

export default function AdminFeatureCardsCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    icon: "travellers" as "travellers" | "pricing" | "support",
    title: "",
    headline: "",
    copy: "",
    count_value: null as number | null,
    display_order: 0,
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    createAdminFeatureCard({
      ...form,
      count_value: form.count_value ?? undefined,
    })
      .then(() => router.push("/admin/feature-cards"))
      .catch((err) => {
        setError(err?.message || "Failed to create card");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Feature Card</h1>
            <p className="mt-1 text-sm text-gray-500">Add a new feature card to your homepage</p>
          </div>
          <Link
            href="/admin/feature-cards"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Feature Cards
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
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                  Card Icon (The picture shown) *
                </label>
                <select
                  id="icon"
                  value={form.icon}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, icon: e.target.value as "travellers" | "pricing" | "support" }))
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                >
                  <option value="travellers">👥 Travellers (Shows animated counter)</option>
                  <option value="pricing">💰 Pricing (Shows price tag icon)</option>
                  <option value="support">🛟 Support (Shows support icon)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Choose the icon that best represents this feature card.
                </p>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Card Title (Main heading) *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g., Happy Travellers Yearly"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This is the main heading that appears on the card.
                </p>
              </div>

              <div>
                <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                  Headline (Optional - Only for Travellers card)
                </label>
                <input
                  id="headline"
                  type="text"
                  value={form.headline}
                  onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
                  placeholder="e.g., 500+ Happy Travellers Yearly"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Only used for the Travellers card. Leave empty for other card types.
                </p>
              </div>

              <div>
                <label htmlFor="copy" className="block text-sm font-medium text-gray-700">
                  Description Text (What the card says) *
                </label>
                <textarea
                  id="copy"
                  rows={4}
                  required
                  value={form.copy}
                  onChange={(e) => setForm((f) => ({ ...f, copy: e.target.value }))}
                  placeholder="e.g., Expert travel designers crafting hand-picked itineraries..."
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
                <p className="mt-1 text-xs text-gray-500">
                  A short description that explains what this feature offers to visitors.
                </p>
              </div>

              <div>
                <label htmlFor="count_value" className="block text-sm font-medium text-gray-700">
                  Counter Number (For animated counter)
                </label>
                <input
                  id="count_value"
                  type="number"
                  min={0}
                  value={form.count_value ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      count_value: e.target.value ? parseInt(e.target.value, 10) : null,
                    }))
                  }
                  placeholder="e.g., 500"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
                <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-xs font-medium text-blue-900">When to use:</p>
                  <ul className="ml-4 mt-1 list-disc space-y-0.5 text-xs text-blue-700">
                    <li>Only needed for the &quot;Travellers&quot; card type</li>
                    <li>This number will animate when visitors hover over the card</li>
                    <li>Leave empty for other card types (Pricing, Support)</li>
                  </ul>
                </div>
              </div>

              <div>
                <label htmlFor="display_order" className="block text-sm font-medium text-gray-700">
                  Display Order (Which card appears first?)
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
                <p className="mt-1 text-xs text-gray-500">
                  0 = First card, 1 = Second card, 2 = Third card. Leave as 0 for first.
                </p>
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
            <Link
              href="/admin/feature-cards"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create Feature Card"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
