"use client";

import { useState } from "react";

type Props = {
  itineraryId: number;
  itinerarySlug: string;
  itineraryTitle: string;
};

export function SafariBookingForm({ itineraryId, itinerarySlug, itineraryTitle }: Props) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    whatsapp: "",
    travel_date: "",
    number_of_travelers: 1,
    special_requests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itinerary_id: itineraryId,
          itinerary_slug: itinerarySlug,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          whatsapp: form.whatsapp || undefined,
          travel_date: form.travel_date || undefined,
          number_of_travelers: Number(form.number_of_travelers) || 1,
          special_requests: form.special_requests || undefined,
          customization_data: { safari: itineraryTitle },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { message?: string }).message || "Booking request failed.");
      }
      setForm({ full_name: "", email: "", phone: "", whatsapp: "", travel_date: "", number_of_travelers: 1, special_requests: "" });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-safari-sand/40 bg-white p-6 shadow-lg sm:p-8">
      <h3 className="text-xl font-heading font-bold text-charcoal">Book this safari</h3>
      <p className="text-sm text-charcoal/70">Submit your details and we&apos;ll confirm availability and next steps.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="bf-name" className="block text-sm font-medium text-gray-700">Full name *</label>
          <input
            id="bf-name"
            type="text"
            required
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="bf-email" className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            id="bf-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="bf-phone" className="block text-sm font-medium text-gray-700">Phone *</label>
          <input
            id="bf-phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="bf-whatsapp" className="block text-sm font-medium text-gray-700">WhatsApp</label>
          <input
            id="bf-whatsapp"
            type="tel"
            value={form.whatsapp}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
            placeholder="Optional"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="bf-date" className="block text-sm font-medium text-gray-700">Preferred travel date</label>
          <input
            id="bf-date"
            type="date"
            value={form.travel_date}
            onChange={(e) => setForm((f) => ({ ...f, travel_date: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="bf-travelers" className="block text-sm font-medium text-gray-700">Number of travelers *</label>
          <input
            id="bf-travelers"
            type="number"
            min={1}
            max={100}
            required
            value={form.number_of_travelers}
            onChange={(e) => setForm((f) => ({ ...f, number_of_travelers: Number(e.target.value) || 1 }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="bf-requests" className="block text-sm font-medium text-gray-700">Special requests</label>
        <textarea
          id="bf-requests"
          rows={3}
          value={form.special_requests}
          onChange={(e) => setForm((f) => ({ ...f, special_requests: e.target.value }))}
          placeholder="Dietary needs, accessibility, room preferences..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800" role="status">
          Thank you! Your booking request has been sent. We&apos;ll be in touch shortly.
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-safari-green px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-safari-green-dark focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? "Sending…" : "Request to book"}
      </button>
    </form>
  );
}
