/**
 * Central configuration for the cinematic scroll-video section.
 *
 * Swapping the clip is a config change here — no component edits needed.
 * See scripts/prepare-video.mjs for how to (re)generate these two files from
 * a new source clip, and docs/ASSET-INVENTORY.md for the current clip's
 * provenance and content notes.
 *
 * Current clip: AI Assets/1.mp4, trimmed to 9.95s (its last 2s repeat the
 * opening dumbbell shot), prepared with:
 *   node scripts/prepare-video.mjs "../AI Assets/1.mp4" --end 9.95 --poster 9.0
 */
export type StoryChapter = {
  /** Scene start, in seconds into the clip. Chapters run until the next start. */
  start: number;
  /** Small label, e.g. "Strength". */
  label: string;
  /** The big condensed headline for this scene. */
  title: string;
};

export const scrollStory = {
  videoSrc: "/video/scroll-story.mp4",
  posterSrc: "/video/scroll-story-poster.jpg",
  /** Poster intrinsic size, for layout reservation (no shift on load). */
  posterWidth: 854,
  posterHeight: 480,
  /** Matches the prepared clip; used to clamp scroll-scrub seeking. */
  durationSeconds: 9.95,
  /** One chapter per scene cut (detected with ffmpeg's scene filter). */
  chapters: [
    { start: 0, label: "Strength", title: "Pick it up." },
    { start: 1.71, label: "Conditioning", title: "Push past it." },
    { start: 3.67, label: "Community", title: "Train together." },
    { start: 5.83, label: "Confidence", title: "Own every rep." },
    { start: 8.04, label: "Your first class", title: "Start where you are." },
  ] satisfies StoryChapter[],
};
