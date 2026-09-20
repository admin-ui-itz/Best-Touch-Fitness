"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { scrollStory } from "@/config/video";

/**
 * Cinematic scroll-controlled video section.
 *
 * Desktop-only scroll-scrub experience: a sticky video viewport whose
 * playback position is driven by how far the visitor has scrolled through a
 * tall wrapper section (native scrolling throughout — nothing is pinned by
 * JS beyond CSS `position: sticky`, and there is no scroll hijacking). The
 * three text beats cross-fade in step with the same scroll progress, each
 * owning roughly a third of the section, so they track the video's own
 * pullback-reveal arc rather than all appearing at once.
 *
 * Everywhere else — mobile, tablets, reduced-motion, Save-Data/slow
 * connections, or if the video simply fails to load — falls back to a
 * static composition: the poster frame with all three beats shown together
 * and the same call to action, so the message and the CTA are never lost.
 */
export function ScrollStory() {
  const [mode, setMode] = useState<"loading" | "scrub" | "static">("loading");
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const beatRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  // Decide the experience once, on mount: scroll-scrub only for wide,
  // motion-tolerant, non-constrained connections. Deferred a tick (rather
  // than set synchronously in the effect body) to avoid an immediate
  // cascading render right after mount.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
        .connection;
      const constrained = Boolean(connection?.saveData) || ["slow-2g", "2g"].includes(connection?.effectiveType ?? "");
      setMode(wide && !reducedMotion && !constrained ? "scrub" : "static");
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  // Lazy-load the actual video once the section is nearly in view, and only
  // in scrub mode (the static mode only ever needs the poster image).
  useEffect(() => {
    if (mode !== "scrub") return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.preload = "auto";
            video.load();
            io.disconnect();
          }
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [mode]);

  // Drive playback position and beat opacity from scroll progress through
  // the section. Writes go straight to element styles (not React state) so
  // this stays smooth at scroll/frame rate without re-rendering.
  useEffect(() => {
    if (mode !== "scrub" || videoFailed) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let seeking = false;
    let ready = false;
    const onLoaded = () => {
      ready = true;
    };
    video.addEventListener("loadedmetadata", onLoaded);

    const beatCount = scrollStory.beats.length;
    const update = () => {
      rafRef.current = null;
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;

      if (ready && !seeking) {
        const duration = video.duration || scrollStory.durationSeconds;
        const target = progress * duration;
        // Avoid overlapping seeks: only issue a new one once the previous
        // completes, and skip sub-frame-sized changes.
        if (Math.abs(video.currentTime - target) > 0.03) {
          seeking = true;
          video.currentTime = target;
        }
      }

      // Each beat "owns" a third of the scroll with a soft crossfade at the
      // edges, so the text tracks the pullback reveal rather than jump-cutting.
      beatRefs.current.forEach((el, i) => {
        if (!el) return;
        const center = (i + 0.5) / beatCount;
        const distance = Math.abs(progress - center) * beatCount;
        const opacity = Math.max(0, 1 - distance * 1.15);
        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${(1 - opacity) * 10}px)`;
      });

      rafRef.current = requestAnimationFrame(update);
    };
    const onSeeked = () => {
      seeking = false;
    };
    video.addEventListener("seeked", onSeeked);
    const onError = () => setVideoFailed(true);
    video.addEventListener("error", onError);

    rafRef.current = requestAnimationFrame(update);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };
  }, [mode, videoFailed]);

  const showStaticFallback = mode === "static" || mode === "loading" || videoFailed;

  return (
    <section
      ref={sectionRef}
      aria-label="Our approach, in motion"
      style={mode === "scrub" ? { height: "280vh" } : undefined}
    >
      <div
        className={
          mode === "scrub"
            ? "sticky top-0 h-screen w-full overflow-hidden"
            : "relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]"
        }
      >
        {/* Poster: always rendered first/underneath so there is never a gap. */}
        <Image
          src={scrollStory.posterSrc}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ opacity: showStaticFallback ? 1 : 0, transition: "opacity 300ms" }}
        />

        {!showStaticFallback ? (
          <video
            ref={videoRef}
            muted
            playsInline
            preload="none"
            poster={scrollStory.posterSrc}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={scrollStory.videoSrc} type="video/mp4" />
          </video>
        ) : null}

        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal-950/75 via-charcoal-950/10 to-charcoal-950/40"
          aria-hidden="true"
        />

        <div className="relative flex h-full flex-col justify-end px-4 pb-16 sm:px-8 sm:pb-20 lg:px-16">
          <div className="dark-surface max-w-xl">
            <h2 className="sr-only">Our approach</h2>
            <div className={mode === "scrub" ? "relative h-[3.5em] sm:h-[2.4em]" : "space-y-2"}>
              {scrollStory.beats.map((beat, i) => (
                <p
                  key={beat}
                  ref={(el) => {
                    beatRefs.current[i] = el;
                  }}
                  className={
                    mode === "scrub"
                      ? "absolute inset-0 font-display text-3xl font-extrabold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-4xl lg:text-5xl"
                      : "font-display text-2xl font-extrabold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-3xl"
                  }
                >
                  {beat}
                </p>
              ))}
            </div>
            <div className="pt-6">
              <Link href="/classes" className="btn btn-primary">
                Explore classes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
