import type { Metadata, Viewport } from "next";
import { Archivo, Bebas_Neue, Manrope } from "next/font/google";

import { siteConfig } from "@/config/site";

import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

// Condensed display face for headlines (the sports-brand voice).
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  robots: isProduction
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true, nocache: true },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_GB",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: siteConfig.tagline }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below adds data-js before hydration.
    <html lang="en" className={`${archivo.variable} ${bebas.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col">
        {/* Marks JS availability so entrance transitions never hide content without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js='1'" }} />
        {children}
      </body>
    </html>
  );
}
