import Link from "next/link";

import { PhotoFigure } from "@/components/ui/photo-figure";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Timetable } from "@/components/ui/timetable";
import { comingSoonClasses, photoForClass, publishedClasses } from "@/config/classes";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Classes",
  description:
    "Bums, Tums & Thighs, Bootcamp and Senior Circuit: coached outdoor group classes with options for every level. Enquire about the class that suits you.",
  path: "/classes",
});

export default function ClassesPage() {
  return (
    <>
      <section className="container-x pt-16 pb-12 sm:pt-24">
        <SectionHeading
          as="h1"
          eyebrow="Classes"
          title="Find your class."
          intro={
            <p>
              Every class is coached in a group, outdoors, with options offered for each movement.
              Not sure which is right for you? Enquire and tell us a little about yourself; we will
              point you to a good first session.
            </p>
          }
        />
      </section>

      <section className="container-x pb-20 sm:pb-28" aria-label="Class details">
        <div className="flex flex-col gap-16 sm:gap-24">
          {publishedClasses.map((c, i) => (
            <Reveal
              key={c.slug}
              as="article"
              id={c.slug}
              className="grid scroll-mt-24 gap-8 lg:grid-cols-2 lg:items-center"
            >
              <PhotoFigure
                photo={photoForClass(c)}
                aspect="aspect-[4/3]"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={`shadow-soft ${i % 2 === 1 ? "lg:order-2" : ""}`}
              />
              <div className="max-w-xl">
                <p className="eyebrow">Class {String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-4 text-3xl sm:text-4xl">{c.name}</h2>
                <p className="prose-gym mt-4">{c.description}</p>
                <h3 className="mt-6 font-display text-xs font-bold uppercase tracking-[0.18em]">
                  Who it suits
                </h3>
                <p className="mt-2 text-ink-muted">{c.suitedTo}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/contact?interest=${c.slug}`} className="btn btn-primary">
                    Enquire about {c.name}
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {comingSoonClasses.length ? (
          <div className="mt-20 border-t-2 border-charcoal-900 pt-8">
            <h2 className="text-2xl">On the way</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {comingSoonClasses.map((c) => (
                <li
                  key={c.slug}
                  className="rounded-full border border-charcoal-900/20 px-4 py-2 text-sm font-semibold"
                >
                  {c.name}{" "}
                  <span className="text-ink-muted">({c.comingSoonLabel ?? "Coming soon"})</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-xl text-sm text-ink-muted">
              Dates and details will be shared once confirmed. These classes cannot be enquired about
              yet.
            </p>
          </div>
        ) : null}

        <Timetable className="mt-20" />
      </section>

      <section className="bg-cream-200/60 py-16 sm:py-20">
        <div className="container-x flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl">Not sure where to start?</h2>
            <p className="mt-2 text-ink-muted">Send a general enquiry and we will help you choose.</p>
          </div>
          <Link href="/contact?interest=general" className="btn btn-secondary shrink-0">
            Enquire about joining
          </Link>
        </div>
      </section>
    </>
  );
}
