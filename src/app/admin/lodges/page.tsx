"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  deleteAdminLodge,
  getAdminLodges,
  type AdminLodge,
} from "@/lib/auth";

function formatPrice(n: number | null | undefined) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

export default function AdminLodgesPage() {
  const [lodges, setLodges] = useState<AdminLodge[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    getAdminLodges()
      .then((r) => setLodges(r.lodges))
      .catch(() => setLodges([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this lodge?")) return;
    setDeleting(id);
    deleteAdminLodge(id)
      .then(() => load())
      .catch((e) => alert(e?.message || "Failed to delete"))
      .finally(() => setDeleting(null));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading lodges...</p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lodges</h1>
            <p className="mt-1 text-sm text-gray-500">Manage lodges and camps</p>
          </div>
          <Link
            href="/admin/lodges/create"
            className="inline-flex items-center gap-2 rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90"
          >
            Add New Lodge
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
                    Location
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
                {lodges.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-16 w-24 overflow-hidden rounded-lg bg-gray-100">
                        {l.image_base64 ? (
                          <img src={l.image_base64} alt={l.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{l.name}</div>
                      <div className="text-xs text-gray-500">{l.type || "lodge"}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {l.location || "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {formatPrice(l.price_from)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          l.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {l.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/admin/lodges/${l.id}/edit`}
                        className="text-safari-green hover:text-safari-green/80"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(l.id)}
                        disabled={deleting === l.id}
                        className="ml-4 text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleting === l.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
                {lodges.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="text-sm font-medium text-gray-900">No lodges</p>
                      <Link
                        href="/admin/lodges/create"
                        className="mt-4 inline-flex rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white hover:bg-safari-green/90"
                      >
                        Add Your First Lodge
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
