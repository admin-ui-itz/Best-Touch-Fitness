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
            className="mt-14 flex flex-col items-start gap-4 rounded-xl border border-cream-300 bg-cream-50 p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display text-lg font-bold text-charcoal-900">Not sure which class fits?</p>
              <p className="mt-1 text-ink-muted">Tell us a little about yourself and we will point you to a good first session.</p>
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

      {/* Nutrition */}
      <section className="bg-cream-200/60 py-20 sm:py-28" aria-labelledby="nutrition-heading">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
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
            <Link href="/nutrition" className="btn btn-primary mt-8">
              About nutrition support
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <PhotoFigure
              photo={photos.groupSeatedChatDusk}
              aspect="aspect-[4/3] lg:aspect-[5/4]"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="shadow-soft"
            />
          </Reveal>
        </div>
      </section>

      <FaqSection />

      {/* Final CTA */}
      <section className="dark-surface bg-charcoal-900 py-20 text-white sm:py-28" aria-labelledby="cta-heading">
        <div className="container-x flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 id="cta-heading" className="text-4xl sm:text-5xl">
              Your first step starts here.
            </h2>
            <p className="mt-4 text-lg text-ink-on-dark-muted">
              Tell us what you&rsquo;re looking for, and we&rsquo;ll help you find a suitable class.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">
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
