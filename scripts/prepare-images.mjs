/**
 * Prepares supplied gym photographs for the site.
 *
 * Usage:
 *   node scripts/prepare-images.mjs <source-dir> [manifest.json] [--og=<sourceNumber>]
 *
 * - manifest.json maps source filename stems (without extension) to
 *   descriptive output slugs, e.g. { "21": "stock-goblet-squat-daylight" }.
 *   Defaults to scripts/photo-manifests/batch-1-night.json (the original
 *   20 real class photos) when omitted, for backwards compatibility.
 * - Accepts .jpg, .jpeg, .png or .webp source files; always outputs
 *   re-encoded JPEG (mozjpeg, quality 84) with ALL metadata stripped
 *   (EXIF/GPS/XMP/ICC-embedded-profile-only-kept-for-colour) so nothing
 *   about the shoot location or authoring tool leaks.
 * - Writes to src/assets/photos/ (static imports give next/image intrinsic
 *   dimensions and automatic blur placeholders).
 * - `--og=<sourceNumber>` regenerates public/og-default.jpg (1200x630) from
 *   that source file. Defaults to "16" only when using the default manifest.
 *
 * Run once per batch of supplied photos; keep manifests under
 * scripts/photo-manifests/ so this stays reusable for future photoshoots.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = process.argv[2];
if (!source) {
  console.error("Usage: node scripts/prepare-images.mjs <source-dir> [manifest.json] [--og=<sourceNumber>]");
  process.exit(1);
}

const positional = process.argv.slice(3).filter((a) => !a.startsWith("--"));
const ogFlag = process.argv.find((a) => a.startsWith("--og="));

const defaultManifestPath = path.resolve("scripts/photo-manifests/batch-1-night.json");
const manifestPath = positional[0] ? path.resolve(positional[0]) : defaultManifestPath;
const usingDefaultManifest = manifestPath === defaultManifestPath;

const names = JSON.parse(await fs.readFile(manifestPath, "utf8"));

const outDir = path.resolve("src/assets/photos");
await fs.mkdir(outDir, { recursive: true });

const extensions = [".jpg", ".jpeg", ".png", ".webp"];

async function findSource(num) {
  for (const ext of extensions) {
    const candidate = path.join(source, `${num}${ext}`);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // try next extension
    }
  }
  return null;
}

const missing = [];
for (const [num, slug] of Object.entries(names)) {
  const src = await findSource(num);
  if (!src) {
    missing.push(num);
    continue;
  }
  const out = path.join(outDir, `${slug}.jpg`);
  const info = await sharp(src)
    .rotate() // apply EXIF orientation before stripping metadata
    .jpeg({ quality: 84, mozjpeg: true, progressive: true })
    .toFile(out);
  console.log(`${path.basename(src)} -> ${slug}.jpg (${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB)`);
}

if (missing.length) {
  console.warn(`Missing source files for: ${missing.join(", ")}`);
}

// Open Graph image: 1200x630 centre crop.
const ogNumber = ogFlag ? ogFlag.split("=")[1] : usingDefaultManifest ? "16" : null;
if (ogNumber) {
  const heroSrc = await findSource(ogNumber);
  if (heroSrc) {
    await fs.mkdir("public", { recursive: true });
    await sharp(heroSrc)
      .rotate()
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join("public", "og-default.jpg"));
    console.log("public/og-default.jpg written (1200x630)");
  } else {
    console.warn(`OG hero source "${ogNumber}" missing; OG image not generated.`);
  }
}
