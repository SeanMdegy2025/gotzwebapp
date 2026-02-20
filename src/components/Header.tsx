"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#destinations", label: "Destinations" },
  { href: "/itineraries", label: "Safaris" },
  { href: "/tour-packages", label: "Packages" },
  { href: "/#lodges", label: "Lodges" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = typeof window !== "undefined" ? window.innerHeight * 0.75 : 600;
      setPastHero(currentScrollY > heroHeight);
      if (currentScrollY < 100 || currentScrollY < lastScrollY) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
      setLastScrollY(currentScrollY);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const TOP_ZONE_HEIGHT = 120;
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > 80 && e.clientY >= 0 && e.clientY <= TOP_ZONE_HEIGHT) {
        setShowNavbar(true);
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isLightBar = pastHero && lastScrollY > 80;

  const navLink = isLightBar
    ? "rounded-full border border-safari-gold/50 bg-white/80 backdrop-blur-md px-3 py-2 sm:px-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-charcoal shadow-medium transition-all duration-300 hover:bg-safari-gold hover:text-white hover:border-safari-gold hover:shadow-glow-gold hover:scale-110 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-white min-h-[44px] inline-flex items-center justify-center"
    : "rounded-full border border-safari-gold/40 bg-black/60 backdrop-blur-md px-3 py-2 sm:px-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white shadow-medium transition-all duration-300 hover:bg-safari-gold hover:text-charcoal hover:border-safari-gold hover:shadow-glow-gold hover:scale-110 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-charcoal min-h-[44px] inline-flex items-center justify-center";

  const mobileNavLink = isLightBar
    ? "block rounded-full border border-safari-gold/50 bg-white/80 px-5 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal transition-all hover:bg-safari-gold hover:text-white focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 min-h-[48px] flex items-center"
    : "block rounded-full border border-safari-gold/40 bg-black/60 px-5 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-safari-gold hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 min-h-[48px] flex items-center";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 overflow-visible pt-4 transition-all duration-300 xl:h-24 xl:pt-6 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        } ${
          lastScrollY <= 80
            ? "bg-transparent"
            : isLightBar
              ? "bg-white/90 backdrop-blur-xl shadow-md border-b border-safari-sand/30"
              : "bg-charcoal/90 backdrop-blur-md shadow-lg"
        }`}
      >
        <div className="relative mx-auto flex h-full w-full max-w-7xl items-center gap-2 sm:gap-4 px-3 sm:px-4 xl:px-8">
          <div className="w-11 flex-shrink-0 xl:hidden" aria-hidden />
          <Link
            href="/"
            className="flex-1 flex justify-center items-center xl:flex-none xl:absolute xl:left-8 xl:top-1/2 xl:-translate-y-1/2 z-10 transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-charcoal min-w-0"
          >
            <Image
              src="/images/safari/mpya.png"
              alt="Go Tanzania Safari"
              width={280}
              height={105}
              className="h-24 w-auto object-contain sm:h-32 xl:h-44 max-h-[4.5rem] sm:max-h-20 xl:max-h-[11rem]"
              priority
              sizes="(max-width: 640px) 160px, (max-width: 1280px) 224px, 280px"
              style={
                isLightBar
                  ? { filter: "brightness(0) saturate(100%) contrast(1) drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }
                  : { filter: "brightness(1.5) contrast(1.6) drop-shadow(0 8px 24px rgba(217, 154, 56, 0.6))" }
              }
            />
          </Link>
          <div className="hidden flex-1 xl:block" aria-hidden />
          <div className="relative z-10 hidden items-center gap-3 xl:flex">
            <nav className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={navLink}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/#contact"
              className={
                isLightBar
                  ? "rounded-full border-2 border-safari-gold bg-safari-gold px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal shadow-md hover:bg-safari-gold-light hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-white min-h-[44px] inline-flex items-center"
                  : "rounded-full border-2 border-safari-gold bg-safari-gold px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal shadow-glow-gold transition-all duration-300 hover:bg-safari-gold-light hover:text-charcoal hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 focus:ring-offset-charcoal min-h-[44px] inline-flex items-center"
              }
            >
              Start Planning
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className={`relative z-10 flex-shrink-0 inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 backdrop-blur-md shadow-medium transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 xl:hidden ${
              isLightBar
                ? "border-safari-gold/50 bg-white/80 text-charcoal hover:bg-safari-gold/20 hover:border-safari-gold hover:text-charcoal focus:ring-offset-white"
                : "border-safari-gold/50 bg-black/60 text-safari-gold hover:bg-safari-gold/20 hover:border-safari-gold hover:shadow-glow-gold focus:ring-offset-charcoal"
            }`}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-charcoal/95 backdrop-blur-md shadow-2xl transition-transform duration-300 xl:hidden overflow-y-auto overscroll-contain max-h-[100dvh] ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-3 sm:gap-4 p-6 sm:p-8 pt-20 sm:pt-24 pb-8">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={mobileNavLink}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/#contact"
            className="mt-4 block rounded-full border-2 border-safari-gold bg-safari-gold/30 px-6 py-3.5 text-center text-xs font-bold uppercase tracking-[0.2em] text-safari-gold transition-all hover:bg-safari-gold hover:text-charcoal min-h-[48px] flex items-center justify-center"
            onClick={() => setMobileOpen(false)}
          >
            Start Planning
          </Link>
        </div>
      </div>
    </>
  );
}
