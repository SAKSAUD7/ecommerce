import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import QueryProvider from "@/components/providers/QueryProvider";

// Luxury typography setup
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DE'NOURA | Haute Modest Fashion & Luxury Spatial Experience",
  description: "DE'NOURA — Discover the finest in luxury modest fashion, bespoke couture, and spatial digital shopping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans transition-colors duration-500">
        <QueryProvider>
          <SmoothScrollProvider>
            <main className="flex-grow flex flex-col z-10 relative">
              {children}
            </main>
          </SmoothScrollProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
