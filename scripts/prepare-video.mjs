/**
 * Prepares a supplied video for the cinematic scroll section.
 *
 * Usage: node scripts/prepare-video.mjs <source.mp4>
 *
 * Produces, from one source clip:
 *   - public/video/scroll-story.mp4   web-optimised H.264, muted, no audio
 *   - public/video/scroll-story-poster.jpg   still frame (last frame, per the
 *     brief: "the final frame should form a balanced wide composition
 *     suitable for a static poster")
 *
 * Re-encode choices, and why:
 *   - 1920px wide (from 2562px): plenty sharp for a background video; cuts
 *     the pixel count by ~55%.
 *   - 30fps (from 60fps): halves the frame count with no visible loss for a
 *     slow pullback shot; this is not an action/sports-replay use case.
 *   - keyframe every 15 frames (0.5s) with scene-cut detection disabled: the
 *     scroll-scrub implementation seeks to arbitrary timestamps continuously,
 *     and seek speed is bounded by distance to the nearest keyframe. Frequent,
 *     *regular* keyframes make every seek fast and predictable.
 *   - audio stripped entirely: the section is muted background video (no
 *     autoplay audio, per the brief), so shipping an audio track is pure
 *     dead weight.
 *   - +faststart: moves the moov atom to the front so the browser can start
 *     playback/seeking from a partial download instead of needing the
 *     whole file first.
 *   - CRF 23 (visually near-lossless for this content, much smaller than the
 *     11.8 Mbps source) rather than a hard bitrate target, since it adapts to
 *     scene complexity automatically.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const source = process.argv[2];
if (!source) {
  console.error("Usage: node scripts/prepare-video.mjs <source.mp4>");
  process.exit(1);
}
if (!fs.existsSync(source)) {
  console.error(`Source not found: ${source}`);
  process.exit(1);
}

const outDir = path.resolve("public/video");
fs.mkdirSync(outDir, { recursive: true });
const outVideo = path.join(outDir, "scroll-story.mp4");
const outPoster = path.join(outDir, "scroll-story-poster.jpg");

function run(args) {
  console.log("ffmpeg " + args.join(" "));
  execFileSync(ffmpegPath, args, { stdio: "inherit" });
}

// Web-optimised video: scale, 30fps, regular keyframes, no audio, faststart.
run([
  "-y",
  "-i", source,
  "-vf", "scale=1920:-2,fps=30",
  "-c:v", "libx264",
  "-profile:v", "high",
  "-crf", "23",
  "-preset", "slow",
  "-g", "15",
  "-keyint_min", "15",
  "-sc_threshold", "0",
  "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  "-an",
  "-map_metadata", "-1",
  outVideo,
]);

// Poster: last frame (per the brief, the final frame is the intended still),
// extracted at full resolution then resized/compressed with sharp (mozjpeg)
// to match the rest of the site's image pipeline rather than ffmpeg's mjpeg
// encoder.
const rawFrame = path.join(outDir, "_raw-frame.png");
run(["-y", "-sseof", "-0.15", "-i", source, "-frames:v", "1", "-update", "1", rawFrame]);
const posterInfo = await sharp(rawFrame)
  .resize({ width: 1920 })
  .jpeg({ quality: 82, mozjpeg: true, progressive: true })
  .toFile(outPoster);
fs.unlinkSync(rawFrame);

const videoSize = fs.statSync(outVideo).size;
console.log(`\n${outVideo} (${(videoSize / 1024 / 1024).toFixed(2)} MB)`);
console.log(`${outPoster} (${posterInfo.width}x${posterInfo.height}, ${(posterInfo.size / 1024).toFixed(0)} KB)`);
