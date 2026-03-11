"use client";

import { useState } from "react";

type Props = { images: string[]; title: string };

export function SafariGallery({ images, title }: Props) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-charcoal">
        <img
          src={images[index]}
          alt={`${title} – image ${index + 1}`}
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-safari-gold focus:ring-offset-2 ${
                i === index ? "border-safari-gold ring-2 ring-safari-gold/30" : "border-gray-200 hover:border-safari-green/50"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
