"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { login, setToken } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const registered = searchParams.get("registered") === "1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await login(email, password);
      setToken(token);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
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
              <h1 className="text-2xl font-heading font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-3xl">Welcome back</h1>
              <p className="mt-2 text-sm text-white/70">Sign in to your admin account · Go Tanzania Safari</p>
              <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-safari-gold to-transparent" />
            </header>

            {registered && (
              <div className="mb-6 rounded-xl border border-green-300/80 bg-green-50/95 px-4 py-3 text-center text-sm font-medium text-green-800">Account created. Sign in below.</div>
            )}
            {error && (
              <div className="mb-6 rounded-xl border border-red-300/80 bg-red-50/95 px-4 py-3 text-center text-sm font-medium text-red-800">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white/90">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-white/20 bg-white/95 px-4 py-3.5 text-charcoal placeholder:text-charcoal/50 shadow-sm transition-all duration-200 focus:border-safari-gold focus:outline-none focus:ring-2 focus:ring-safari-gold/40"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-white/90">Password</label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-white/20 bg-white/95 px-4 py-3.5 pr-12 text-charcoal placeholder:text-charcoal/50 shadow-sm transition-all duration-200 focus:border-safari-gold focus:outline-none focus:ring-2 focus:ring-safari-gold/40"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1.5 text-charcoal/60 transition hover:bg-white/20 hover:text-charcoal"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-safari-gold to-safari-gold-dark px-4 py-4 font-semibold text-charcoal shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-white/70">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-safari-gold hover:underline">Create one</Link>
              . No password set? Use any email + password (dev mode).
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-charcoal">
        <p className="text-white/70">Loading...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
