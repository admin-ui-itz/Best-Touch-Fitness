import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { hasContactDetails, siteConfig, socialLinks, whatsappUrl } from "@/config/site";

const footerLinks = [
  { href: "/classes", label: "Classes" },
  { href: "/about", label: "About" },
  { href: "/nutrition", label: "Nutrition support" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="dark-surface mt-auto bg-charcoal-900 text-cream-100">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div className="max-w-md">
          <Logo markSize={64} plate wordmarkClassName="text-xl text-cream-100" />
          <p className="mt-4 text-ink-on-dark-muted">{siteConfig.description}</p>
          <Link href="/contact" className="btn btn-primary mt-6">
            Find my first class
          </Link>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-brand-400">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-on-dark-muted hover:text-cream-100">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-brand-400">Get in touch</h2>
          {hasContactDetails ? (
            <ul className="mt-4 space-y-2.5 text-ink-on-dark-muted">
              {siteConfig.contact.email ? (
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-cream-100">
                    {siteConfig.contact.email}
                  </a>
                </li>
              ) : null}
              {siteConfig.contact.phone ? (
                <li>
                  <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`} className="hover:text-cream-100">
                    {siteConfig.contact.phone}
                  </a>
                </li>
              ) : null}
              {whatsappUrl ? (
                <li>
                  <a href={whatsappUrl} className="hover:text-cream-100" rel="noopener">
                    WhatsApp
                  </a>
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="mt-4 text-ink-on-dark-muted">
              The quickest way to reach us is the{" "}
              <Link href="/contact" className="text-cream-100 underline decoration-brand-500 underline-offset-4">
                enquiry form
              </Link>
              .
            </p>
          )}
          {socialLinks.length ? (
            <ul className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((s) => (
                <li key={s.key}>
                  <a href={s.href} className="text-ink-on-dark-muted hover:text-cream-100" rel="noopener">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <div className="border-t border-cream-100/10">
        <div className="container-x flex flex-col gap-2 py-6 text-sm text-ink-on-dark-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.legalName ?? siteConfig.name}. All rights reserved.
          </p>
          <p>
            See real class photos in our{" "}
            <Link href="/gallery" className="underline decoration-brand-500 underline-offset-4 hover:text-cream-100">
              gallery
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
