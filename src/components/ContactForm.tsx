"use client";

import { useState, useEffect } from "react";
import { submitContact } from "@/lib/api";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", travelers: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!error) return;
    setShake(true);
    const t = setTimeout(() => setShake(false), 400);
    return () => clearTimeout(t);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
    try {
      await submitContact({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        message: form.travelers ? `Travelers: ${form.travelers}\n\n${form.message}` : form.message,
      });
      setForm({ name: "", email: "", phone: "", travelers: "", message: "" });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 sm:space-y-6 ${shake ? "animate-shake" : ""}`}>
      <div className="mb-6 pb-6 border-b border-white/10">
        <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">Get in Touch</h3>
        <p className="text-sm sm:text-base text-white/70">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-safari-gold" htmlFor="fullname">Full Name</label>
          <input id="fullname" type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your full name" className="w-full rounded-xl sm:rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm px-4 sm:px-5 py-3.5 min-h-[48px] text-base text-white placeholder:text-white/50 focus:border-safari-gold focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-safari-gold/50" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-safari-gold" htmlFor="email">Email Address</label>
          <input id="email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="w-full rounded-xl sm:rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm px-4 sm:px-5 py-3.5 min-h-[48px] text-base text-white placeholder:text-white/50 focus:border-safari-gold focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-safari-gold/50" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-safari-gold" htmlFor="phone">Phone / WhatsApp</label>
          <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+255..." className="w-full rounded-xl sm:rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm px-4 sm:px-5 py-3.5 min-h-[48px] text-base text-white placeholder:text-white/50 focus:border-safari-gold focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-safari-gold/50" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-safari-gold" htmlFor="travelers">Travellers</label>
          <input id="travelers" type="text" value={form.travelers} onChange={(e) => setForm((f) => ({ ...f, travelers: e.target.value }))} placeholder="2 adults, 2 kids..." className="w-full rounded-xl sm:rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm px-4 sm:px-5 py-3.5 min-h-[48px] text-base text-white placeholder:text-white/50 focus:border-safari-gold focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-safari-gold/50" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-safari-gold" htmlFor="message">Tell Us More</label>
        <textarea id="message" rows={5} required value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Preferred travel dates, bucket-list sightings, special celebrations..." className="w-full rounded-xl sm:rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm px-4 sm:px-5 py-3.5 min-h-[120px] text-base text-white placeholder:text-white/50 focus:border-safari-gold focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-safari-gold/50 resize-none" />
      </div>
      {error && <p className="text-sm text-red-300 flex items-center gap-2" role="alert"><span aria-hidden>⚠</span>{error}</p>}
      {success && (
        <div className="flex items-center gap-3 rounded-xl bg-safari-green/20 border border-safari-green/40 px-4 py-3 text-sm text-green-200" role="status">
          <svg className="h-6 w-6 flex-none text-safari-gold animate-checkmark" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" style={{ strokeDasharray: 24 }} />
          </svg>
          <span>Thank you! Your message has been sent. We&apos;ll get back to you within 24 hours.</span>
        </div>
      )}
      <button type="submit" disabled={isSubmitting} className="group relative mt-6 sm:mt-8 w-full overflow-hidden rounded-full bg-gradient-to-r from-safari-gold via-safari-gold/95 to-orange-500 px-6 py-4 sm:px-8 min-h-[48px] text-sm font-bold text-charcoal shadow-lg transition-all duration-300 hover:from-safari-gold-light hover:via-safari-gold hover:to-orange-400 hover:shadow-2xl hover:shadow-safari-gold/40 hover:scale-[1.02] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-charcoal">
        <span className="relative z-10 flex items-center justify-center">
          {isSubmitting ? "Sending..." : "Submit Inquiry"}
          {!isSubmitting && !success && <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>}
        </span>
      </button>
    </form>
  );
}
