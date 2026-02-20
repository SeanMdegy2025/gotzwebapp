"use client";

import { useEffect, useState } from "react";
import { createAdminUser, getAdminUsers, type AdminUser } from "@/lib/auth";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "admin" });

  const load = () => {
    setLoading(true);
    getAdminUsers()
      .then((r) => setUsers(r.users))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    createAdminUser({
      email: form.email.trim(),
      password: form.password,
      name: form.name.trim() || undefined,
      role: form.role,
    })
      .then(() => {
        setForm({ email: "", password: "", name: "", role: "admin" });
        setShowForm(false);
        load();
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to create user"))
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="mt-1 text-sm text-gray-500">Manage admin accounts</p>
          </div>
          <button
            type="button"
            onClick={() => { setShowForm(!showForm); setError(null); }}
            className="inline-flex items-center gap-2 rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {showForm ? "Cancel" : "Add user"}
          </button>
        </div>
      </header>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {showForm && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Add new user</h2>
            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="user-email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="user-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label htmlFor="user-password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative mt-1">
                  <input
                    id="user-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                    placeholder="Min 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="user-name" className="block text-sm font-medium text-gray-700">Name (optional)</label>
                <input
                  id="user-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
                  placeholder="Display name"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90 disabled:opacity-50"
                >
                  {submitting ? "Creating…" : "Create user"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.name || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">{user.role}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <p className="text-sm font-medium text-gray-900">No users yet</p>
                      <p className="mt-2 text-sm text-gray-500">Add a user above or run <code className="rounded bg-gray-100 px-1 py-0.5">npm run db:seed-users</code> to seed an admin.</p>
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
