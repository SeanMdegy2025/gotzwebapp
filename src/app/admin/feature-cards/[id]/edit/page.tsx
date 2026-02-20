"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAdminFeatureCard,
  updateAdminFeatureCard,
  type FeatureCard,
} from "@/lib/auth";

export default function AdminFeatureCardsEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [card, setCard] = useState<FeatureCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    if (!id || isNaN(id)) return;
    getAdminFeatureCard(id)
      .then((r) => {
        setCard(r.feature_card);
        setForm({
          icon: (r.feature_card.icon as "travellers" | "pricing" | "support") || "travellers",
          title: r.feature_card.title || "",
          headline: r.feature_card.headline || "",
          copy: r.feature_card.copy || "",
          count_value: r.feature_card.count_value ?? null,
          display_order: r.feature_card.display_order ?? 0,
          is_active: r.feature_card.is_active ?? true,
        });
      })
      .catch(() => setCard(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!card) return;
    setError(null);
    setSaving(true);
    updateAdminFeatureCard(card.id, {
      ...form,
      count_value: form.count_value ?? undefined,
    })
      .then(() => router.push("/admin/feature-cards"))
      .catch((err) => {
        setError(err?.message || "Failed to update card");
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading feature card...</p>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-gray-500">Feature card not found.</p>
        <Link href="/admin/feature-cards" className="mt-2 text-sm text-safari-green hover:underline">
          ← Back to Feature Cards
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Feature Card</h1>
            <p className="mt-1 text-sm text-gray-500">Update the feature card content</p>
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
                  Card Icon *
                </label>
                <select
                  id="icon"
                  value={form.icon}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, icon: e.target.value as "travellers" | "pricing" | "support" }))
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                >
                  <option value="travellers">👥 Travellers</option>
                  <option value="pricing">💰 Pricing</option>
                  <option value="support">🛟 Support</option>
                </select>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Card Title *
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
                <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                  Headline (Optional)
                </label>
                <input
                  id="headline"
                  type="text"
                  value={form.headline}
                  onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
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
                <label htmlFor="count_value" className="block text-sm font-medium text-gray-700">
                  Counter Number (Optional)
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
              disabled={saving}
              className="rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 disabled:opacity-50"
            >
              {saving ? "Updating…" : "Update Feature Card"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
