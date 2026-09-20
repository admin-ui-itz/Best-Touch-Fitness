import Link from "next/link";

import { PhotoFigure } from "@/components/ui/photo-figure";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { photos } from "@/config/photos";

/**
 * Real training-environment photography, an asymmetric composition rather
 * than a repeated card grid. No testimonials: none have been supplied and
 * approved, so none are shown — see the brief's instruction not to
 * manufacture reviews or results.
 */
export function CommunitySection() {
  return (
    <section className="bg-cream-50 py-20 sm:py-28" aria-labelledby="community-heading">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <SectionHeading
            id="community-heading"
            eyebrow="Community"
            title="Different ages, different starting points, the same tent."
            intro={
              <p>
                Beginners training next to people who have been coming for months. Members in their
                twenties and members well past sixty. What holds it together is showing up together,
                consistently.
              </p>
            }
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <Reveal className="col-span-2 row-span-2">
            <PhotoFigure
              photo={photos.warmUpCircleLaughing}
              aspect="aspect-square"
              sizes="(min-width: 640px) 50vw, 100vw"
              className="h-full"
            />
          </Reveal>
          <Reveal delay={80}>
            <PhotoFigure photo={photos.forwardFoldStretchGroup} aspect="aspect-square" sizes="25vw" />
          </Reveal>
          <Reveal delay={140}>
            <PhotoFigure photo={photos.groupSeatedChatDusk} aspect="aspect-square" sizes="25vw" />
          </Reveal>
          <Reveal delay={200}>
            <PhotoFigure photo={photos.hamstringStretchLaughing} aspect="aspect-square" sizes="25vw" />
          </Reveal>
          <Reveal delay={260}>
            <PhotoFigure photo={photos.bandedGluteBridgeSetup} aspect="aspect-square" sizes="25vw" />
          </Reveal>
        </div>

        <Reveal delay={100} className="mt-8">
          <Link
            href="/gallery"
            className="font-display text-sm font-bold uppercase tracking-wider underline decoration-brand-500 decoration-[3px] underline-offset-[6px]"
          >
            See more real class photos
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
