"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  completeAdminBooking,
  getAdminBooking,
  updateAdminBooking,
  type AdminBooking,
} from "@/lib/auth";

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "Not specified";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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

export default function AdminBookingDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [booking, setBooking] = useState<AdminBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState("");
  const [status, setStatus] = useState<"pending" | "completed">("pending");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminBooking(id)
      .then((d) => {
        setBooking(d.booking);
        setAdminNotes(d.booking.admin_notes ?? "");
        setStatus(d.booking.status as "pending" | "completed");
      })
      .catch(() => setBooking(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setSaving(true);
    try {
      const { booking: updated } = await updateAdminBooking(id, {
        admin_notes: adminNotes,
        status,
      });
      setBooking(updated);
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!booking) return;
    if (!confirm("Mark this booking as completed?")) return;
    setSaving(true);
    try {
      const { booking: updated } = await completeAdminBooking(id);
      setBooking(updated);
      setStatus("completed");
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

  if (!booking) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Booking not found.{" "}
        <Link href="/admin/bookings" className="underline">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/bookings"
                className="text-gray-400 transition hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h2 className="text-2xl font-bold leading-tight text-gray-900">
                Booking #{booking.id}
              </h2>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  booking.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {booking.status === "completed" ? "Completed" : "Pending"}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">View and manage booking details</p>
          </div>
          <div className="flex items-center gap-3">
          {booking.status !== "completed" && (
            <button
              type="button"
              onClick={handleComplete}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark as Completed
            </button>
          )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-3 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Package Information */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Package Information</h3>
            </div>
            <div className="px-6 py-4">
              {booking.tour_package ? (
                <>
                  <p className="text-lg font-semibold text-gray-900">{booking.tour_package.title}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Travelers:</span>
                      <span className="ml-2 text-gray-600">{booking.number_of_travelers}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="italic text-gray-400">Package has been deleted</p>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Full Name
                </label>
                <p className="mt-1 text-sm font-medium text-gray-900">{booking.full_name}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    <a
                      href={`mailto:${booking.email}`}
                      className="text-safari-green hover:underline"
                    >
                      {booking.email}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Phone
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    <a
                      href={`tel:${booking.phone}`}
                      className="text-safari-green hover:underline"
                    >
                      {booking.phone}
                    </a>
                  </p>
                </div>
              </div>
              {booking.whatsapp && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    WhatsApp
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    <a
                      href={`https://wa.me/${booking.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-safari-green hover:underline"
                    >
                      {booking.whatsapp}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Travel Details */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Travel Details</h3>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Travel Date
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDate(booking.travel_date)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Number of Travelers
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {booking.number_of_travelers}{" "}
                    {booking.number_of_travelers === 1 ? "traveler" : "travelers"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Package Customization */}
          {booking.customization_data?.locations?.length ? (
            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">Package Customization</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-3">
                  {booking.customization_data.locations.map((loc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-safari-sand/20 bg-safari-sand/5 p-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{loc.location}</p>
                        <p className="text-sm text-gray-600">
                          {loc.days} {loc.days === 1 ? "day" : "days"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Total Days:</span>
                    <span className="ml-2 font-semibold text-safari-gold">
                      {booking.customization_data.total_days || 0} days
                    </span>
                  </p>
                </div>
                {booking.customization_data.special_preferences && (
                  <div className="mt-4">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Special Preferences
                    </label>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                      {booking.customization_data.special_preferences}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Special Requests */}
          {booking.special_requests && (
            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">Special Requests</h3>
              </div>
              <div className="px-6 py-4">
                <p className="whitespace-pre-wrap text-sm text-gray-900">
                  {booking.special_requests}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Management */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Booking Management</h3>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4 px-6 py-4">
              <div>
                <label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "pending" | "completed")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-2 focus:ring-safari-green/20"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label htmlFor="admin_notes" className="mb-2 block text-sm font-medium text-gray-700">
                  Admin Notes
                </label>
                <textarea
                  id="admin_notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={6}
                  placeholder="Add internal notes about this booking..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-2 focus:ring-safari-green/20"
                />
                <p className="mt-1 text-xs text-gray-500">These notes are only visible to admins</p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Booking Information */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Booking Information</h3>
            </div>
            <div className="space-y-3 px-6 py-4 text-sm">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Booking ID
                </label>
                <p className="mt-1 font-medium text-gray-900">#{booking.id}</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Submitted
                </label>
                <p className="mt-1 text-gray-900">{formatDateTime(booking.created_at)}</p>
              </div>
              {booking.completed_at && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Completed
                  </label>
                  <p className="mt-1 text-gray-900">{formatDateTime(booking.completed_at)}</p>
                </div>
              )}
              {booking.updated_at && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Last Updated
                  </label>
                  <p className="mt-1 text-gray-900">{formatDateTime(booking.updated_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
