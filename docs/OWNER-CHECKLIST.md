# Owner checklist: what we still need from you

Nothing on the live site is invented. Every item below is currently **hidden** or shown as a working title until you confirm it. Send the details and we will switch them on. All of these live in one file, `src/config/site.ts` (classes in `src/config/classes.ts`), so updates are quick.

## 1. Brand

| Item | Status | Where it appears |
| --- | --- | --- |
| Business name | **Confirmed**: "Best Touch Fitness" | Everywhere: header, footer, page titles, emails |
| Legal / trading name for the copyright line | Optional (defaults to "Best Touch Fitness" if not set) | Footer |
| Logo files (SVG preferred) | **Needed** | Header, footer, favicon, email header |
| Brand colours / fonts, if you have them | Optional | Whole site (provisional palette in use) |
| Licence confirmation for the 10 stock/reference photos (21.webp-30.webp) | **Needed** | Home hero, Bootcamp and Bums, Tums & Thighs photos — see `docs/ASSET-INVENTORY.md` batch 2 |

## 2. Contact details (all hidden until supplied)

| Item | Status | Where it appears |
| --- | --- | --- |
| Public email address | **Needed** | Footer, contact page, structured data |
| Public phone number | Optional | Footer, contact page |
| WhatsApp number (must be verified as active) | Optional | Contact page and footer "Message on WhatsApp" button |
| Training address / location | **Needed** for the map | Contact page, structured data |
| Google Maps embed link | Optional | Contact page map |
| Opening hours or session times | Optional | Contact page |
| Instagram / Facebook / TikTok / YouTube links | Optional | Footer |

## 3. Classes

- Confirmed classes shown now: **Bums, Tums & Thighs**, **Bootcamp**, **Senior Circuit**.
- Please check the short descriptions in `src/config/classes.ts` and tell us anything that is wrong. We have avoided stating durations, prices or specific exercises because none were supplied.
- **Spin** and **Step** are hidden. Once you want to advertise them, we can show a "Coming soon" label (no dates, no bookings) by setting `showComingSoonClasses` to `true`. When they launch, tell us the details and we publish them properly.
- **Weekly timetable**: hidden until you provide real days and times (`timetable` in `src/config/site.ts`).
- **Prices / membership options**: not shown anywhere. Send them if you want them published.

## 4. People

- **Trainers**: names, roles, a short bio and any qualifications you want listed. Hidden until supplied.
- **Nutritionist partner**: name, credentials and website so we can credit them on the Nutrition page. The site already makes clear that meal plans and advice come from your partner, not from you.

## 5. Accounts and services we need access to (see docs/DEPLOYMENT.md)

- **Supabase** project (database and admin sign-in). We create the admin user for you; there is no public sign-up.
- **Brevo** account with a **verified sender** (the address enquiry emails come from) and the email address that should receive new-enquiry notifications.
- **Domain**: confirmed as managed in AWS Route 53. We need either the Route 53 hosted zone ID (to add two DNS records) or someone with console access to add them. Also tell us about any existing email on the domain so we do not disturb it.
- **GitHub**: code lives at [github.com/admin-ui-itz/Best-Touch-Fitness](https://github.com/admin-ui-itz/Best-Touch-Fitness) (confirmed, access granted).
- **Netlify**: connect that GitHub repo to your Netlify account via Netlify's "Import from Git" flow, or issue a scoped personal access token — see `docs/DEPLOYMENT.md` section 1. We never ask for or accept an account password.

## 6. Things we will never add without your say-so

- Testimonials or reviews (none were supplied; none are shown).
- Claims about results, weight loss or medical benefits.
- A marketing email tick-box (disabled until you actually send newsletters; `marketingSignupEnabled`).
