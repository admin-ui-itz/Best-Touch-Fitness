import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProduction) return [];
  const now = new Date();
  const routes: Array<{ path: string; priority: number }> = [
    { path: "/", priority: 1 },
    { path: "/classes", priority: 0.9 },
    { path: "/about", priority: 0.7 },
    { path: "/nutrition", priority: 0.6 },
    { path: "/gallery", priority: 0.5 },
    { path: "/contact", priority: 0.8 },
  ];
  return routes.map((r) => ({
    url: `${siteConfig.url}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r.priority,
  }));
}
