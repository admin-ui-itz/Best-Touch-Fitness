import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

type PageMeta = {
  title: string;
  description: string;
  /** Route path starting with "/", used for canonical + OG URLs. */
  path: string;
  /** Set false for private routes (admin). */
  index?: boolean;
};

/** Builds consistent per-route metadata with canonical and social previews. */
export function createMetadata({ title, description, path, index = true }: PageMeta): Metadata {
  const url = `${siteConfig.url}${path === "/" ? "" : path}`;
  const shouldIndex = index && isProduction;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_GB",
      images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: siteConfig.tagline }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: ["/og-default.jpg"],
    },
    robots: shouldIndex
      ? { index: true, follow: true }
      : { index: false, follow: false, noarchive: true, nocache: true },
  };
}

/**
 * Structured data using only verified facts. Address, phone, opening hours
 * and geo are added automatically once supplied in siteConfig.
 */
export function organisationJsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    image: `${siteConfig.url}/og-default.jpg`,
  };
  if (siteConfig.contact.email) data.email = siteConfig.contact.email;
  if (siteConfig.contact.phone) data.telephone = siteConfig.contact.phone;
  if (siteConfig.address) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.town,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postcode,
      addressCountry: siteConfig.address.country,
    };
  }
  const sameAs = Object.values(siteConfig.social).filter(Boolean);
  if (sameAs.length) data.sameAs = sameAs;
  return data;
}
