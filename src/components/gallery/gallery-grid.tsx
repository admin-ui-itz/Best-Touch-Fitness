"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Photo } from "@/config/photos";

type GalleryGridProps = {
  photos: Photo[];
};

/**
 * Photo grid with an accessible lightbox built on the native <dialog>
 * element: modal focus trapping, Escape-to-close, arrow-key navigation,
 * focus returned to the thumbnail that opened it, and a live region that
 * announces the current position.
 */
export function GalleryGrid({ photos }: GalleryGridProps) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const open = (i: number, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setIndex(i);
  };

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (current === null) return current;
        return (current + delta + photos.length) % photos.length;
      });
    },
    [photos.length],
  );

  // Open/close the native dialog in sync with state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    }
  }, [index]);

  const onDialogClose = () => {
    document.body.style.overflow = "";
    setIndex(null);
    openerRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "Escape") {
      // <dialog> handles Escape natively; this keeps it working when the
      // event is synthetic (assistive tech, automation).
      e.preventDefault();
      close();
    }
  };

  const current = index !== null ? photos[index] : null;

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Class photographs">
        {photos.map((photo, i) => (
          <li key={photo.source}>
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="photo-frame group block aspect-[4/3] w-full cursor-zoom-in"
              aria-label={`Open photo ${i + 1} of ${photos.length}: ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                placeholder="blur"
                quality={72}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                style={{ objectPosition: photo.focus }}
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={onDialogClose}
        onKeyDown={onKeyDown}
        onClick={(e) => {
          // Click on the backdrop (the dialog element itself) closes.
          if (e.target === e.currentTarget) close();
        }}
        aria-label="Photo viewer"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-charcoal-950/95 p-0 text-cream-100 backdrop:bg-charcoal-950/80 open:flex open:flex-col"
      >
        {current ? (
          <div className="dark-surface flex h-full w-full flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <p className="text-sm font-semibold" aria-live="polite" aria-atomic="true">
                Photo {index! + 1} of {photos.length}
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                className="btn btn-ghost btn-sm"
              >
                Close
              </button>
            </div>

            <figure className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
              <div className="relative h-full w-full">
                <Image
                  key={current.source}
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  quality={82}
                  className="object-contain"
                  priority
                />
              </div>
              <figcaption className="sr-only">{current.alt}</figcaption>
            </figure>

            <div className="flex items-center justify-center gap-3 px-4 py-4 sm:justify-between sm:px-6">
              <button type="button" onClick={() => step(-1)} className="btn btn-secondary btn-sm">
                <span aria-hidden="true">&larr;</span> Previous
              </button>
              <p className="hidden max-w-2xl text-center text-sm text-ink-on-dark-muted sm:block">
                {current.alt}
              </p>
              <button type="button" onClick={() => step(1)} className="btn btn-secondary btn-sm">
                Next <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
