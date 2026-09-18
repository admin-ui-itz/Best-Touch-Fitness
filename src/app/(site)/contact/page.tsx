import { EnquiryForm } from "@/components/enquiry/enquiry-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { hasContactDetails, siteConfig, whatsappUrl } from "@/config/site";
import { getIntegrationStatus } from "@/lib/env";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact",
  description: `Enquire about joining ${siteConfig.name}. Tell us which class you are interested in and we will reply personally.`,
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
      <section className="container-x pt-16 pb-12 sm:pt-24">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Enquire about joining."
          intro={
            <p>
              Tell us which class caught your eye, or send a general question. We reply to every
              enquiry personally. Sending this form does not book a class.
            </p>
          }
        />
      </section>

      <section className="container-x pb-20 sm:pb-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="max-w-2xl">
            <EnquiryForm defaultInterest={interest} enabled={integrations.enquiries} />
          </div>

          <aside className="space-y-8 lg:border-l lg:border-charcoal-900/10 lg:pl-10" aria-label="Contact details">
            {hasContactDetails ? (
              <div>
                <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
                  Other ways to reach us
                </h2>
                <ul className="mt-3 space-y-2 text-lg">
                  {siteConfig.contact.email ? (
                    <li>
                      <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold underline decoration-lime-500 decoration-[3px] underline-offset-4">
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
                <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
                  Reaching us
                </h2>
                <p className="mt-3 text-ink-muted">
                  The enquiry form is the best way to get in touch right now. We will reply by email.
                </p>
              </div>
            )}

            {address ? (
              <div>
                <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
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
                  <a href={address.mapLinkUrl} className="mt-2 inline-block font-semibold underline decoration-lime-500 decoration-[3px] underline-offset-4" rel="noopener">
                    Open in maps
                  </a>
                ) : null}
              </div>
            ) : null}

            {hours ? (
              <div>
                <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
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
          </aside>
        </div>

        {address?.mapEmbedUrl ? (
          <div className="mt-16 overflow-hidden rounded-2xl border border-charcoal-900/10">
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
