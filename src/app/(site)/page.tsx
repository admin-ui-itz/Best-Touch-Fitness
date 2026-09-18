import Link from "next/link";

import { Hero } from "@/components/home/hero";
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

const values = [
  {
    title: "Movement",
    body: "Sessions built around moving well, with options for every level in the room.",
  },
  {
    title: "Consistency",
    body: "Showing up is the hard part. A group that expects you makes it easier.",
  },
  {
    title: "Community",
    body: "Different ages, different starting points, the same tent. You are never training alone.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Introduction */}
      <section className="container-x py-20 sm:py-28" aria-labelledby="intro-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              id="intro-heading"
              eyebrow="Welcome"
              title="Training that meets you where you are."
              intro={
                <p>
                  {siteConfig.name} is outdoor group training led by a coach who keeps an eye on
                  everyone. No mirrors, no pressure, just steady work, good people and the kind of
                  confidence that comes from turning up week after week.
                </p>
              }
            />
            <ul className="mt-10 grid gap-6 sm:grid-cols-3">
              {values.map((v, i) => (
                <li key={v.title} className="border-t-2 border-charcoal-900 pt-4">
                  <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
                    0{i + 1}
                  </p>
                  <h3 className="mt-2 text-xl">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{v.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <PhotoFigure
              photo={photos.warmUpCircleLaughing}
              aspect="aspect-[4/3] lg:aspect-[5/4]"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="shadow-soft"
            />
          </Reveal>
        </div>
      </section>

      {/* Classes */}
      <section className="bg-cream-200/60 py-20 sm:py-28" aria-labelledby="classes-heading">
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
              <Reveal key={c.slug} delay={i * 90}>
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
        </div>
      </section>

      {/* Photo band */}
      <section className="container-x py-20 sm:py-28" aria-label="Class photography">
        <Reveal>
          <PhotoFigure
            photo={photos.wideMatWorkDumbbellPress}
            aspect="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2000/924]"
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="shadow-soft"
          />
        </Reveal>
        <Reveal delay={100} className="mt-10 grid gap-8 md:grid-cols-[1fr_1fr]">
          <h2 className="text-3xl sm:text-4xl">Every session is coached. Every level is welcome.</h2>
          <p className="prose-gym md:pt-2">
            Whether you have never held a dumbbell or you are coming back after a break, the coach
            sets the pace and offers options for every movement. Bring water, a mat if you have one,
            and a willingness to have a go.
          </p>
        </Reveal>
      </section>

      {/* Nutrition */}
      <section className="dark-surface bg-charcoal-900 py-20 text-cream-100 sm:py-28" aria-labelledby="nutrition-heading">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              id="nutrition-heading"
              eyebrow="Nutrition support"
              title="Meal plans and advice from a partner nutritionist."
              intro={
                <p>
                  Training is one half of the picture. Through our nutritionist partner, members can
                  ask about meal plans and nutrition advice that fits real life.
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
            />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20 sm:py-28" aria-labelledby="cta-heading">
        <Reveal className="rounded-2xl bg-lime-400 px-6 py-12 text-charcoal-900 sm:px-12 sm:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 id="cta-heading" className="text-3xl sm:text-4xl lg:text-5xl">
                Ready to find your class?
              </h2>
              <p className="mt-4 text-lg font-medium">
                Tell us a little about yourself and which class caught your eye. We will get back to
                you with everything you need for a first session.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn bg-charcoal-900 text-cream-100 hover:bg-charcoal-800">
                Enquire about joining
              </Link>
              <Link href="/classes" className="btn btn-secondary">
                Find your class
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
