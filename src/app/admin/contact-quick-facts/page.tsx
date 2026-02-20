"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  deleteAdminContactQuickFact,
  getAdminContactQuickFacts,
  type AdminContactQuickFact,
} from "@/lib/auth";

export default function AdminContactQuickFactsPage() {
  const [facts, setFacts] = useState<AdminContactQuickFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    getAdminContactQuickFacts()
      .then((r) => setFacts(r.contact_quick_facts))
      .catch(() => setFacts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this quick fact?")) return;
    setDeleting(id);
    deleteAdminContactQuickFact(id)
      .then(() => load())
      .catch((e) => alert(e?.message || "Failed to delete"))
      .finally(() => setDeleting(null));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading quick facts...</p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Quick Facts</h1>
            <p className="mt-1 text-sm text-gray-500">Manage quick facts displayed in the contact section</p>
          </div>
          <Link
            href="/admin/contact-quick-facts/create"
            className="inline-flex items-center gap-2 rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90"
          >
            Add New Fact
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
                    Fact
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
                {facts.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="line-clamp-2">{f.fact}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {f.display_order}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          f.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {f.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/admin/contact-quick-facts/${f.id}/edit`}
                        className="text-safari-green hover:text-safari-green/80"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(f.id)}
                        disabled={deleting === f.id}
                        className="ml-4 text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleting === f.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
                {facts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <p className="text-sm font-medium text-gray-900">No quick facts</p>
                      <Link
                        href="/admin/contact-quick-facts/create"
                        className="mt-4 inline-flex rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white hover:bg-safari-green/90"
                      >
                        Add Your First Fact
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
