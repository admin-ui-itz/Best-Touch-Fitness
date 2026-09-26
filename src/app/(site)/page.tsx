import Link from "next/link";

import { CoachSection } from "@/components/home/coach-section";
import { CommunitySection } from "@/components/home/community-section";
import { FaqSection } from "@/components/home/faq-section";
import { Hero } from "@/components/home/hero";
import { InfoStrip } from "@/components/home/info-strip";
import { ScrollStory } from "@/components/home/scroll-story";
import { ClassCard } from "@/components/ui/class-card";
import { PhotoFigure } from "@/components/ui/photo-figure";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Timetable } from "@/components/ui/timetable";
import { comingSoonClasses, publishedClasses } from "@/config/classes";
import { photos } from "@/config/photos";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: siteConfig.tagline,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <InfoStrip />

      {/* Class selection */}
      <section className="py-20 sm:py-28" aria-labelledby="classes-heading">
        <div className="container-x">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              id="classes-heading"
              eyebrow="Current classes"
              title="Find your class."
              intro={<p>Three ways to train with us right now. Every class welcomes beginners.</p>}
            />
            <Link href="/classes" className="btn btn-secondary shrink-0">
              All class details
            </Link>
          </Reveal>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {publishedClasses.map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <ClassCard gymClass={c} />
              </Reveal>
            ))}
          </div>
          {comingSoonClasses.length ? (
            <p className="mt-10 text-sm text-ink-muted">
              Also on the way: {comingSoonClasses.map((c) => c.name).join(" and ")}. Details to follow.
            </p>
          ) : null}
          <Timetable className="mt-16" />

          <Reveal
            delay={200}
            className="mt-14 flex flex-col items-start gap-4 border-l-4 border-brand-500 bg-charcoal-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8 dark-surface"
          >
            <div>
              <p className="display-condensed text-3xl">Not sure which class fits?</p>
              <p className="mt-2 text-ink-on-dark-muted">Tell us a little about yourself and we will point you to a good first session.</p>
            </div>
            <Link href="/contact?interest=help-me-choose" className="btn btn-secondary shrink-0">
              Help me choose
            </Link>
          </Reveal>
        </div>
      </section>

      <ScrollStory />

      <CoachSection />
      <CommunitySection />

      {/* Nutrition: UFC GYM-style overlapping panel — wide photo, card cutting across it. */}
      <section className="bg-cream-200/60 py-20 sm:py-28" aria-labelledby="nutrition-heading">
        <div className="container-x grid lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-8 lg:col-start-1 lg:row-start-1">
            <PhotoFigure
              photo={photos.groupSeatedChatDusk}
              aspect="aspect-[4/3] lg:aspect-[16/10]"
              sizes="(min-width: 1024px) 66vw, 100vw"
            />
          </Reveal>
          <Reveal
            delay={120}
            className="relative z-10 -mt-16 mx-4 border-t-4 border-brand-500 bg-cream-50 p-8 shadow-lift sm:mx-10 sm:p-10 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mx-0 lg:mt-0"
          >
            <SectionHeading
              id="nutrition-heading"
              eyebrow="Nutrition support"
              title="Meal plans and advice from a partner nutritionist."
              intro={
                <p>
                  Training is one half of the picture. Through our nutritionist partner, members can
                  ask about meal plans and nutrition advice that fits real life. This sits alongside
                  class membership, not inside it.
                </p>
              }
            />
            <Link href="/nutrition" className="link-arrow mt-8">
              Find out more
            </Link>
          </Reveal>
        </div>
      </section>

      <FaqSection />

      {/* Final CTA: full-width brand-red band (UFC GYM's "Your closest club" slot). */}
      <section
        className="dark-surface relative overflow-hidden bg-brand-600 py-20 text-white sm:py-24"
        aria-labelledby="cta-heading"
      >
        <span
          aria-hidden="true"
          className="display-condensed pointer-events-none absolute -right-6 -bottom-10 text-[clamp(8rem,22vw,20rem)] leading-none text-white/[0.07] select-none"
        >
          Together
        </span>
        <div className="container-x relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 id="cta-heading" className="text-5xl sm:text-7xl">
              Your first step starts here.
            </h2>
            <p className="mt-5 text-lg text-white/85">
              Tell us what you&rsquo;re looking for, and we&rsquo;ll help you find a suitable class.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn bg-charcoal-950 text-white hover:bg-white hover:text-charcoal-950">
              Find my first class
            </Link>
            <Link href="/classes" className="btn btn-secondary">
              Explore classes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
