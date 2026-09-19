import type { NextConfig } from "next";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

// Staging and preview deployments must never be indexed. The robots.txt
// route handles crawlers that honour it; this header covers the rest.
const stagingHeaders = isProduction
  ? []
  : [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }];

const nextConfig: NextConfig = {
  // No "output: standalone" here: that mode is for self-hosting via
  // `node server.js` (e.g. the Docker/Coolify setup this project no longer
  // uses). Netlify's official Next.js runtime (@netlify/plugin-nextjs)
  // builds straight from the default `.next` output and packages routes as
  // Netlify Functions/Edge Functions itself.
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...securityHeaders, ...stagingHeaders],
      },
    ];
  },
};

export default nextConfig;
