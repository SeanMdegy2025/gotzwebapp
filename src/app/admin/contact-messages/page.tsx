"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAdminContactMessages,
  type AdminContactMessage,
} from "@/lib/auth";

function formatDate(dateString: string) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
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

export default function AdminContactMessagesPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "all";
  const [data, setData] = useState<{
    messages: AdminContactMessage[];
    stats?: { total: number; new: number; closed: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminContactMessages(status === "all" ? undefined : status)
      .then(setData)
      .catch(() => setData({ messages: [] }))
      .finally(() => setLoading(false));
  }, [status]);

  const messages = data?.messages ?? [];
  const stats = data?.stats ?? { total: 0, new: 0, closed: 0 };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-gray-900">Contact Messages</h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all messages from the &quot;Get in Touch&quot; form
            </p>
          </div>
        </div>
      </header>
      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <div className="text-sm font-medium text-gray-500">Total Messages</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <div className="text-sm font-medium text-gray-500">New</div>
          <div className="mt-2 text-2xl font-bold text-blue-600">{stats.new}</div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <div className="text-sm font-medium text-gray-500">Closed</div>
          <div className="mt-2 text-2xl font-bold text-green-600">{stats.closed}</div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2">
        <Link
          href="/admin/contact-messages"
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
            status === "all"
              ? "border-safari-green bg-safari-green text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          All Messages
          <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
            {stats.total}
          </span>
        </Link>
        <Link
          href="/admin/contact-messages?status=new"
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
            status === "new"
              ? "border-blue-500 bg-blue-500 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          New
          <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
            {stats.new}
          </span>
        </Link>
        <Link
          href="/admin/contact-messages?status=closed"
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
            status === "closed"
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Closed
          <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
            {stats.closed}
          </span>
        </Link>
      </div>

      {/* Messages Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Message Preview
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
              {messages.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    #{m.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.email}</div>
                    {m.phone && (
                      <div className="text-xs text-gray-500">{m.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md line-clamp-2 text-sm text-gray-900">
                      {m.message}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(m.status)}`}
                    >
                      {getStatusLabel(m.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(m.created_at)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/admin/contact-messages/${m.id}`}
                      className="text-safari-green hover:text-safari-green/80"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-4 text-sm font-medium text-gray-900">No messages found</p>
                    <p className="mt-2 text-sm text-gray-500">
                      {status === "all"
                        ? "No messages have been submitted yet."
                        : `No ${status} messages.`}
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
