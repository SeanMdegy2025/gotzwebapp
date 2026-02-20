"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  deleteAdminHeroSlide,
  getAdminHeroSlides,
  type HeroSlide,
} from "@/lib/auth";

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    getAdminHeroSlides()
      .then((r) => setSlides(r.hero_slides))
      .catch(() => setSlides([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this hero slide?")) return;
    setDeleting(id);
    deleteAdminHeroSlide(id)
      .then(() => load())
      .catch((e) => alert(e?.message || "Failed to delete"))
      .finally(() => setDeleting(null));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading hero slides...</p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hero Slides</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage the carousel slides on your homepage
            </p>
          </div>
          <Link
            href="/admin/hero-slides/create"
            className="inline-flex items-center gap-2 rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Slide
          </Link>
        </div>
      </header>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Label
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {slides.map((slide) => (
                  <tr key={slide.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-16 w-24 overflow-hidden rounded-lg bg-gray-100">
                        {slide.image_base64 ? (
                          <img
                            src={slide.image_base64}
                            alt={slide.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {slide.label || slide.subtitle || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{slide.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {slide.description || slide.subtitle || ""}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {slide.position}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          slide.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {slide.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/admin/hero-slides/${slide.id}/edit`}
                        className="text-safari-green hover:text-safari-green/80"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(slide.id)}
                        disabled={deleting === slide.id}
                        className="ml-4 text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleting === slide.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
                {slides.length === 0 && (
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-4 text-sm font-medium text-gray-900">No hero slides</p>
                      <p className="mt-2 text-sm text-gray-500">
                        Get started by creating a new hero slide.
                      </p>
                      <div className="mt-6">
                        <Link
                          href="/admin/hero-slides/create"
                          className="inline-flex items-center gap-2 rounded-lg bg-safari-green px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-safari-green/90"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Your First Slide
                        </Link>
                      </div>
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
