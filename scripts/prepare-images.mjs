/**
 * Prepares supplied gym photographs for the site.
 *
 * Usage: node scripts/prepare-images.mjs <source-dir>
 *
 * - Re-encodes each JPEG (mozjpeg, quality 84) and strips all metadata
 *   (EXIF/GPS) so nothing about the shoot location leaks.
 * - Writes descriptively named files to src/assets/photos/ (static imports
 *   give next/image intrinsic dimensions and automatic blur placeholders).
 * - Generates public/og-default.jpg (1200x630) from the hero photo.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = process.argv[2];
if (!source) {
  console.error("Usage: node scripts/prepare-images.mjs <source-dir>");
  process.exit(1);
}

const outDir = path.resolve("src/assets/photos");
await fs.mkdir(outDir, { recursive: true });

// Source number -> descriptive slug. Keep in sync with src/config/photos.ts.
const names = {
  1: "group-squat-under-tent",
  2: "wide-mat-work-dumbbell-press",
  3: "plank-position-from-behind",
  4: "silhouettes-under-tent",
  5: "forward-fold-stretch-group",
  6: "single-leg-glute-bridge-group",
  7: "cool-down-twist-stretch",
  8: "dumbbell-press-legs-raised-trio",
  9: "warm-up-circle-laughing",
  10: "dumbbell-press-dark",
  11: "tent-silhouettes-pole",
  12: "dumbbell-press-legs-raised-bright",
  13: "group-seated-chat-dusk",
  14: "banded-glute-bridge-setup",
  15: "cool-down-twist-house",
  16: "goblet-squat-hold-instructor",
  17: "hamstring-stretch-laughing",
  18: "banded-single-leg-bridge-wide",
  19: "cool-down-overhead-view",
  20: "motion-blur-forward-fold",
};

const missing = [];
for (const [num, slug] of Object.entries(names)) {
  const src = path.join(source, `${num}.jpg`);
  try {
    await fs.access(src);
  } catch {
    missing.push(`${num}.jpg`);
    continue;
  }
  const out = path.join(outDir, `${slug}.jpg`);
  const info = await sharp(src)
    .rotate() // apply EXIF orientation before stripping metadata
    .jpeg({ quality: 84, mozjpeg: true, progressive: true })
    .toFile(out);
  console.log(`${num}.jpg -> ${slug}.jpg (${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB)`);
}

if (missing.length) {
  console.warn(`Missing source files: ${missing.join(", ")}`);
}

// Open Graph image: 1200x630 centre crop of the hero photo.
const heroSrc = path.join(source, "16.jpg");
try {
  await fs.access(heroSrc);
  await fs.mkdir("public", { recursive: true });
  await sharp(heroSrc)
    .rotate()
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join("public", "og-default.jpg"));
  console.log("public/og-default.jpg written (1200x630)");
} catch {
  console.warn("Hero source 16.jpg missing; OG image not generated.");
}
