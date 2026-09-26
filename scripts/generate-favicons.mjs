/**
 * Generates raster favicons from the master SVG mark.
 *
 * Usage: node scripts/generate-favicons.mjs
 *
 * Reads  public/icon.svg (the source of truth — edit that, then re-run)
 * Writes public/favicon.ico          16/32/48px, PNG-in-ICO, for legacy
 *                                    browsers and tools that request
 *                                    /favicon.ico directly
 *        public/apple-touch-icon.png 180px, square (iOS applies its own mask)
 */
import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";

const publicDir = path.resolve("public");
const svg = fs.readFileSync(path.join(publicDir, "icon.svg"));

const png = (size) => sharp(svg, { density: 600 }).resize(size, size).png().toBuffer();

// ICO container with embedded PNGs (supported by every browser since IE Vista-era).
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);
let offset = 6 + 16 * images.length;
const entries = images.map((img, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i], 0); // width
  e.writeUInt8(sizes[i], 1); // height
  e.writeUInt8(0, 2); // palette
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(img.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += img.length;
  return e;
});
fs.writeFileSync(path.join(publicDir, "favicon.ico"), Buffer.concat([header, ...entries, ...images]));

// Apple touch icon: flatten onto the mark's own black so iOS never shows
// transparent corners as white.
await sharp(svg, { density: 600 })
  .resize(180, 180)
  .flatten({ background: "#0a0a0a" })
  .png()
  .toFile(path.join(publicDir, "apple-touch-icon.png"));

console.log("Wrote public/favicon.ico and public/apple-touch-icon.png");
