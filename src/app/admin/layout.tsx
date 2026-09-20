import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { signOut } from "@/lib/auth/actions";
import { getAdminSession } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false, noarchive: true, nocache: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  return (
    <>
      <header className="border-b border-cream-300 bg-cream-50">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="rounded-full bg-charcoal-900 px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider text-brand-400">
              Admin
            </span>
          </div>
          {session ? (
            <div className="flex items-center gap-4 text-sm">
              <Link href="/admin" className="font-semibold">
                Enquiries
              </Link>
              <span className="hidden text-ink-muted sm:inline">{session.email}</span>
              <form action={signOut}>
                <button type="submit" className="btn btn-ghost btn-sm">
                  Sign out
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </header>
      <main id="main" className="container-x flex-1 py-10">
        {children}
      </main>
    </>
  );
}
