# Asset inventory

## Logo (logo.png, supplied for the visual redesign)

A single PNG, **206 × 201px**, no alpha channel — a black circle containing white/red fitness silhouettes and "THE BEST TOUCH FITNESS SERVICES" lettering, on an opaque white square canvas. Copied unmodified into `src/assets/brand/logo.png` and used by `src/components/ui/logo.tsx`.

Two things worth the owner's attention (also in `docs/OWNER-CHECKLIST.md`):

- **Resolution**: 206px is on the small side for a logo. It's fine at the sizes currently used (40px in the header, 64px in the footer), but would look soft blown up larger. A higher-resolution original (SVG ideally, or a large PNG) would future-proof it.
- **Background**: the canvas around the circular badge is solid white, not transparent, and the raised-arm silhouette appears to touch/break the circle's edge — which makes an automated "delete the background" pass risky (it could cut into real artwork). We left the file exactly as supplied and instead placed it on a small white rounded "plate" wherever it sits on a dark surface (the footer), so it reads as an intentional badge rather than a stray white box. A transparent-background version would remove the need for that.

## Cinematic scroll video (AI Assets/1.mp4)

A 12.04-second, 854×480, 24fps AI-generated H.264 clip (source `D:\Clients 2026\Kevin Glover\AI Assets\1.mp4`, ~4MB) with five cuts, detected with ffmpeg's scene filter: dumbbell pick-up (0s), battle ropes on the beach (1.71s), squat under the tent (3.67s), close-up (5.83s), and two athletes under the tent at night (8.04s). The final ~2s repeat the opening dumbbell shot, so the clip is trimmed at 9.95s. The people shown are generated reference footage, not members.

Prepared with `node scripts/prepare-video.mjs "../AI Assets/1.mp4" --end 9.95 --poster 9.0` (ffmpeg is bundled through `ffmpeg-static`):

- `public/video/scroll-story.mp4`: native 854×480 (never upscaled), 30fps, **audio stripped**, a keyframe every 0.2s for smooth scroll-scrubbing, `+faststart`. **1.97 MB**.
- `public/video/scroll-story-poster.jpg`: the two-athletes frame at 9.0s, **37 KB**. This is the play-mode poster and the reduced-motion/slow-connection fallback.

Central config: `src/config/video.ts`. Each chapter's start time matches a scene cut. To use a new clip, re-run the prepare script and update the chapter times.

**Resolution note:** at 854×480 the clip looks soft when shown full-bleed on large desktop screens. A 1080p export of the same clip would noticeably sharpen the section.

## Favicon

`public/icon.svg` is the source file: a "BT" monogram with the brand-red angled bar from the hero headline. Run `node scripts/generate-favicons.mjs` to generate `public/favicon.ico` (16/32/48) and `public/apple-touch-icon.png` (180) from it.

## Batch 1: real class photography (1.jpg-20.jpg)

Twenty photographs were supplied as `1.jpg` to `20.jpg`. All are **2000 x 924 px** (2.165:1 panoramic crops), JPEG, 168 to 327 KB. They are real outdoor group-training photographs taken at night under a white marquee on a raised grey platform. No logo, brand colours or typography were supplied, so a provisional design system is used (see README).

These are used exclusively (no stock images mixed in) on the **Gallery page**, and copy there ("every photograph shows our real classes and members") is written to describe this batch specifically.

Processing (`npm run images:prepare <source-dir>`):

- re-encoded with mozjpeg at quality 84, progressive
- **all EXIF metadata stripped** (including any GPS data)
- renamed descriptively into `src/assets/photos/`
- `public/og-default.jpg` (1200 x 630) generated from the hero photo

Static imports give `next/image` intrinsic dimensions and automatic blur placeholders. Because the frames are so wide, each photo carries a `focus` (CSS `object-position`) in `src/config/photos.ts` so mobile and card crops keep the people in frame.

## Mapping

