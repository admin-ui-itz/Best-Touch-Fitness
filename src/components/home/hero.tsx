import Image from "next/image";
import Link from "next/link";

import { photos } from "@/config/photos";

/**
 * Full-bleed photographic hero. Uses a real class photo (not the stock
 * reference set) so the very first thing a visitor sees is genuine — the
 * cinematic scroll section further down carries the polished footage.
 *
 * Typography follows the UFC GYM playbook: oversized, stacked, condensed
 * caps with one brand-red accent, set low-left over a directional gradient
 * so the photo stays the focus on the right.
 */
export function Hero() {
  const photo = photos.gobletSquatHoldInstructor;
  return (
    <section className="dark-surface relative flex min-h-[36rem] items-end overflow-hidden bg-charcoal-950 sm:min-h-[calc(100svh-4.5rem)]">
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
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgb(10_10_10/0.85)_0%,rgb(10_10_10/0.45)_45%,rgb(10_10_10/0.05)_80%),linear-gradient(0deg,rgb(10_10_10/0.9)_0%,transparent_50%)]"
      />
      {/* Thin brand-red rule down the left edge, as a quiet frame device. */}
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-brand-500 sm:w-2" />

      <div className="container-x relative pt-24 pb-12 sm:pb-16 lg:pb-20">
        <p className="eyebrow text-brand-400">Outdoor group training</p>
        <h1 className="mt-5 text-[clamp(4.75rem,14vw,12.5rem)] leading-[0.82] text-white">
          Get stronger.
          <br />
          <span className="slash">Together.</span>
        </h1>
        <div className="mt-8 flex flex-col gap-8 sm:mt-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-md text-lg text-ink-on-dark-muted sm:text-xl">
            Outdoor group training, supportive coaching and a community that helps you keep showing
            up.
          </p>
          <div className="flex flex-wrap gap-3">
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
