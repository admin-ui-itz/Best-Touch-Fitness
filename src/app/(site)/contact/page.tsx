import { EnquiryForm } from "@/components/enquiry/enquiry-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { hasContactDetails, siteConfig, whatsappUrl } from "@/config/site";
import { getIntegrationStatus } from "@/lib/env";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact",
  description: `Enquire about joining ${siteConfig.name}. Choose a class or tell us what you're looking for and we will help you take the next step.`,
  path: "/contact",
});

type ContactPageProps = {
  searchParams: Promise<{ interest?: string | string[] }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const interest = Array.isArray(params.interest) ? params.interest[0] : params.interest;
  const integrations = getIntegrationStatus();
  const address = siteConfig.address;
  const hours = siteConfig.openingHours;

  return (
    <>
      <section className="container-x pt-16 pb-8 sm:pt-24">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Let&rsquo;s find your first class."
          intro={<p>Choose a class or tell us what you&rsquo;re looking for. We&rsquo;ll help you take the next step.</p>}
        />
      </section>

      <section className="container-x pb-20 sm:pb-28">
        {/* Stated once, clearly, ahead of the form. */}
        <div className="mb-10 rounded-xl border border-cream-300 bg-cream-50 px-5 py-4 text-sm font-medium text-charcoal-900 sm:max-w-2xl">
          This is an enquiry. We&rsquo;ll confirm availability and the next steps with you.
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="max-w-2xl">
            <EnquiryForm defaultInterest={interest} enabled={integrations.enquiries} />
          </div>

          <aside className="space-y-8 lg:border-l lg:border-cream-300 lg:pl-10" aria-label="First-session information">
            {address ? (
              <div>
                <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-charcoal-500">
                  Where we train
                </h2>
                <address className="mt-3 not-italic">
                  {address.street}
                  <br />
                  {address.town}
                  {address.region ? `, ${address.region}` : ""}
                  <br />
                  {address.postcode ? `${address.postcode}, ` : ""}
                  {address.country}
                </address>
                {address.mapLinkUrl ? (
                  <a
                    href={address.mapLinkUrl}
                    className="mt-2 inline-block font-semibold underline decoration-brand-500 decoration-[3px] underline-offset-4"
                    rel="noopener"
                  >
                    Get directions
                  </a>
                ) : null}
              </div>
            ) : null}

            {hasContactDetails ? (
              <div>
                <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-charcoal-500">
                  Other ways to reach us
                </h2>
                <ul className="mt-3 space-y-2 text-lg">
                  {siteConfig.contact.email ? (
                    <li>
                      <a
                        href={`mailto:${siteConfig.contact.email}`}
                        className="font-semibold underline decoration-brand-500 decoration-[3px] underline-offset-4"
                      >
                        {siteConfig.contact.email}
                      </a>
                    </li>
                  ) : null}
                  {siteConfig.contact.phone ? (
                    <li>
                      <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`} className="font-semibold">
                        {siteConfig.contact.phone}
                      </a>
                    </li>
                  ) : null}
                  {whatsappUrl ? (
                    <li>
                      <a href={whatsappUrl} className="btn btn-secondary btn-sm" rel="noopener">
                        Message on WhatsApp
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : (
              <div>
                <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-charcoal-500">
                  Reaching us
                </h2>
                <p className="mt-3 text-ink-muted">
                  The enquiry form is the best way to get in touch right now. We will reply by email.
                </p>
              </div>
            )}

            {hours ? (
              <div>
                <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-charcoal-500">
                  Opening hours
                </h2>
                <dl className="mt-3 space-y-1">
                  {hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-4">
                      <dt className="font-semibold">{h.days}</dt>
                      <dd className="tabular-nums">{h.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            <div>
              <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-charcoal-500">
                What to bring
              </h2>
              <p className="mt-3 text-ink-muted">Water, and a mat if you have one.</p>
            </div>

            <div>
              <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-charcoal-500">
                What happens after you send this
              </h2>
              <p className="mt-3 text-ink-muted">
                You&rsquo;ll get an email confirming we received your enquiry. Someone from the team then
                replies personally with availability and next steps for a first session.
              </p>
            </div>
          </aside>
        </div>

        {address?.mapEmbedUrl ? (
          <div className="mt-16 overflow-hidden rounded-xl border border-cream-300">
            <iframe
              src={address.mapEmbedUrl}
              title={`Map showing ${siteConfig.name} training location`}
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        ) : null}
      </section>
    </>
  );
}
