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
  title: "Aura | Spatial 3D Luxury Fashion",
  description: "Experience the future of online shopping with spatial UI and 3D luxury fashion.",
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
