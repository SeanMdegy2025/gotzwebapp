"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearToken, getToken } from "@/lib/auth";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  {
    group: "Content",
    items: [
      { href: "/admin/hero-slides", label: "Hero Slides", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
      { href: "/admin/feature-cards", label: "Feature Cards", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    ],
  },
  {
    group: "About",
    items: [
      { href: "/admin/about-stats", label: "Stats", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
      { href: "/admin/about-highlights", label: "Highlights", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
    ],
  },
  {
    group: "Travel",
    items: [
      { href: "/admin/itineraries", label: "Safaris", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
      { href: "/admin/tour-packages", label: "Tour Packages", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
      { href: "/admin/destinations", label: "Destinations", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
      { href: "/admin/lodges", label: "Lodges", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    ],
  },
  {
    group: "Bookings",
    items: [
      { href: "/admin/bookings", label: "All Bookings", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    ],
  },
  {
    group: "Contact",
    items: [
      { href: "/admin/contact-channels", label: "Channels", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
      { href: "/admin/contact-messages", label: "Messages", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
      { href: "/admin/contact-quick-facts", label: "Quick Facts", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    ],
  },
  {
    group: "Settings",
    items: [
      { href: "/admin/users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!getToken()) {
      router.replace("/login");
    }
  }, [mounted, router]);

  const toggleSidebarCollapsed = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarCollapsed", String(next));
    }
  };

  const handleLogout = () => {
    clearToken();
    router.replace("/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  if (!mounted || !getToken()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex h-full items-center">
          {/* Sidebar Toggle & Logo */}
          <div className="flex h-full items-center border-r border-gray-200">
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  toggleSidebarCollapsed();
                } else {
                  setSidebarOpen((o) => !o);
                }
              }}
              className="flex h-full items-center justify-center px-4 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 lg:px-5"
              title="Toggle Sidebar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link
              href="/admin"
              className={`hidden items-center border-r border-gray-200 px-5 lg:flex ${sidebarCollapsed ? "lg:hidden" : ""}`}
            >
              <Image
                src="/images/safari/mpya.png"
                alt="Go Tanzania Safari"
                width={280}
                height={80}
                className="h-20 w-auto max-w-[280px] object-contain"
                style={{ filter: "brightness(0.3) contrast(1.2) saturate(1.1)" }}
              />
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className={`ml-4 hidden flex-1 items-center lg:flex ${sidebarCollapsed ? "max-w-md" : "max-w-lg"}`}>
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search content..."
                className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-safari-green focus:outline-none focus:ring-1 focus:ring-safari-green"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="ml-auto flex items-center gap-2 px-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 md:flex"
              title="View Website"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="hidden lg:inline">View Site</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 z-30 flex h-[calc(100vh-4rem)] flex-col overflow-hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${sidebarCollapsed ? "lg:w-16 lg:translate-x-0" : "lg:w-72 lg:translate-x-0"}`}
        >
          {/* Sidebar Header (Collapsed) */}
          {sidebarCollapsed && (
            <div className="flex h-12 items-center justify-center border-b border-gray-200">
              <Image
                src="/images/safari/mpya.png"
                alt="Go Tanzania Safari"
                width={48}
                height={24}
                className="h-8 w-auto object-contain"
                style={{ filter: "brightness(0.3) contrast(1.2) saturate(1.1)" }}
              />
            </div>
          )}

          {/* Sidebar Content */}
          <nav className="flex-1 overflow-y-auto px-2 py-4 lg:px-3">
            <div className="space-y-1">
              <Link
                href="/admin"
                className={`group relative flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  pathname === "/admin"
                    ? "bg-safari-green text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-safari-green"
                } ${sidebarCollapsed ? "justify-center px-2" : "justify-start px-3"}`}
                title={sidebarCollapsed ? "Dashboard" : undefined}
              >
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuItems[0].icon} />
                </svg>
                {!sidebarCollapsed && <span>Dashboard</span>}
                {sidebarCollapsed && pathname === "/admin" && (
                  <span className="absolute right-2 h-2 w-2 rounded-full bg-white" />
                )}
              </Link>

              {menuItems.slice(1).map((group) => (
                <div key={group.group} className="mt-6">
                  {!sidebarCollapsed && (
                    <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">{group.group}</p>
                  )}
                  <div className="mt-2 space-y-0.5">
                    {(group.items ?? []).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group relative flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-all ${
                          isActive(item.href)
                            ? "bg-safari-green text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100 hover:text-safari-green"
                        } ${sidebarCollapsed ? "justify-center px-2" : "justify-start px-3"}`}
                        title={sidebarCollapsed ? item.label : undefined}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                        {sidebarCollapsed && isActive(item.href) && (
                          <span className="absolute right-2 h-2 w-2 rounded-full bg-white" />
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-200 p-3">
            {!sidebarCollapsed ? (
              <div className="rounded-lg bg-gradient-to-br from-safari-green/10 to-green-50 p-3">
                <p className="text-xs font-semibold text-safari-green">Need Help?</p>
                <p className="mt-1 text-[10px] text-gray-600">Check documentation or contact support</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-safari-green/10 to-green-50" />
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}

        {/* Main Content Area - matches goweb structure */}
        <div
          className={`min-h-[calc(100vh-4rem)] w-full flex-1 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-72"}`}
        >
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
      </div>
    </div>
  );
}
