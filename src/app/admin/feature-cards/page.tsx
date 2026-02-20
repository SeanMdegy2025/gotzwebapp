"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  deleteAdminFeatureCard,
  getAdminFeatureCards,
  type FeatureCard,
} from "@/lib/auth";

export default function AdminFeatureCardsPage() {
  const [cards, setCards] = useState<FeatureCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    getAdminFeatureCards()
      .then((r) => setCards(r.feature_cards))
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this feature card?")) return;
    setDeleting(id);
    deleteAdminFeatureCard(id)
      .then(() => load())
      .catch((e) => alert(e?.message || "Failed to delete"))
      .finally(() => setDeleting(null));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading feature cards...</p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feature Cards</h1>
            <p className="mt-1 text-sm text-gray-500">Manage homepage feature cards</p>
          </div>
          <Link
            href="/admin/feature-cards/create"
            className="inline-flex items-center gap-2 rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90"
          >
            Add New Card
          </Link>
        </div>
      </header>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Icon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Count Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {cards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      <span className="rounded-full bg-safari-gold/20 px-3 py-1 text-xs font-medium text-safari-green">
                        {card.icon}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{card.title}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {card.count_value ?? "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {card.display_order}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          card.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {card.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/admin/feature-cards/${card.id}/edit`}
                        className="text-safari-green hover:text-safari-green/80"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(card.id)}
                        disabled={deleting === card.id}
                        className="ml-4 text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleting === card.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
                {cards.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                      No feature cards found. Create your first one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
