"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register as registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerUser(email, password, name || undefined);
      router.push("/login?registered=1");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0">
        <Image
          src="/images/safari/hero-1.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/85 via-charcoal/80 to-charcoal/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,154,56,0.12),transparent_60%)]" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <Link href="/" className="flex items-center justify-center opacity-0 transition hover:opacity-90 animate-fade-in" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
          <Image src="/images/safari/mpya.png" alt="Go Tanzania Safari" width={240} height={120} className="h-48 w-auto drop-shadow-2xl sm:h-48" style={{ filter: "brightness(1.1) contrast(1.1)" }} />
        </Link>
        <p className="mt-4 text-center text-sm text-white/60 opacity-0 animate-fade-in" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          Curating unforgettable journeys across Tanzania
        </p>

        <div className="relative mt-8 w-full overflow-hidden rounded-2xl border border-white/20 shadow-2xl shadow-black/40 opacity-0 transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(217,154,56,0.3),0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_30px_rgba(217,154,56,0.08)] animate-login-card" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <div className="absolute inset-0">
            <Image src="/images/safari/lodge-1.jpg" alt="" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-charcoal/75 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/70 to-charcoal/60" />
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-safari-gold/60 to-transparent" />
          </div>

          <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10">
            <header className="mb-8 text-center">
              <h1 className="text-2xl font-heading font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-3xl">Create account</h1>
              <p className="mt-2 text-sm text-white/70">Sign up for an admin account</p>
              <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-safari-gold to-transparent" />
            </header>

            {error && (
              <div className="mb-6 rounded-xl border border-red-300/80 bg-red-50/95 px-4 py-3 text-center text-sm font-medium text-red-800">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-white/90">Name (optional)</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-white/20 bg-white/95 px-4 py-3.5 text-charcoal placeholder:text-charcoal/50 shadow-sm transition-all duration-200 focus:border-safari-gold focus:outline-none focus:ring-2 focus:ring-safari-gold/40"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white/90">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-white/20 bg-white/95 px-4 py-3.5 text-charcoal placeholder:text-charcoal/50 shadow-sm transition-all duration-200 focus:border-safari-gold focus:outline-none focus:ring-2 focus:ring-safari-gold/40"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-white/90">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-white/20 bg-white/95 px-4 py-3.5 text-charcoal placeholder:text-charcoal/50 shadow-sm transition-all duration-200 focus:border-safari-gold focus:outline-none focus:ring-2 focus:ring-safari-gold/40"
                  placeholder="At least 8 characters"
                />
              </div>
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-safari-gold to-safari-gold-dark px-4 py-4 font-semibold text-charcoal shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-white/70">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-safari-gold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-white/40 opacity-0 animate-fade-in" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
          © {new Date().getFullYear()} Go Tanzania Safari
        </p>
      </div>
    </div>
  );
}
