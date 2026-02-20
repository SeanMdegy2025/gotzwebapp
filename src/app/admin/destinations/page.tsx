"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  deleteAdminDestination,
  getAdminDestinations,
  type AdminDestination,
} from "@/lib/auth";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<AdminDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    getAdminDestinations()
      .then((r) => setDestinations(r.destinations))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    setDeleting(id);
    deleteAdminDestination(id)
      .then(() => load())
      .catch((e) => alert(e?.message || "Failed to delete"))
      .finally(() => setDeleting(null));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading destinations...</p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
            <p className="mt-1 text-sm text-gray-500">Manage destinations displayed on your website</p>
          </div>
          <Link
            href="/admin/destinations/create"
            className="inline-flex items-center gap-2 rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90"
          >
            Add New Destination
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Region
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
                {destinations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-16 w-24 overflow-hidden rounded-lg bg-gray-100">
                        {d.image_base64 ? (
                          <img src={d.image_base64} alt={d.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{d.name}</div>
                      <div className="text-xs text-gray-500">{d.slug}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {d.region || "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          d.published_at ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {d.published_at ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/admin/destinations/${d.id}/edit`}
                        className="text-safari-green hover:text-safari-green/80"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(d.id)}
                        disabled={deleting === d.id}
                        className="ml-4 text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleting === d.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
                {destinations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <p className="text-sm font-medium text-gray-900">No destinations</p>
                      <Link
                        href="/admin/destinations/create"
                        className="mt-4 inline-flex rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white hover:bg-safari-green/90"
                      >
                        Add Your First Destination
                      </Link>
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
