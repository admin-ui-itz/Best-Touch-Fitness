import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";

type Faq = { question: string; answer: React.ReactNode };

/**
 * First-session FAQ. Only verified answers are published — see the four
 * always-shown entries below, each of which is already true of how the
 * site/enquiry flow actually works, not a claimed policy. Location/parking,
 * weather arrangements and payment/cancellation terms are added
 * automatically once confirmed in siteConfig (address / operationalFaq);
 * until then they're simply omitted rather than guessed. See
 * docs/OWNER-CHECKLIST.md for exactly what's outstanding.
 */
export function FaqSection() {
  const faqs: Faq[] = [
    {
      question: "Can beginners attend?",
      answer:
        "Yes. Every class is coached with options for every level, and the pace is set so newcomers can follow along from the first session.",
    },
    {
      question: "How do I choose a class?",
      answer: (
        <>
          Bums, Tums & Thighs focuses on your lower body and core; Bootcamp is full-body group
          training; Senior Circuit is a steadier, supported pace for our senior members. Not sure?
          Choose &ldquo;Help me choose&rdquo; on the enquiry form and tell us a little about yourself.
        </>
      ),
    },
    {
      question: "What should I bring?",
      answer: "Water, and a mat if you have one. Turn up ready to move and the coach will handle the rest.",
    },
    {
      question: "How does joining work?",
      answer:
        "Send an enquiry telling us which class caught your eye. We reply personally with everything you need for a first session. Sending an enquiry does not book a place.",
    },
  ];

  if (siteConfig.address) {
    faqs.push({
      question: "Where is training, and is there parking?",
      answer: (
        <>
          {siteConfig.address.street}, {siteConfig.address.town}
          {siteConfig.address.mapLinkUrl ? (
            <>
              {" "}
              —{" "}
              <a href={siteConfig.address.mapLinkUrl} className="underline decoration-brand-500 decoration-2" rel="noopener">
                get directions
              </a>
              .
            </>
          ) : (
            "."
          )}
        </>
      ),
    });
  }

  if (siteConfig.operationalFaq.weatherPolicy) {
    faqs.push({ question: "What happens in bad weather?", answer: siteConfig.operationalFaq.weatherPolicy });
  }

  if (siteConfig.operationalFaq.paymentAndCancellation) {
    faqs.push({
      question: "How does payment and cancellation work?",
      answer: siteConfig.operationalFaq.paymentAndCancellation,
    });
  }

  return (
    <section className="container-x py-20 sm:py-28" aria-labelledby="faq-heading">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_1.4fr]">
        <Reveal>
          <SectionHeading
            id="faq-heading"
            eyebrow="Before you come"
            title="First-session questions."
            intro={<p>The practical things people usually ask before their first class.</p>}
          />
        </Reveal>
        <Reveal delay={100} as="div">
          <div className="divide-y divide-cream-300 border-y border-cream-300">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold text-charcoal-900 marker:content-none">
                  <span>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-2xl leading-none text-brand-600 transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="mt-3 max-w-2xl text-ink-muted">{faq.answer}</div>
              </details>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-muted">
            Something else you want to know?{" "}
            <Link href="/contact?interest=general" className="underline decoration-brand-500 decoration-2">
              Ask us directly
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
