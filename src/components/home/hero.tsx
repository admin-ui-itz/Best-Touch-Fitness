import Link from "next/link";

import { HeroAccent } from "@/components/three/hero-accent";
import { PhotoFigure } from "@/components/ui/photo-figure";
import { heroPhoto } from "@/config/photos";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="dark-surface relative overflow-hidden bg-charcoal-900 text-cream-100">
      {/* soft lime wash, kept subtle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-lime-400/10 blur-3xl"
      />
      <div className="container-x relative pt-14 pb-10 sm:pt-20 lg:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="max-w-3xl">
            <p className="eyebrow text-lime-400">Outdoor group training</p>
            <h1 className="mt-5 text-[2.75rem] leading-[0.98] sm:text-6xl lg:text-7xl">
              Get stronger.
              <br />
              Move better.
              <br />
              <span className="text-lime-400">Find your community.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-on-dark-muted sm:text-xl">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/classes" className="btn btn-primary">
                Find your class
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Enquire about joining
              </Link>
            </div>
          </div>

          {/* 3D accent: desktop only; static illustration everywhere else. */}
          <HeroAccent className="mx-auto hidden aspect-square w-full max-w-[22rem] lg:block" />
        </div>

        <PhotoFigure
          photo={heroPhoto}
          priority
          aspect="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2000/924]"
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="mt-12 shadow-lift sm:mt-16"
          caption="Real classes, real members. Under the tent, every session."
        />
      </div>
    </section>
  );
}
