import Link from "next/link";

import { PhotoFigure } from "@/components/ui/photo-figure";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { photos } from "@/config/photos";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About",
  description: `${siteConfig.name} is a community-first outdoor training group. Coached classes, every age and stage, one tent.`,
  path: "/about",
});

export default function AboutPage() {
  const trainers = siteConfig.trainers;
  return (
    <>
      <section className="container-x pt-16 pb-12 sm:pt-24">
        <SectionHeading
          as="h1"
          eyebrow="About"
          title="A community that trains together."
          intro={
            <p>
              {siteConfig.name} started the way most good things do: a few people, a patch of
              ground and a coach who wanted training to feel welcoming. Today the tent goes up,
              the mats go down and a mix of ages and abilities show up to move.
            </p>
          }
        />
      </section>

      <section className="container-x pb-20 sm:pb-28">
        <Reveal>
          <PhotoFigure
            photo={photos.groupSeatedChatDusk}
            aspect="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2000/924]"
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="shadow-soft"
          />
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl">What we care about</h2>
          </Reveal>
          <Reveal delay={100} className="prose-gym space-y-5">
            <p>
              <strong className="text-charcoal-900">Movement first.</strong> We coach form before
              intensity. Every exercise has an option that suits where you are today.
            </p>
            <p>
              <strong className="text-charcoal-900">Consistency over perfection.</strong> The members
              who feel the biggest difference are the ones who keep turning up, not the ones who
              go hardest once.
            </p>
            <p>
              <strong className="text-charcoal-900">Everyone belongs.</strong> Our classes are
              designed for a wide range of ages, including a dedicated Senior Circuit. If you are
              nervous about your first session, say so; you will be looked after.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          <Reveal>
            <PhotoFigure
              photo={photos.forwardFoldStretchGroup}
              aspect="aspect-[4/3]"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          </Reveal>
          <Reveal delay={100}>
            <PhotoFigure
              photo={photos.hamstringStretchLaughing}
              aspect="aspect-[4/3]"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          </Reveal>
        </div>
      </section>

      {/* Trainer information is only shown once verified in siteConfig.trainers. */}
      <section className="bg-cream-200/60 py-20 sm:py-28" aria-labelledby="coaching-heading">
        <div className="container-x">
          <SectionHeading
            id="coaching-heading"
            eyebrow="Coaching"
            title={trainers.length ? "Meet the team." : "Coached, every session."}
            intro={
              trainers.length ? undefined : (
                <p>
                  Every class is led in person by a coach who watches form, offers options and keeps
                  the group moving together. Ask about the coaching team when you enquire.
                </p>
              )
            }
          />
          {trainers.length ? (
            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {trainers.map((t) => (
                <li key={t.name} className="border-t-2 border-charcoal-900 pt-5">
                  <h3 className="text-2xl">{t.name}</h3>
                  <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
                    {t.role}
                  </p>
                  <p className="mt-3 text-ink-muted">{t.bio}</p>
                  {t.qualifications?.length ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {t.qualifications.map((q) => (
                        <li key={q} className="rounded-full bg-cream-50 px-3 py-1 text-xs font-semibold">
                          {q}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-10">
            <Link href="/contact" className="btn btn-primary">
              Enquire about joining
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
