import Link from "next/link";

import { PhotoFigure } from "@/components/ui/photo-figure";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { photos } from "@/config/photos";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Nutrition support",
  description:
    "Meal plans and nutrition advice for members are provided through our partner nutritionist. Enquire to find out more.",
  path: "/nutrition",
});

export default function NutritionPage() {
  const partner = siteConfig.nutritionPartner;
  return (
    <>
      <section className="container-x pt-16 pb-12 sm:pt-24">
        <SectionHeading
          as="h1"
          eyebrow="Nutrition support"
          title="Good food makes training easier."
          intro={
            <p>
              Meal plans and nutrition advice are available to members through our partner
              nutritionist. {siteConfig.name} coaches the training; the nutrition guidance comes
              from a specialist.
            </p>
          }
        />
      </section>

      <section className="container-x pb-20 sm:pb-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <PhotoFigure
              photo={photos.groupSeatedChatDusk}
              aspect="aspect-[4/3]"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="shadow-soft"
            />
          </Reveal>
          <Reveal delay={100} className="prose-gym space-y-5">
            <h2 className="text-3xl text-charcoal-900 sm:text-4xl">How it works</h2>
            <p>
              Let us know you are interested when you enquire. We will introduce you to our
              nutritionist partner, who provides meal plans and advice directly.
            </p>
            <p>
              Nutrition support is separate from class membership and is provided by the
              nutritionist, not by {siteConfig.name}. Details of what is offered, and any costs,
              come from them.
            </p>
            {partner.name ? (
              <div className="rounded-2xl border border-charcoal-900/10 bg-cream-50 p-6">
                <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
                  Our nutrition partner
                </p>
                <p className="mt-2 text-xl font-bold text-charcoal-900">{partner.name}</p>
                {partner.credentials ? <p className="mt-1 text-sm">{partner.credentials}</p> : null}
                {partner.url ? (
                  <a
                    href={partner.url}
                    className="mt-3 inline-block font-semibold text-charcoal-900 underline decoration-lime-500 decoration-[3px] underline-offset-4"
                    rel="noopener"
                  >
                    Visit their website
                  </a>
                ) : null}
              </div>
            ) : null}
            <p className="text-sm">
              Nutrition guidance is general lifestyle support. If you have a medical condition,
              speak to your doctor before changing your diet.
            </p>
            <div className="pt-2">
              <Link href="/contact?interest=nutrition" className="btn btn-primary">
                Enquire about nutrition support
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
