"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminDashboard } from "@/lib/auth";

const ICONS: Record<string, string> = {
  calendar:
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  map: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
  package:
    "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getAdminDashboard>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Failed to load dashboard. Please try again.
      </div>
    );
  }

  const statCards = [
    {
      title: "Pending Bookings",
      value: data.pending_bookings,
      active: data.pending_bookings,
      color: "from-amber-500 to-amber-600",
      route: "/admin/bookings?status=pending",
      icon: "calendar",
    },
    {
      title: "New Messages",
      value: data.new_messages,
      active: data.new_messages,
      color: "from-indigo-500 to-indigo-600",
      route: "/admin/contact-messages?status=new",
      icon: "mail",
    },
    {
      title: "Total Bookings",
      value: data.total_bookings,
      active: data.total_bookings,
      color: "from-safari-green to-green-700",
      route: "/admin/bookings",
      icon: "map",
    },
    {
      title: "Tour Packages",
      value: data.tour_packages_count,
      active: data.tour_packages_count,
      color: "from-safari-gold to-yellow-600",
      route: "#",
      icon: "package",
    },
    {
      title: "Total Messages",
      value: data.total_messages,
      active: data.total_messages,
      color: "from-purple-500 to-purple-600",
      route: "/admin/contact-messages",
      icon: "mail",
    },
    {
      title: "Messages",
      value: data.total_messages,
      active: data.total_messages,
      color: "from-indigo-500 to-indigo-600",
      route: "/admin/contact-messages",
      icon: "mail",
    },
  ];

  return (
    <>
      {/* Sticky Page Header - matches goweb */}
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Here&apos;s what&apos;s happening with your website content.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Website
            </a>
          </div>
        </div>
      </header>

      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Statistics Grid - matches goweb 6-col */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statCards.map((card) => (
            <Link
              key={card.title}
              href={card.route}
              className="group relative overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-safari-green/20"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {card.title}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    <span className="font-semibold text-green-600">{card.active}</span>
                    <span className="text-gray-400"> active</span>
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${card.color}`}
                >
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICONS[card.icon]} />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-100">
                <div
                  className={`h-full w-0 bg-gradient-to-r transition-all duration-300 group-hover:w-full ${card.color}`}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Main Content Grid - Quick Actions + Recent Messages */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions - 2 cols, matches goweb */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                <p className="mt-1 text-sm text-gray-500">Access key admin areas quickly</p>
              </div>
              <div className="p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/admin/bookings?status=pending"
                    className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-safari-green hover:bg-safari-green/5 hover:shadow-sm"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100 group-hover:bg-amber-200">
                      <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">Pending Bookings</p>
                      <p className="text-xs text-gray-500">View and manage</p>
                    </div>
                    <svg className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-safari-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/admin/contact-messages?status=new"
                    className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-safari-green hover:bg-safari-green/5 hover:shadow-sm"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100 group-hover:bg-indigo-200">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">New Messages</p>
                      <p className="text-xs text-gray-500">Respond to inquiries</p>
                    </div>
                    <svg className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-safari-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/admin/bookings"
                    className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-safari-green hover:bg-safari-green/5 hover:shadow-sm"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-100 group-hover:bg-green-200">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">All Bookings</p>
                      <p className="text-xs text-gray-500">View all requests</p>
                    </div>
                    <svg className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-safari-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/admin/contact-messages"
                    className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-safari-green hover:bg-safari-green/5 hover:shadow-sm"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-100 group-hover:bg-purple-200">
                      <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">Contact Messages</p>
                      <p className="text-xs text-gray-500">View all messages</p>
                    </div>
                    <svg className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-safari-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Messages Widget - matches goweb */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
              <p className="mt-1 text-sm text-gray-500">Latest inquiries</p>
            </div>
            <div className="p-6">
              {data.recent_messages?.length ? (
                <div className="space-y-4">
                  {data.recent_messages.map((message) => (
                    <Link
                      key={message.id}
                      href={`/admin/contact-messages/${message.id}`}
                      className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 transition hover:border-gray-200 hover:bg-white"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-xs font-semibold text-white shadow-sm">
                        {(message.name || "G").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{message.name || "Guest"}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                          {message.message || message.email}
                        </p>
                        <p className="mt-1.5 text-[10px] text-gray-400">
                          {new Date(message.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="mt-3 text-sm font-medium text-gray-500">No messages yet</p>
                  <p className="mt-1 text-xs text-gray-400">New inquiries will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Management Links - matches goweb 4-card row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/bookings"
            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-safari-green hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100 group-hover:bg-amber-200">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">Bookings</p>
              <p className="text-xs text-gray-500">{data.total_bookings} total</p>
            </div>
          </Link>
          <Link
            href="/admin/contact-messages"
            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-safari-green hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100 group-hover:bg-indigo-200">
              <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">Messages</p>
              <p className="text-xs text-gray-500">{data.total_messages} total</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
