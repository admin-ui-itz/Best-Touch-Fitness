import Link from "next/link";

import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { galleryPhotoKeys, photos } from "@/config/photos";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Gallery",
  description: "Photographs from our outdoor group training sessions: real classes, real members, under the tent.",
  path: "/gallery",
});

export default function GalleryPage() {
  const galleryPhotos = galleryPhotoKeys.map((key) => photos[key]);
  return (
    <>
      <section className="container-x pt-16 pb-12 sm:pt-24">
        <SectionHeading
          as="h1"
          eyebrow="Gallery"
          title="Under the tent."
          intro={
            <p>
              A look at what a session feels like. Every photograph shows our real classes and
              members. Use the arrow keys to move between photos once one is open.
            </p>
          }
        />
      </section>
      <section className="container-x pb-20 sm:pb-28">
        <GalleryGrid photos={galleryPhotos} />
        <div className="mt-16 flex flex-col items-start gap-4 border-t-2 border-charcoal-900 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-semibold">Like what you see? Come and train with us.</p>
          <Link href="/contact" className="btn btn-primary">
            Enquire about joining
          </Link>
        </div>
      </section>
    </>
  );
}
