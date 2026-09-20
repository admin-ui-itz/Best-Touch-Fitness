# Owner checklist: what we still need from you

Nothing on the live site is invented. Every item below is currently **hidden** or shown honestly as unconfirmed until you supply it. Send the details and we will switch them on. Most of these live in one file, `src/config/site.ts` (classes in `src/config/classes.ts`), so updates are quick.

## 0. Urgent — fix before the next deploy matters for SEO/sharing

- **Netlify environment variable `NEXT_PUBLIC_SITE_URL` is set to the wrong domain.** The live site is at `https://melodious-kitsune-b9f060.netlify.app`, but its canonical URL, Open Graph URL and Open Graph image all currently point to `https://best-touch-fitness.netlify.app`, which **returns a 404** (confirmed by testing it directly) — that was only ever an illustrative example in earlier instructions, not a real address. Fix: in Netlify, **Site configuration → Environment variables**, set `NEXT_PUBLIC_SITE_URL` to `https://melodious-kitsune-b9f060.netlify.app` (or your final custom domain once connected), then redeploy. Until this is fixed, social media link previews (Facebook/X/LinkedIn/WhatsApp) will fail to load an image for the site.

## 1. Brand

| Item | Status | Where it appears |
| --- | --- | --- |
| Business name | **Confirmed**: "Best Touch Fitness" | Everywhere: header, footer, page titles, emails |
| Logo | **Integrated** (the black-circle "Best Touch Fitness Services" badge you supplied) | Header, footer, admin | 
| Logo resolution | **Flag**: the supplied file is only 206×201px, quite small for a logo. It reads fine at current sizes (40px header, 64px footer) but would look soft if used larger (e.g. a big hero mark). Send a higher-resolution original (ideally an SVG, or a PNG 800px+) if you want it used at larger sizes later. | — |
| Logo background | **Flag**: the file has a solid white square canvas (no transparency) around the circular badge. We did not attempt to remove it or redraw the artwork (risk of cutting into the raised-arm silhouette, and the brief asked us not to AI-edit the artwork) — instead we place it on a small rounded white "plate" when it sits on a dark background (footer), so it still reads as an intentional badge rather than a stray white box. A transparent-background version, if you have one, would let it sit flush anywhere. | Footer |
| Legal / trading name for the copyright line | Optional (defaults to "Best Touch Fitness") | Footer |
| Licence confirmation for the 10 stock/reference photos (21.webp-30.webp) | **Needed** | Home hero, Bootcamp and Bums, Tums & Thighs — see `docs/ASSET-INVENTORY.md` batch 2 |
| Cinematic pullback video | **Integrated** (`1v2.mp4`, 8s, re-encoded for web — 2.5MB down from 12MB) | Home page, "Our approach" scroll section |

## 2. Contact details (all hidden until supplied)

| Item | Status | Where it appears |
| --- | --- | --- |
| Public email address | **Needed** | Footer, contact page, structured data |
| Public phone number | Optional | Footer, contact page |
| WhatsApp number (must be verified as active) | Optional | Contact page and footer "Message on WhatsApp" button |
| Training address / location | **Needed** for the map and the home info strip | Contact page, home page, FAQ, structured data |
| Google Maps embed link | Optional | Contact page map |
| Opening hours or session times | Optional | Contact page |
| Instagram / Facebook / TikTok / YouTube links | Optional | Footer |

## 3. Classes, pricing and policies

- Confirmed classes shown now: **Bums, Tums & Thighs**, **Bootcamp**, **Senior Circuit**.
- Please check the short descriptions, intensity notes and "what to bring" lines in `src/config/classes.ts`.
- **Spin** and **Step** are hidden. Set `showComingSoonClasses` to `true` to show a "Coming soon" label (no dates, no bookings) once you want to advertise them.
- **Weekly timetable**: hidden until real days/times are supplied (`siteConfig.timetable`).
- **Starting price / pricing link**: new field ready in `siteConfig.pricing` — shown in the home info strip once set.
- **Per-class duration and price**: new optional fields on each class in `src/config/classes.ts` (`duration`, `price`) — currently shows "To be confirmed" on the classes page.
- **Weather policy for outdoor sessions** and **payment/cancellation terms**: new fields in `siteConfig.operationalFaq` — once filled in, they appear automatically as answers in the homepage FAQ. We did not invent these; the questions are currently simply not shown.

## 4. People

- **Coach/trainer profiles**: this was a specific ask in the redesign brief ("Meet the coach" with a real portrait, name and verified experience). We do **not** have this yet, so the homepage and About page currently show honest, non-invented copy ("every class is coached live... full profiles are on their way") instead of a fabricated bio. Send a name, a short description of coaching background/approach, and a real portrait photo, and we'll replace it — `siteConfig.trainers` in `src/config/site.ts`.
- **Nutritionist partner**: name, credentials and website so we can credit them on the Nutrition page.

## 5. Accounts and services (see docs/DEPLOYMENT.md)

- **Supabase**: done — project created, both migrations applied, admin account created and granted access, verified end-to-end.
- **Brevo**: done for now — API key generated, sender `paschalagency@gmail.com` verified and working. `ENQUIRY_NOTIFY_EMAIL` is temporarily that same address; swap it to the real owner inbox whenever ready.
- **New migration to run**: `supabase/migrations/20260920000001_enquiry_message_optional.sql` makes the enquiry form's Message field optional (per the redesign brief) — paste it into the Supabase SQL editor the same way as the first two.
- **Domain**: confirmed as managed in AWS Route 53. We need either the Route 53 hosted zone ID or console access to add two DNS records once you're ready to connect a custom domain.
- **GitHub**: code lives at [github.com/admin-ui-itz/Best-Touch-Fitness](https://github.com/admin-ui-itz/Best-Touch-Fitness).
- **Netlify**: live at `https://melodious-kitsune-b9f060.netlify.app` — see item 0 above for the one environment variable that needs correcting. Supabase/Brevo credentials are so far only in local `.env.local` (gitignored); they need adding to Netlify's environment variables too before the live enquiry form will actually work.

## 6. Things we will never add without your say-so

- Testimonials or reviews (none were supplied; none are shown).
- Claims about results, weight loss or medical benefits.
- A marketing email tick-box (disabled until you actually send newsletters; `marketingSignupEnabled`).
- A specific response-time promise (e.g. "we reply within 24 hours") — not shown anywhere, since it isn't confirmed.
