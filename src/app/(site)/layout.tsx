import { MobileEnquiryBar } from "@/components/layout/mobile-enquiry-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBanner } from "@/components/layout/status-banner";
import { organisationJsonLd } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-5 focus:py-3 focus:font-bold focus:text-white"
      >
        Skip to content
      </a>
      <StatusBanner />
      <SiteHeader />
      <main id="main" className="flex-1 pb-24 md:pb-0" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <MobileEnquiryBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd()) }}
      />
    </>
  );
}
