import Image from "next/image";
import Link from "next/link";

import { photos } from "@/config/photos";

/**
 * Full-bleed photographic hero. Uses a real class photo (not the stock
 * reference set) so the very first thing a visitor sees is genuine — the
 * cinematic scroll section further down carries the polished aspirational
 * footage instead. A restrained dark gradient keeps the headline readable
 * without hiding faces or shifting skin tones.
 */
export function Hero() {
  const photo = photos.gobletSquatHoldInstructor;
  return (
    <section className="dark-surface relative flex min-h-[34rem] items-end overflow-hidden bg-charcoal-900 sm:min-h-[42rem] lg:min-h-[46rem]">
      <Image
        src={photo.src}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        placeholder="blur"
        quality={80}
        className="object-cover"
        style={{ objectPosition: photo.focus }}
      />
      {/* Restrained dark gradient: strongest low (behind the headline/CTAs),
          fading out toward the top so the photo itself stays the focus. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/35 to-charcoal-950/10"
      />

      <div className="container-x relative py-10 sm:py-14 lg:py-16">
        <div className="max-w-2xl">
          <p className="eyebrow text-brand-400">Outdoor group training</p>
          <h1 className="mt-4 text-4xl leading-[1.03] text-white sm:text-6xl lg:text-7xl">
            Get stronger. Together.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-on-dark-muted sm:text-xl">
            Outdoor group training, supportive coaching and a community that helps you keep showing
            up.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">
              Find my first class
            </Link>
            <Link href="/classes" className="btn btn-secondary">
              Explore classes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
