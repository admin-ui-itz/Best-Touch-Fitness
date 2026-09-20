/**
 * Central configuration for the cinematic scroll-video section.
 *
 * Swapping the clip is a one-line change here — no component edits needed.
 * See scripts/prepare-video.mjs for how to (re)generate these two files from
 * a new source clip, and docs/ASSET-INVENTORY.md for the current clip's
 * provenance and content notes.
 */
export const scrollStory = {
  videoSrc: "/video/scroll-story.mp4",
  posterSrc: "/video/scroll-story-poster.jpg",
  /** Poster intrinsic size, for layout reservation (no shift on load). */
  posterWidth: 1920,
  posterHeight: 1079,
  /** Matches the source clip; used to clamp scroll-scrub seeking. */
  durationSeconds: 8,
  /** Three short beats shown as the section scrolls, left edit-in-place. */
  beats: ["Build strength.", "Find your people.", "Start where you are."] as const,
};