| Source | File | What it shows | Quality | Used for |
| --- | --- | --- | --- | --- |
| 16.jpg | goblet-squat-hold-instructor | Coach centred holding a dumbbell at chest height, group around her, well lit, faces visible | Excellent | Gallery, OG image |
| 9.jpg | warm-up-circle-laughing | Group standing in a circle, smiling, chatting | Excellent | Home intro, gallery #1 |
| 18.jpg | banded-single-leg-bridge-wide | Wide, bright, banded single-leg glute bridges | Excellent | Gallery |
| 1.jpg | group-squat-under-tent | Group squatting, coach front, dumbbells | Good (slightly dark) | Gallery |
| 2.jpg | wide-mat-work-dumbbell-press | Wide shot, legs raised, dumbbell press, building behind | Excellent | Home photo band, gallery |
| 13.jpg | group-seated-chat-dusk | Members seated chatting at dusk, dumbbells foreground | Excellent | About hero, Nutrition, home nutrition teaser, gallery |
| 5.jpg | forward-fold-stretch-group | Forward-fold stretch, coach centre | Good | About, gallery |
| 7.jpg | cool-down-twist-stretch | Relaxed lying twist cool-down | Good | Senior Circuit class (calm, supported movement), gallery |
| 8.jpg | dumbbell-press-legs-raised-trio | Three members pressing dumbbells, legs raised, dark background | Very good | Gallery |
| 14.jpg | banded-glute-bridge-setup | Four members with bands on thighs, dumbbells foreground | Very good | Gallery |
| 17.jpg | hamstring-stretch-laughing | Leg stretch, laughing member foreground | Good | About, gallery |
| 6.jpg | single-leg-glute-bridge-group | Single-leg glute bridges, wide | Good | Gallery |
| 12.jpg | dumbbell-press-legs-raised-bright | Dumbbell press trio, brighter variant of 8 | Good | Gallery |
| 15.jpg | cool-down-twist-house | Twist stretch with lit window behind | Good (atmospheric) | Gallery |
| 19.jpg | cool-down-overhead-view | Overhead cool-down | Good | Gallery |
| 10.jpg | dumbbell-press-dark | Dumbbell press, darker | Fair | Gallery (late) |
| 11.jpg | tent-silhouettes-pole | Silhouettes, tent pole centre | Fair (atmospheric) | Gallery (late) |
| 4.jpg | silhouettes-under-tent | Wide silhouettes under lit tent | Fair (atmospheric) | Placeholder image for coming-soon classes only |
| 3.jpg | plank-position-from-behind | Plank/push-up position photographed from behind, dark | Not used | Framing is not respectful of members |
| 20.jpg | motion-blur-forward-fold | Heavy motion blur | Not used | Unusable |

## Batch 2: stock/reference photography (21.webp-30.webp)

Ten further photographs were supplied as `21.webp` to `30.webp`. **The client confirmed these are stock or reference photography, not real photos of this gym's members or premises.** They are visually polished (studio-grade lighting, symmetric/idealised subjects), have no EXIF or XMP metadata, and were supplied at resolutions typical of stock libraries or AI image generators (1122x1402, 1536x1024, 1672x941) rather than a camera's native sensor output — consistent with that confirmation.

Given that, every use of this batch follows two rules: filenames and code identifiers are prefixed `stock-`/`stock*` so nothing is mistaken for a real photo later, and alt text/captions describe the activity only ("Two people performing a lunge...") and never assert a specific identity or claim this is the real facility. The **Gallery page and its "real members" copy are untouched** and contain none of these images. The sitewide footer line was changed from a blanket "real members" claim to "See real class photos in our gallery," which stays accurate for both batches.

Per the agreed scope (new photos take the hero and the two class cards with a clear visual match; the rest of the site keeps its real photography):

| Source | File | What it shows | Used for |
| --- | --- | --- | --- |
| 30.webp | stock-couple-standing-tent | Two people standing together on mats under a marquee, smiling | **Home hero banner** |
| 24.webp | stock-group-plank-front | Small group holding a plank, front view | **Bootcamp** class (home card + classes page) |
| 23.webp | stock-couple-lunges-twilight | Two people lunging side by side | **Bums, Tums & Thighs** class (home card + classes page) |
| 21.webp | stock-goblet-squat-daylight | Goblet squat, bright daylight, portrait crop | Registered, not yet placed |
| 22.webp | stock-bicep-curl-solo | Solo bicep curl, portrait crop | Registered, not yet placed |
| 25.webp | stock-couple-stretch-seated-twilight | Two people seated, stretching | Registered, not yet placed |
| 26.webp | stock-couple-high-five | Two people high-fiving | Registered, not yet placed |
| 27.webp | stock-woman-towel-portrait | Person with towel and water bottle, portrait crop | Registered, not yet placed |
| 28.webp | stock-group-arm-stretch-twilight | Small group, cross-body arm stretch | Registered, not yet placed |
| 29.webp | stock-couple-resting-mats | Two people seated resting on mats | Registered, not yet placed |

The Senior Circuit class deliberately **keeps its real photo** (7.jpg, cool-down-twist-stretch) rather than switching to one of these — none of batch 2 depicts an older demographic, and using a young-model stock photo there would misrepresent who that class is for.

**Action needed from the client:** if any of these were purchased from a stock library or generated with a paid AI tool, please confirm the licence permits commercial web use (most standard stock/AI-generation licences do, but terms vary by provider). We have not been given licence documentation and have not verified this.

## Missing assets

- Logo: supplied (see top of this file). The favicon is a "BT" monogram derived from the brand (`public/icon.svg`).
- Brand colours / fonts: **not supplied**. Provisional charcoal, warm white and electric-lime palette with Archivo (display) and Manrope (body).
- Trainer portraits: **not supplied**. The About page shows community copy until verified trainer details are added.
- Photographs of Spin or Step: **not supplied** (classes are unconfirmed).
