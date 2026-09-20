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
        <div className="container-x flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          <Logo markSize={40} wordmarkClassName="text-lg sm:text-xl" />

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors hover:bg-charcoal-900/5 ${
                  isActive(link.href)
                    ? "text-charcoal-900 underline decoration-brand-500 decoration-[3px] underline-offset-8"
                    : "text-ink-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="btn btn-primary btn-sm ml-3">
              Find my first class
            </Link>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg md:hidden"
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

        <div id={panelId} hidden={!open} className="border-t border-cream-300 bg-cream-100 md:hidden">
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
