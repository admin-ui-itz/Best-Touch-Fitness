# Asset inventory

Twenty photographs were supplied as `1.jpg` to `20.jpg`. All are **2000 x 924 px** (2.165:1 panoramic crops), JPEG, 168 to 327 KB. They are real outdoor group-training photographs taken at night under a white marquee on a raised grey platform. No logo, brand colours or typography were supplied, so a provisional design system is used (see README).

Processing (`npm run images:prepare <source-dir>`):

- re-encoded with mozjpeg at quality 84, progressive
- **all EXIF metadata stripped** (including any GPS data)
- renamed descriptively into `src/assets/photos/`
- `public/og-default.jpg` (1200 x 630) generated from the hero photo

Static imports give `next/image` intrinsic dimensions and automatic blur placeholders. Because the frames are so wide, each photo carries a `focus` (CSS `object-position`) in `src/config/photos.ts` so mobile and card crops keep the people in frame.

## Mapping

| Source | File | What it shows | Quality | Used for |
| --- | --- | --- | --- | --- |
| 16.jpg | goblet-squat-hold-instructor | Coach centred holding a dumbbell at chest height, group around her, well lit, faces visible | Excellent | **Home hero**, OG image |
| 9.jpg | warm-up-circle-laughing | Group standing in a circle, smiling, chatting | Excellent | Home intro, gallery #1 |
| 18.jpg | banded-single-leg-bridge-wide | Wide, bright, banded single-leg glute bridges | Excellent | Bums, Tums & Thighs class, gallery |
| 1.jpg | group-squat-under-tent | Group squatting, coach front, dumbbells | Good (slightly dark) | Bootcamp class, gallery |
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

## Missing assets

- Logo / wordmark: **not supplied**. A provisional dumbbell glyph + text wordmark is used (`src/components/ui/logo.tsx`, `public/icon.svg`).
- Brand colours / fonts: **not supplied**. Provisional charcoal, warm white and electric-lime palette with Archivo (display) and Manrope (body).
- Trainer portraits: **not supplied**. The About page shows community copy until verified trainer details are added.
- Photographs of Spin or Step: **not supplied** (classes are unconfirmed).
