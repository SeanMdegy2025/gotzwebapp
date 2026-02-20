"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  deleteAdminItinerary,
  getAdminItineraries,
  type Itinerary,
} from "@/lib/auth";

function formatPrice(n: number | null | undefined) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

export default function AdminItinerariesPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    getAdminItineraries()
      .then((r) => setItineraries(r.itineraries))
      .catch(() => setItineraries([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this safari?")) return;
    setDeleting(id);
    deleteAdminItinerary(id)
      .then(() => load())
      .catch((e) => alert(e?.message || "Failed to delete"))
      .finally(() => setDeleting(null));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading safaris...</p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Safaris (Itineraries)</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage the safari packages displayed on your website
            </p>
          </div>
          <Link
            href="/admin/itineraries/create"
            className="inline-flex items-center gap-2 rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Safari
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
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Badge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Price
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
                {itineraries.map((it) => (
                  <tr key={it.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-16 w-24 overflow-hidden rounded-lg bg-gray-100">
                        {it.image_base64 ? (
                          <img
                            src={it.image_base64}
                            alt={it.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{it.title}</div>
                      <div className="line-clamp-2 text-xs text-gray-500">{it.summary}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {it.badge ? (
                        <span className="rounded-full bg-safari-gold/20 px-3 py-1 text-xs font-medium text-safari-green">
                          {it.badge}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {it.duration_days} days
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {formatPrice(it.price_from)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          it.published_at ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {it.published_at ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/admin/itineraries/${it.id}/edit`}
                        className="text-safari-green hover:text-safari-green/80"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(it.id)}
                        disabled={deleting === it.id}
                        className="ml-4 text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleting === it.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
                {itineraries.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-sm font-medium text-gray-900">No safaris</p>
                      <p className="mt-2 text-sm text-gray-500">Get started by creating a new safari.</p>
                      <div className="mt-6">
                        <Link
                          href="/admin/itineraries/create"
                          className="inline-flex items-center gap-2 rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90"
                        >
                          Add Your First Safari
                        </Link>
                      </div>
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
