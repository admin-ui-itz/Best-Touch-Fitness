import Link from "next/link";

import { siteConfig } from "@/config/site";

/** Provisional wordmark: dumbbell glyph + name. Swap for client branding when supplied. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-display text-xl font-black tracking-tight ${className}`}
      aria-label={`${siteConfig.name} home`}
    >
      <DumbbellGlyph className="h-6 w-6 text-lime-500" />
      <span>{siteConfig.name}</span>
    </Link>
  );
}

export function DumbbellGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <rect x="2" y="11" width="4" height="10" rx="1.5" fill="currentColor" />
      <rect x="6" y="8" width="4" height="16" rx="1.5" fill="currentColor" />
      <rect x="10" y="14" width="12" height="4" rx="1" fill="currentColor" />
      <rect x="22" y="8" width="4" height="16" rx="1.5" fill="currentColor" />
      <rect x="26" y="11" width="4" height="10" rx="1.5" fill="currentColor" />
    </svg>
  );
}
