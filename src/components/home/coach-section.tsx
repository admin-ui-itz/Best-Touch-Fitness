import Link from "next/link";

import { PhotoFigure } from "@/components/ui/photo-figure";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { photos } from "@/config/photos";
import { siteConfig } from "@/config/site";

/**
 * Verified trainer profiles (siteConfig.trainers) are empty right now, so
 * this renders an honest placeholder rather than an invented biography or
 * the old vague "ask about the coaching team" line — see
 * docs/OWNER-CHECKLIST.md for exactly what's needed to complete it (a real
 * portrait, name and verified qualifications/experience).
 */
export function CoachSection() {
  const trainers = siteConfig.trainers;

  if (trainers.length === 0) {
    return (
      <section className="container-x py-20 sm:py-28" aria-labelledby="coach-heading">
        {/* Mirror of the nutrition panel: photo right, card overlapping from the left. */}
        <div className="grid lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-8 lg:col-start-5 lg:row-start-1">
            <PhotoFigure
              photo={photos.groupSquatUnderTent}
              aspect="aspect-[4/3] lg:aspect-[16/10]"
              sizes="(min-width: 1024px) 66vw, 100vw"
            />
          </Reveal>
          <Reveal
            delay={100}
            className="dark-surface relative z-10 -mt-16 mx-4 border-t-4 border-brand-500 bg-charcoal-950 p-8 text-white shadow-lift sm:mx-10 sm:p-10 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:mt-0"
          >
            <SectionHeading
              id="coach-heading"
              eyebrow="Meet the coach"
              title="Led in person, every session."
              intro={
                <p>
                  Every class is coached live: someone watching your form, offering an easier or
                  harder option, and keeping the group moving together. Full coach profiles are on
                  their way — for now, the best way to meet the team is at a session, or ask when you
                  enquire.
                </p>
              }
            />
            <Link href="/contact" className="link-arrow mt-8">
              Find my first class
            </Link>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="container-x py-20 sm:py-28" aria-labelledby="coach-heading">
      <SectionHeading id="coach-heading" eyebrow="Meet the coach" title="Trained by people who show up." />
      <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {trainers.map((t) => (
          <li key={t.name} className="border-t-2 border-charcoal-900 pt-5">
            <h3 className="text-2xl">{t.name}</h3>
            <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-charcoal-500">
              {t.role}
            </p>
            <p className="mt-3 text-ink-muted">{t.bio}</p>
            {t.qualifications?.length ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {t.qualifications.map((q) => (
                  <li key={q} className="rounded-lg bg-cream-200 px-3 py-1 text-xs font-semibold">
                    {q}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
