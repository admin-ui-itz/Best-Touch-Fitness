import Link from "next/link";

import { siteConfig } from "@/config/site";

type InfoItem = { label: string; value: string; href?: string };

/**
 * Compact practical-information strip. Renders only confirmed details —
 * location, schedule and starting price all come from siteConfig and are
 * omitted entirely while unset, rather than showing a placeholder. Beginner
 * suitability is the one item that's always shown, because it's already a
 * true, verified fact of how every class is coached (see src/config/classes.ts),
 * not business data that needs owner confirmation.
 */
export function InfoStrip() {
  const items: InfoItem[] = [];

  if (siteConfig.address) {
    const location = [siteConfig.address.town, siteConfig.address.region].filter(Boolean).join(", ");
    items.push({
      label: "Location",
      value: location,
      href: siteConfig.address.mapLinkUrl,
    });
  }

  if (siteConfig.timetable && siteConfig.timetable.length > 0) {
    const count = siteConfig.timetable.length;
    items.push({ label: "Schedule", value: `${count} session${count === 1 ? "" : "s"} a week`, href: "/classes" });
  }

  if (siteConfig.pricing.startingPrice) {
    items.push({
      label: "Pricing",
      value: siteConfig.pricing.startingPrice,
      href: siteConfig.pricing.pricingUrl ?? undefined,
    });
  }

  items.push({ label: "New here?", value: "Every class welcomes beginners", href: "/classes" });

  return (
    <div className="border-y border-cream-300 bg-cream-50">
      <div className="container-x flex flex-wrap items-center gap-x-10 gap-y-3 py-4 text-sm">
        {items.map((item) => {
          const content = (
            <>
              <span className="font-display font-bold uppercase tracking-[0.1em] text-charcoal-500">
                {item.label}
              </span>
              <span className="ml-2 font-semibold text-charcoal-900">{item.value}</span>
            </>
          );
          return item.href ? (
            <Link key={item.label} href={item.href} className="hover:text-brand-600">
              {content}
            </Link>
          ) : (
            <span key={item.label}>{content}</span>
          );
        })}
      </div>
    </div>
  );
}
