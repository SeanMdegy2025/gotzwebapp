import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import "./globals.css";
import { ConditionalHeader } from "@/components/ConditionalHeader";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Go Tanzania Safari – Luxury Safaris & Expeditions",
  description: "Encounter Tanzania's wild soul – from savannah to spice isles. Tailored luxury safaris, Kilimanjaro expeditions, and Zanzibar retreats.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${outfit.variable}`}>
      <body className="font-[family-name:var(--font-body)] antialiased overflow-x-hidden min-w-0">
        <ConditionalHeader />
        {children}
      </body>
    </html>
  );
}
