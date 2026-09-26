"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { scrollStory } from "@/config/video";

type Mode = "loading" | "scrub" | "play" | "static";

const chapters = scrollStory.chapters;
const lastIndex = chapters.length - 1;
/** Share of the scroll spent expanding the inset frame to full-bleed before scrubbing starts. */
const INTRO = 0.1;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

function chapterAt(time: number) {
  let index = 0;
  chapters.forEach((c, i) => {
    if (time >= c.start) index = i;
  });
  return index;
}

/**
 * Cinematic, chapter-driven video section.
 *
 * - "scrub" (wide screens, fine pointer): a tall section with a sticky stage.
 *   The first slice of scroll grows the video from an inset frame to
 *   full-bleed; the rest drives the playhead, so each scene cut lands with its
 *   own headline. Native scrolling throughout — only CSS `position: sticky`,
 *   no scroll hijacking.
 * - "play" (phones/tablets): the same stage and chapter UI, but the clip
 *   autoplays muted on loop and chapters follow the playhead. Scroll-scrubbing
 *   on touch devices is unreliable, so we don't fake it there.
 * - "static" (reduced motion, Save-Data, slow connections, or a failed load):
 *   the poster frame with every chapter listed and the same CTA.
 */
export function ScrollStory() {
  const [mode, setMode] = useState<Mode>("loading");
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const railRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // Decide the experience once, on mount (deferred a tick to avoid a
  // cascading render straight after hydration).
  useEffect(() => {
    const id = window.setTimeout(() => {
      const mq = (q: string) => window.matchMedia(q).matches;
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
        .connection;
      const constrained =
        Boolean(connection?.saveData) || ["slow-2g", "2g"].includes(connection?.effectiveType ?? "");
      if (mq("(prefers-reduced-motion: reduce)") || constrained) setMode("static");
      else if (mq("(min-width: 1024px) and (pointer: fine)")) setMode("scrub");
      else setMode("play");
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  // Lazy-load the clip only once the section is close to the viewport.
  useEffect(() => {
    if (mode !== "scrub" && mode !== "play") return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        video.preload = "auto";
        video.load();
        if (mode === "play") void video.play().catch(() => undefined);
        io.disconnect();
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [mode]);

  // Scrub mode: scroll position -> frame inset, playhead, chapter and rail.
  // Per-frame writes go straight to styles; React state only changes when the
  // chapter does.
  useEffect(() => {
    if (mode !== "scrub" || failed) return;
    const section = sectionRef.current;
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!section || !frame || !video) return;

    let raf = 0;
    let seeking = false;
    let smoothed = 0;
    const duration = () => (Number.isFinite(video.duration) && video.duration) || scrollStory.durationSeconds;
    const onSeeked = () => {
      seeking = false;
    };
    // A never-seeked video keeps showing its poster; nudge it onto a real
    // frame as soon as data arrives so the opening scene is frame 0.
    const onLoaded = () => {
      if (video.currentTime === 0) video.currentTime = 0.001;
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadeddata", onLoaded);

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? clamp(-rect.top / scrollable) : 0;

      // Intro: inset frame opens up to full-bleed (eased).
      const open = 1 - Math.pow(1 - clamp(progress / INTRO), 3);
      const inset = (1 - open) * 9;
      frame.style.clipPath = `inset(${inset}% ${inset * 1.6}% round ${(1 - open) * 6}px)`;
      frame.style.transform = `scale(${1.06 - open * 0.06})`;

      // Playhead: lerp toward the target so wheel steps glide rather than jump.
      const target = clamp((progress - INTRO) / (1 - INTRO)) * duration();
      smoothed += (target - smoothed) * 0.2;
      if (Math.abs(target - smoothed) < 0.002) smoothed = target;
      if (video.readyState >= 1 && !seeking && Math.abs(video.currentTime - smoothed) > 1 / 60) {
        seeking = true;
        video.currentTime = smoothed;
      }

      setActive(chapterAt(smoothed));
      chapters.forEach((c, i) => {
        const el = railRefs.current[i];
        if (!el) return;
        const end = chapters[i + 1]?.start ?? duration();
        el.style.transform = `scaleY(${clamp((smoothed - c.start) / (end - c.start))})`;
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadeddata", onLoaded);
    };
  }, [mode, failed]);

  // Play mode: chapters and rail follow the looping playhead.
  useEffect(() => {
    if (mode !== "play" || failed) return;
    const video = videoRef.current;
    if (!video) return;
    // Prefer per-decoded-frame callbacks so headlines land exactly on the
    // cuts; fall back to rAF where requestVideoFrameCallback is missing.
    const perFrame = "requestVideoFrameCallback" in video;
    let handle = 0;
    const schedule = () => {
      handle = perFrame ? video.requestVideoFrameCallback(tick) : requestAnimationFrame(tick);
    };
    const tick = () => {
      const t = video.currentTime;
      setActive(chapterAt(t));
      chapters.forEach((c, i) => {
        const el = railRefs.current[i];
        if (!el) return;
        const end = chapters[i + 1]?.start ?? scrollStory.durationSeconds;
        el.style.transform = `scaleY(${clamp((t - c.start) / (end - c.start))})`;
      });
      schedule();
    };
    schedule();
    return () => {
      if (perFrame) video.cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
    };
  }, [mode, failed]);

  const animated = (mode === "scrub" || mode === "play") && !failed;
  const isScrub = mode === "scrub" && !failed;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="story-heading"
      className="dark-surface relative bg-charcoal-950"
      style={isScrub ? { height: `${chapters.length * 90 + 60}vh` } : undefined}
    >
      <h2 id="story-heading" className="sr-only">
        How we train
      </h2>

      <div
        className={
          isScrub
            ? "sticky top-0 h-screen w-full overflow-hidden"
            : "relative h-[88svh] min-h-[34rem] w-full overflow-hidden"
        }
      >
        <div ref={frameRef} className="absolute inset-0 overflow-hidden will-change-[clip-path,transform]">
          <Image
            src={scrollStory.posterSrc}
            alt=""
            fill
            sizes="100vw"
            className={`object-cover transition-opacity duration-500 ${isScrub ? "opacity-0" : ""}`}
          />
          {animated ? (
            <video
              ref={videoRef}
              muted
              playsInline
              loop={mode === "play"}
              preload="none"
              // Scrub mode opens on frame 0, not the closing-shot poster.
              poster={mode === "play" ? scrollStory.posterSrc : undefined}
              aria-hidden="true"
              onError={() => setFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={scrollStory.videoSrc} type="video/mp4" />
            </video>
          ) : null}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(90deg,rgb(10_10_10/0.8)_0%,rgb(10_10_10/0.35)_45%,transparent_75%),linear-gradient(0deg,rgb(10_10_10/0.85)_0%,transparent_45%)]"
          />
        </div>

        {animated ? (
          <>
            {/* Chapter headlines: one visible at a time, wiping up as the scene changes. */}
            <div className="absolute inset-x-0 bottom-0 pb-24 sm:pb-20">
              <div className="container-x">
                <div className="relative h-[10rem] sm:h-[12rem] lg:h-[13rem]" aria-live="polite">
                  {chapters.map((c, i) => (
                    <div
                      key={c.title}
                      data-active={i === active}
                      aria-hidden={i !== active}
                      className="story-chapter absolute inset-x-0 bottom-0"
                    >
                      <p className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[0.24em] text-brand-400">
                        <span className="text-white">{String(i + 1).padStart(2, "0")}</span>
                        <span aria-hidden="true" className="h-0.5 w-8 bg-brand-500" />
                        {c.label}
                      </p>
                      <p className="display-condensed mt-3 text-6xl text-white sm:text-8xl lg:text-[9rem]">
                        {c.title}
                      </p>
                    </div>
                  ))}
                </div>
                <div
                  className={`mt-6 flex flex-wrap gap-3 transition-[opacity,transform] duration-500 ${
                    active === lastIndex ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                  }`}
                  aria-hidden={active !== lastIndex}
                >
                  <Link href="/contact" className="btn btn-primary" tabIndex={active === lastIndex ? 0 : -1}>
                    Find my first class
                  </Link>
                  <Link href="/classes" className="btn btn-secondary" tabIndex={active === lastIndex ? 0 : -1}>
                    Explore classes
                  </Link>
                </div>
              </div>
            </div>

            {/* Progress rail: one segment per scene. */}
            <ol
              aria-hidden="true"
              className="absolute top-1/2 right-4 flex -translate-y-1/2 flex-col gap-2 [text-shadow:0_1px_10px_rgb(0_0_0/0.7)] sm:right-8 lg:right-12"
            >
              {chapters.map((c, i) => (
                <li key={c.title} className="flex items-center justify-end gap-3">
                  <span
                    className={`hidden font-display text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 lg:block ${
                      i === active ? "text-white" : "text-white/35"
                    }`}
                  >
                    {c.label}
                  </span>
                  <span className="relative block h-10 w-[3px] overflow-hidden bg-white/20">
                    <span
                      ref={(el) => {
                        railRefs.current[i] = el;
                      }}
                      className="absolute inset-0 origin-top scale-y-0 bg-brand-500"
                    />
                  </span>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <div className="absolute inset-x-0 bottom-0 pb-16">
            <div className="container-x">
              <ol className="space-y-1">
                {chapters.map((c, i) => (
                  <li key={c.title} className="display-condensed text-4xl text-white sm:text-6xl">
                    <span className="mr-3 align-middle font-display text-xs font-bold tracking-[0.24em] text-brand-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {c.title}
                  </li>
                ))}
              </ol>
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
        )}
      </div>
    </section>
  );
}
