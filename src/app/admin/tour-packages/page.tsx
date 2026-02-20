"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  deleteAdminTourPackage,
  getAdminTourPackages,
  type AdminTourPackage,
} from "@/lib/auth";

function formatPrice(n: number | null | undefined) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

export default function AdminTourPackagesPage() {
  const [packages, setPackages] = useState<AdminTourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    getAdminTourPackages()
      .then((r) => setPackages(r.tour_packages))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this tour package?")) return;
    setDeleting(id);
    deleteAdminTourPackage(id)
      .then(() => load())
      .catch((e) => alert(e?.message || "Failed to delete"))
      .finally(() => setDeleting(null));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading tour packages...</p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tour Packages</h1>
            <p className="mt-1 text-sm text-gray-500">Manage tour packages available for booking</p>
          </div>
          <Link
            href="/admin/tour-packages/create"
            className="inline-flex items-center gap-2 rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Package
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
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                      <div className="text-xs text-gray-500">{pkg.slug}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {pkg.duration_days ? `${pkg.duration_days} days` : "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {formatPrice(pkg.price_from)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          pkg.is_featured ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pkg.is_featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/tour-packages/${pkg.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-safari-green hover:text-safari-green/80"
                      >
                        View →
                      </Link>
                      <Link
                        href={`/admin/tour-packages/${pkg.id}/edit`}
                        className="ml-4 text-safari-green hover:text-safari-green/80"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(pkg.id)}
                        disabled={deleting === pkg.id}
                        className="ml-4 text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleting === pkg.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
                {packages.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <p className="text-sm font-medium text-gray-900">No tour packages</p>
                      <p className="mt-2 text-sm text-gray-500">Create your first tour package.</p>
                      <div className="mt-6">
                        <Link
                          href="/admin/tour-packages/create"
                          className="inline-flex items-center gap-2 rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90"
                        >
                          Add New Package
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
