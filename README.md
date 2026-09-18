# GYM website (working title)

Marketing site and enquiry workflow for an outdoor group-training gym. Built with Next.js 16 (App Router, TypeScript), Tailwind CSS 4, Supabase (Postgres + Auth), Brevo (transactional email) and React Three Fiber for a small hero accent. Deployed as a Docker container on Coolify.

## Quick start

```bash
npm install
cp .env.example .env.local     # placeholders are fine for a preview
npm run dev                    # http://localhost:3000
npm run check                  # typecheck + lint + unit tests + production build
```

## Structure

```
src/
  app/                 routes (App Router)
    (site)/            public pages: home, classes, about, nutrition, gallery, contact
    admin/             protected enquiry admin (Supabase Auth + admin_users)
    api/health         liveness probe
    api/email/retry    bounded email retry (bearer secret)
  components/          UI, layout, gallery lightbox, enquiry form, 3D accent
  config/              ALL business facts live here (site.ts, classes.ts, photos.ts)
  lib/                 env, seo, supabase clients, enquiry action + validation,
                       rate limiting, Brevo email + delivery tracking, admin auth
  assets/photos/       optimised photographs (static imports)
supabase/migrations/   versioned SQL (RLS, grants, functions)
scripts/               image preparation
docs/                  DEPLOYMENT, OWNER-CHECKLIST, ASSET-INVENTORY
```

## Key decisions

- **No invented facts.** Contact details, address, hours, prices, timetable, trainers and the nutritionist's name are `null` in `src/config/site.ts` and their sections are hidden until supplied. See `docs/OWNER-CHECKLIST.md`.
- **Spin and Step** exist in `classes.ts` with status `coming-soon` but are hidden unless `showComingSoonClasses` is `true`; they are never selectable in the enquiry form.
- **Enquiry flow**: validate (zod) > honeypot + timing + burst and hourly rate limits > insert into Supabase (unique client token makes double submits idempotent) > report success > queue and attempt two Brevo emails, tracked in `email_deliveries` with up to 5 retries. Email failure never loses or duplicates an enquiry.
- **Admin**: no public registration. `requireAdmin()` validates the JWT with Supabase and checks `admin_users` on every page and action; RLS limits admins to reading enquiries and updating `status`/`notes`.
- **3D accent** loads only on viewports 1024px and wider, without reduced-motion or Save-Data, with WebGL available, and after the browser is idle. A static SVG is shown otherwise and until the scene is ready. Rendering pauses when off-screen or the tab is hidden.
- **Motion** is CSS-only (entrance transitions via a tiny IntersectionObserver component, `prefers-reduced-motion` respected). No animation library.
- **SEO**: per-route metadata, canonical URLs, Open Graph image, sitemap and robots. Non-production environments send `noindex` headers and a disallow-all robots.txt.
- **Provisional design system** (no branding supplied): charcoal, warm white, electric-lime accent; Archivo for display, Manrope for body.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript) |
| `npm run test` | Vitest unit tests (validation, rate limiting, email templates) |
| `npm run images:prepare <dir>` | Re-encode and strip metadata from supplied photos |

## Deployment

See `docs/DEPLOYMENT.md` for Coolify settings, environment variables, migrations, Brevo sender verification, DNS, health checks, logs, backups and rollback.
