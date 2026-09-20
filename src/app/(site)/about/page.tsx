import { CoachSection } from "@/components/home/coach-section";
import { PhotoFigure } from "@/components/ui/photo-figure";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { photos } from "@/config/photos";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About",
  description: `${siteConfig.name} is outdoor group training under a marquee, coached in person, for a genuine mix of ages and levels.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <section className="container-x pt-16 pb-12 sm:pt-24">
        <SectionHeading
          as="h1"
          eyebrow="About"
          title="A community that trains together."
          intro={
            <p>
              We train outdoors, under a marquee, with mats down and a coach leading every session in
              person. The group is a genuine mix of ages and experience — beginners next to regulars,
              next to our Senior Circuit members.
            </p>
          }
        />
      </section>

      <section className="container-x pb-20 sm:pb-28">
        <Reveal>
          <PhotoFigure
            photo={photos.groupSeatedChatDusk}
            aspect="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2000/924]"
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="shadow-soft"
          />
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl">What we care about</h2>
          </Reveal>
          <Reveal delay={100} className="prose-gym space-y-5">
            <p>
              <strong className="text-charcoal-900">Movement first.</strong> We coach form before
              intensity. Every exercise has an option that suits where you are today.
            </p>
            <p>
              <strong className="text-charcoal-900">Consistency over perfection.</strong> The members
              who feel the biggest difference are the ones who keep turning up, not the ones who
              go hardest once.
            </p>
            <p>
              <strong className="text-charcoal-900">Everyone belongs.</strong> Our classes are
              designed for a wide range of ages, including a dedicated Senior Circuit. If you are
              nervous about your first session, say so; you will be looked after.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          <Reveal>
            <PhotoFigure
              photo={photos.forwardFoldStretchGroup}
              aspect="aspect-[4/3]"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          </Reveal>
          <Reveal delay={100}>
            <PhotoFigure
              photo={photos.hamstringStretchLaughing}
              aspect="aspect-[4/3]"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          </Reveal>
        </div>
      </section>

      <div className="bg-cream-50">
        <CoachSection />
      </div>
    </>
  );
}
