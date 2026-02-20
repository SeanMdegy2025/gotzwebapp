"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAdminBookings, type AdminBooking } from "@/lib/auth";

function formatDate(dateString: string) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminBookingsPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "all";
  const [data, setData] = useState<{ bookings: AdminBooking[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminBookings(undefined)
      .then(setData)
      .catch(() => setData({ bookings: [] }))
      .finally(() => setLoading(false));
  }, []);

  const allBookings = data?.bookings ?? [];
  const bookings =
    status === "all"
      ? allBookings
      : status === "pending"
        ? allBookings.filter((b) => b.status === "pending")
        : allBookings.filter((b) => b.status === "completed");
  const pendingCount = allBookings.filter((b) => b.status === "pending").length;
  const completedCount = allBookings.filter((b) => b.status === "completed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading bookings...</p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-gray-900">Tour Package Bookings</h2>
            <p className="mt-1 text-sm text-gray-500">Manage and track all tour package booking requests</p>
          </div>
        </div>
      </header>
      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">

      {/* Status Filters */}
      <div className="flex gap-2">
        <Link
          href="/admin/bookings"
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
            status === "all"
              ? "border-safari-green bg-safari-green text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          All Bookings
          <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
            {allBookings.length}
          </span>
        </Link>
        <Link
          href="/admin/bookings?status=pending"
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
            status === "pending"
              ? "border-yellow-500 bg-yellow-500 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Pending
          <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
            {pendingCount}
          </span>
        </Link>
        <Link
          href="/admin/bookings?status=completed"
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
            status === "completed"
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Completed
          <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
            {completedCount}
          </span>
        </Link>
      </div>

      {/* Bookings Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Travel Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Customization
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    #{b.id}
                  </td>
                  <td className="px-6 py-4">
                    {b.tour_package ? (
                      <div className="text-sm font-medium text-gray-900">{b.tour_package.title}</div>
                    ) : (
                      <div className="text-sm text-gray-400">Package deleted</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{b.full_name}</div>
                    <div className="text-xs text-gray-500">{b.email}</div>
                    <div className="text-xs text-gray-500">{b.phone}</div>
                    {b.whatsapp && (
                      <div className="text-xs text-safari-green">WhatsApp: {b.whatsapp}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {b.travel_date ? (
                      <div>
                        <div className="font-medium">{formatDate(b.travel_date)}</div>
                        <div className="text-xs text-gray-500">
                          {b.number_of_travelers} {b.number_of_travelers === 1 ? "traveler" : "travelers"}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400">Not specified</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {b.customization_data?.locations?.length ? (
                      <div>
                        <div className="font-medium">
                          {b.customization_data.locations.length} location(s)
                        </div>
                        <div className="text-xs text-gray-500">
                          {b.customization_data.total_days || 0} total days
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">No customization</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        b.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {b.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(b.created_at)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link href={`/admin/bookings/${b.id}`} className="text-safari-green hover:text-safari-green/80">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="mt-4 text-sm font-medium text-gray-900">No bookings found</p>
                    <p className="mt-2 text-sm text-gray-500">
                      {status === "all"
                        ? "No bookings have been submitted yet."
                        : `No ${status} bookings.`}
                    </p>
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
