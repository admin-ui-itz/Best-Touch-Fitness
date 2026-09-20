import Image from "next/image";
import Link from "next/link";

import logoSrc from "@/assets/brand/logo.png";
import { siteConfig } from "@/config/site";

type LogoProps = {
  className?: string;
  /** Pixel size of the circular mark (square). Header/admin: 40-44. Footer: larger. */
  markSize?: number;
  /** Show "Best Touch Fitness" as separate readable text next to the mark.
   * The supplied logo's lettering is too small to read at UI sizes, so the
   * brief calls for pairing it with a readable name rather than relying on
   * the artwork alone. */
  showWordmark?: boolean;
  wordmarkClassName?: string;
  /**
   * The supplied logo file has an opaque white square canvas around the
   * circular badge (no transparency) — see docs/ASSET-INVENTORY.md. On a
   * light header that blends in natively. On a dark surface (footer) it
   * would otherwise show as a hard-edged white box, so we round that
   * canvas's own corners into a deliberate "badge card" instead. This only
   * wraps/crops the presentation; the artwork pixels are untouched.
   */
  plate?: boolean;
};

export function Logo({
  className = "",
  markSize = 40,
  showWordmark = true,
  wordmarkClassName = "",
  plate = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label={`${siteConfig.name} home`}
    >
      <span
        className={plate ? "block shrink-0 overflow-hidden rounded-xl shadow-soft" : "block shrink-0"}
        style={{ width: markSize, height: markSize }}
      >
        <Image
          src={logoSrc}
          alt=""
          width={markSize}
          height={markSize}
          className="h-full w-full object-contain"
          priority
        />
      </span>
      {showWordmark ? (
        <span className={`font-display text-lg font-black tracking-tight text-balance ${wordmarkClassName}`}>
          {siteConfig.name}
        </span>
      ) : (
        <span className="sr-only">{siteConfig.name}</span>
      )}
    </Link>
  );
}
