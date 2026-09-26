"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { Logo } from "@/components/ui/logo";

export const navLinks = [
  { href: "/classes", label: "Classes" },
  { href: "/about", label: "About" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  // The menu is "open" only for the path it was opened on, so navigating
  // closes it without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (next: boolean) => setOpenAt(next ? pathname : null);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Escape closes the menu and returns focus to the toggle.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenAt(null);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Subtle border/shadow once the page has scrolled past the very top —
  // no scroll listener needed, just an IntersectionObserver on a 1px
  // sentinel rendered right before the header.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!(entry?.isIntersecting ?? true)), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
      <header
        className={`sticky top-0 z-40 bg-cream-100/95 backdrop-blur transition-shadow duration-300 supports-[backdrop-filter]:bg-cream-100/90 ${
          scrolled ? "border-b border-cream-300 shadow-soft" : "border-b border-transparent"
        }`}
      >
        {/* Full-width bar: logo left, tracked caps nav, and a full-height
            red CTA block flush to the right edge (UFC GYM's "FREE PASS" slot). */}
        <div className="flex h-16 items-stretch justify-between gap-4 pl-4 sm:h-[4.5rem] sm:pl-6 lg:pl-8">
          <div className="flex items-center">
            <Logo markSize={40} wordmarkClassName="font-condensed! font-normal! tracking-wide! text-[1.65rem] leading-none sm:text-[1.85rem]" />
          </div>

          <nav aria-label="Primary" className="hidden items-stretch lg:flex">
            <div className="flex items-center gap-1 pr-4 lg:gap-2 lg:pr-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`relative px-2.5 py-2 font-display text-[13px] font-extrabold uppercase tracking-[0.16em] transition-colors hover:text-brand-600 lg:px-3 ${
                    isActive(link.href)
                      ? "text-charcoal-900 after:absolute after:inset-x-2.5 after:-bottom-0.5 after:h-[3px] after:bg-brand-500 lg:after:inset-x-3"
                      : "text-charcoal-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link
              href="/contact"
              className="flex items-center bg-brand-600 px-6 font-display text-[13px] font-extrabold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-700 lg:px-9"
            >
              Find my first class
            </Link>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex w-16 items-center justify-center bg-charcoal-900 text-white sm:w-[4.5rem] lg:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        <div id={panelId} hidden={!open} className="border-t border-cream-300 bg-cream-100 lg:hidden">
          <nav aria-label="Primary mobile" className="container-x flex flex-col py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-3 text-base font-semibold ${
                  isActive(link.href) ? "bg-charcoal-900/5 text-charcoal-900" : "text-ink-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="btn btn-primary mt-3">
              Find my first class
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
