"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Compact enquiry action for small screens. It is a small floating pill
 * (not a full-width bar) so it never covers a meaningful amount of content,
 * and it is hidden on the contact page where the form already is.
 */
export function MobileEnquiryBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/contact") || pathname.startsWith("/admin")) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-end px-4 pb-4 safe-bottom md:hidden">
      <Link
        href="/contact"
        className="btn btn-primary pointer-events-auto shadow-lift"
        aria-label="Find my first class"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 5h16v11H8l-4 4V5z" />
        </svg>
        Find my class
      </Link>
    </div>
  );
}
