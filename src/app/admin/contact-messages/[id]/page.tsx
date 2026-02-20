"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAdminContactMessage,
  updateAdminContactMessage,
  type AdminContactMessage,
} from "@/lib/auth";

function formatDateTime(dateString: string | null | undefined) {
  if (!dateString) return "Not specified";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800";
    case "closed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "new":
      return "New";
    case "closed":
      return "Closed";
    default:
      return status;
  }
}

export default function AdminContactMessageDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [message, setMessage] = useState<AdminContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("new");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminContactMessage(id)
      .then((d) => {
        setMessage(d.message);
        setStatus(d.message.status);
      })
      .catch(() => setMessage(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setSaving(true);
    try {
      const { message: updated } = await updateAdminContactMessage(id, { status });
      setMessage(updated);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Message not found.{" "}
        <Link href="/admin/contact-messages" className="underline">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <Link
              href="/admin/contact-messages"
              className="text-gray-400 transition hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
              </Link>
              <h2 className="text-2xl font-bold leading-tight text-gray-900">
                Contact Message #{message.id}
              </h2>
              <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(message.status)}`}
            >
              {getStatusLabel(message.status)}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              View and manage contact message details
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-3 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact Information */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="mt-1 text-sm text-gray-900">{message.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-sm text-gray-900">
                  <a
                    href={`mailto:${message.email}`}
                    className="text-safari-green hover:text-safari-green/80"
                  >
                    {message.email}
                  </a>
                </p>
              </div>
              {message.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">
                    <a
                      href={`tel:${message.phone}`}
                      className="text-safari-green hover:text-safari-green/80"
                    >
                      {message.phone}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Message Content */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Message</h3>
            </div>
            <div className="px-6 py-4">
              <p className="whitespace-pre-wrap text-sm text-gray-700">{message.message}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Status</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
              <div>
                <label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-safari-green focus:outline-none focus:ring-2 focus:ring-safari-green/20"
                >
                  <option value="new">New</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 focus:outline-none focus:ring-2 focus:ring-safari-green focus:ring-offset-2 disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Status"}
              </button>
            </form>
          </div>

          {/* Message Details */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Message Details</h3>
            </div>
            <div className="space-y-3 px-6 py-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Submitted:</span>
                <p className="mt-1 text-gray-900">{formatDateTime(message.created_at)}</p>
              </div>
              {message.resolved_at && (
                <div>
                  <span className="font-medium text-gray-500">Resolved:</span>
                  <p className="mt-1 text-gray-900">{formatDateTime(message.resolved_at)}</p>
                </div>
              )}
              {message.updated_at && (
                <div>
                  <span className="font-medium text-gray-500">Last Updated:</span>
                  <p className="mt-1 text-gray-900">{formatDateTime(message.updated_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
