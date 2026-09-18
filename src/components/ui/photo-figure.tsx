import Image from "next/image";
import type { ReactNode } from "react";

import type { Photo } from "@/config/photos";

type PhotoFigureProps = {
  photo: Photo;
  /** Tailwind aspect classes, e.g. "aspect-[4/3] md:aspect-[2000/924]". Reserves layout space. */
  aspect: string;
  /** Responsive sizes hint for next/image. */
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  caption?: ReactNode;
  /** Override the default focus point. */
  focus?: string;
};

/**
 * Photo in a fixed-aspect frame. Uses next/image fill + intrinsic blur
 * placeholder so nothing shifts while the image loads.
 */
export function PhotoFigure({
  photo,
  aspect,
  sizes,
  priority = false,
  className = "",
  imgClassName = "",
  caption,
  focus,
}: PhotoFigureProps) {
  return (
    <figure className={`photo-frame ${aspect} ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        placeholder="blur"
        quality={78}
        className={`object-cover ${imgClassName}`}
        style={{ objectPosition: focus ?? photo.focus }}
      />
      {caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal-950/80 to-transparent px-5 pb-4 pt-12 text-sm font-medium text-cream-100">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
