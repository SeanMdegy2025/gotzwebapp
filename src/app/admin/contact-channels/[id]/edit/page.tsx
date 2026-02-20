"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAdminContactChannel,
  updateAdminContactChannel,
  type AdminContactChannel,
} from "@/lib/auth";

export default function AdminContactChannelsEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [channel, setChannel] = useState<AdminContactChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: "",
    value: "",
    detail: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (!id || isNaN(id)) return;
    getAdminContactChannel(id)
      .then((r) => {
        const c = r.contact_channel;
        setChannel(c);
        setForm({
          label: c.label || "",
          value: c.value || "",
          detail: c.detail || "",
          display_order: c.display_order ?? 0,
          is_active: c.is_active ?? true,
        });
      })
      .catch(() => setChannel(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channel) return;
    setError(null);
    setSaving(true);
    updateAdminContactChannel(channel.id, {
      ...form,
      detail: form.detail || undefined,
    })
      .then(() => router.push("/admin/contact-channels"))
      .catch((err) => {
        setError(err?.message || "Failed to update");
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-gray-500">Channel not found.</p>
        <Link href="/admin/contact-channels" className="mt-2 text-sm text-safari-green hover:underline">
          ← Back to Contact Channels
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Contact Channel</h1>
          </div>
          <Link href="/admin/contact-channels" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Contact Channels
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
                <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                  Label *
                </label>
                <input
                  id="label"
                  type="text"
                  required
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
              </div>
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                  Value *
                </label>
                <input
                  id="value"
                  type="text"
                  required
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                />
              </div>
              <div>
                <label htmlFor="detail" className="block text-sm font-medium text-gray-700">
                  Detail (optional)
                </label>
                <textarea
                  id="detail"
                  rows={2}
                  value={form.detail}
                  onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
            <Link href="/admin/contact-channels" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 disabled:opacity-50"
            >
              {saving ? "Updating…" : "Update Channel"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
