import Link from "next/link";

import { PhotoFigure } from "@/components/ui/photo-figure";
import { photoForClass, type GymClass } from "@/config/classes";

export function ClassCard({ gymClass }: { gymClass: GymClass }) {
  const comingSoon = gymClass.status === "coming-soon";
  return (
    <article className="group flex flex-col">
      <PhotoFigure
        photo={photoForClass(gymClass)}
        aspect="aspect-[4/3]"
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div className="flex flex-1 flex-col gap-3 pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-2xl">{gymClass.name}</h3>
          {comingSoon ? (
            <span className="rounded-full border border-charcoal-900/20 px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              {gymClass.comingSoonLabel ?? "Coming soon"}
            </span>
          ) : null}
        </div>
        <p className="prose-gym">{gymClass.summary}</p>
        {comingSoon ? null : (
          <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-2">
            <Link
              href={`/classes#${gymClass.slug}`}
              className="font-display text-sm font-bold uppercase tracking-wider underline decoration-lime-500 decoration-[3px] underline-offset-[6px]"
            >
              About this class
            </Link>
            <Link
              href={`/contact?interest=${gymClass.slug}`}
              className="font-display text-sm font-bold uppercase tracking-wider text-ink-muted hover:text-charcoal-900"
            >
              Enquire
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
