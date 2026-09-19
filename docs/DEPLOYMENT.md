# Deployment: Netlify + AWS Route 53

The site deploys to Netlify using the official Next.js runtime (`@netlify/plugin-nextjs`, declared in `netlify.toml` and `package.json`). It builds straight from the standard `.next` output — no Docker image, no VM. Supabase and Brevo remain external managed services. The domain's DNS is authoritative in **AWS Route 53**; Netlify only needs records pointed at it there.

> This project previously targeted Coolify on a Google Cloud VM. That path (Dockerfile, Coolify scheduled tasks) has been removed in favour of Netlify, per the change of hosting plan. If anything below assumes information nobody has confirmed yet, it says so explicitly rather than guessing.

## 1. Netlify account and site access

The Netlify account that will host this site may be different from whoever is reading this. **Never share that account's password with anyone or anything, including an AI assistant** — nothing here should ever need it. There are two clean ways to connect this repository:

**Option A — Import from Git (simplest, no tokens needed)**

1. Sign in to Netlify at app.netlify.com with the account that should own this site.
2. **Add new site > Import an existing project > Deploy with GitHub.**
3. Authorise Netlify's GitHub App for the `admin-ui-itz/Best-Touch-Fitness` repository only (not all repos).
4. Netlify reads `netlify.toml` automatically — build command and the Next.js plugin are already configured. No "publish directory" needs setting.
5. Add the environment variables from section 2 under **Site configuration > Environment variables** before the first real deploy.

**Option B — Personal access token (if you want deploys automated from outside Netlify's UI, e.g. from this assistant or CI)**

1. In Netlify: **User settings > Applications > Personal access tokens > New access token.**
2. Give it a name and copy the token once (Netlify won't show it again).
3. Set it as `NETLIFY_AUTH_TOKEN` wherever the deploy runs (a CI secret, or a local `.env` never committed). This token is scoped to your Netlify account, not your login password, and can be revoked at any time from the same page.
4. Link and deploy with the CLI:

   ```bash
   npx netlify-cli link          # choose "Use current git remote" or paste the site ID
   npx netlify-cli deploy --build --prod
   ```

Either option works; Option A is enough for most cases and needs nothing handed to anyone else.

## 2. Environment variables

Unlike a Docker host, Netlify does **not** cleanly separate "build-time" from "runtime" — everything set under **Site configuration > Environment variables** is available both when Netlify runs `next build` and inside the deployed Functions. `NEXT_PUBLIC_*` values still end up in the browser bundle (because Next.js inlines them at build time), so treat them as public regardless of where they're set. Secrets should still only be the non-`NEXT_PUBLIC_` ones.

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, e.g. `https://www.example.com`. Used for canonical URLs, sitemap, Open Graph and admin links in emails. |
| `NEXT_PUBLIC_SITE_ENV` | `production` enables indexing. Any other value (e.g. `staging`) sends `X-Robots-Tag: noindex` and a disallow-all robots.txt. Set this to `staging` on Netlify deploy previews / branch deploys. |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase project settings. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon / publishable key. Safe to expose; RLS protects data. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret.** Required to store enquiries. Mark "Contains secret values" in Netlify so it's redacted from build logs. |
| `BREVO_API_KEY` | **Secret.** Brevo v3 API key (SMTP & API section). |
| `BREVO_SENDER_EMAIL` | Must be a verified sender in Brevo. |
| `BREVO_SENDER_NAME` | Display name on emails. |
| `ENQUIRY_NOTIFY_EMAIL` | Where owner notifications go. |
| `ENQUIRY_REPLY_TO_EMAIL` | Optional reply-to for acknowledgements. |
| `ENQUIRY_IP_HASH_SECRET` | **Secret.** Random 32+ chars. IPs are HMAC-hashed before storage. |
| `EMAIL_RETRY_SECRET` | **Secret.** Bearer token for `POST /api/email/retry`. |

Generate secrets with:

```bash
openssl rand -base64 48
```

`.env.example` lists every variable with placeholders only. In Netlify, you can scope values differently per deploy context (production vs. deploy previews) under the same Environment variables screen if you want deploy previews to use a separate Supabase project.

## 3. HTTPS

Netlify provisions and renews a Let's Encrypt certificate automatically for any domain added under **Domain management**, once DNS points at Netlify (see section 6). No reverse proxy configuration is needed on your side. Netlify sets `X-Forwarded-For`, which the app uses for enquiry rate limiting.

The app also sets its own security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) — both in `next.config.ts` and again in `netlify.toml`, so they apply even to pages served straight from Netlify's CDN.

## 4. Supabase setup and migrations

1. Create a Supabase project. Note the URL, anon key and service role key.
2. Apply migrations, in order, from `supabase/migrations/`:
   - `20260918000001_enquiries.sql`
   - `20260918000002_email_deliveries.sql`

   Either paste each file into the SQL editor, or use the CLI:

   ```bash
   npx supabase login
   npx supabase link --project-ref <project-ref>
   npx supabase db push
   ```

3. Create the admin user: **Authentication > Users > Add user** (email + password, "auto confirm"). Public sign-up is not used anywhere; you may also disable it under Authentication > Providers > Email.
4. Grant admin access by inserting the user's id:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'owner@example.com';
   ```

Future schema changes: add a new timestamped file in `supabase/migrations/`; never edit an applied migration. Apply with `supabase db push` (staging first).

Privacy model: `anon` has no access to any table. Enquiries are inserted only by the server using the service role. Admins read/update (status and notes only) through RLS policies backed by `admin_users`.

**Recommendation: keep Supabase Auth for the admin area.** It's already built and tested against the `admin_users` / RLS model, it works identically regardless of host, and it needs no extra service. Netlify's own "Netlify Identity" product has been sunset (no new sites can adopt it) — do not use it. If a broader auth need ever comes up (customer accounts, social login, SSO), Supabase Auth already supports that without re-architecting the admin area.

## 5. Brevo setup

1. Create a Brevo account and an API key (SMTP & API > API keys).
2. **Verify the sender.** Either verify a single address (Senders & IP > Senders) or, preferably, authenticate the whole domain (Senders & IP > Domains > Add a domain). Brevo will show the exact DNS records to add, typically:
   - a **TXT** record for domain verification (`brevo-code:` value),
   - a **TXT** record for DKIM (Brevo's `mail._domainkey` selector),
   - optionally a **TXT** record for DMARC.

   Copy the values **exactly as Brevo displays them** for your account and add them in Route 53 (section 6); they are unique per account and are not reproduced here.
3. Set `BREVO_SENDER_EMAIL` to the verified address and redeploy (or just wait — env var changes on Netlify take effect on the next deploy/function cold start; trigger a redeploy to be sure).
4. Send a test enquiry and check `/admin` shows both deliveries as "sent".

Do not remove or alter existing MX, SPF or DKIM records for the domain's current email provider. If SPF already exists, add Brevo's include (`include:spf.brevo.com`, as shown in the Brevo dashboard) to the existing record rather than creating a second SPF record.

## 6. Domain connection: Route 53 → Netlify

The domain's authoritative DNS is **AWS Route 53** (confirmed). Netlify does not need to be the registrar or the nameserver host — it just needs specific records added in the Route 53 hosted zone for this domain.

1. In Netlify: **Domain management > Add a domain** and enter the domain (and `www` subdomain if wanted).
2. Netlify will show a **"Set up Netlify DNS"** option and an **"Use external DNS"** option. Choose **external DNS** — you're keeping Route 53 authoritative, not delegating nameservers to Netlify.
3. Netlify will display the exact records to add. As of writing this is normally:
   - An **A** record on the apex (`example.com`) pointing at Netlify's load balancer IP, shown live on that screen.
   - A **CNAME** record on `www` pointing at `<your-site-name>.netlify.app`.

   **Use the values Netlify shows you at setup time, not any IP address written in older documentation** — Netlify's load-balancer IP can change, and copying a stale value is a common cause of sites going down after a migration.
4. In the **Route 53 console**, open the hosted zone for the domain and add exactly those records:
   - Route 53 apex records are created as type **A**, "Alias" toggled **off** unless you're pointing at another AWS resource (you're not — Netlify's IP is external, so use a plain A record, not an ALIAS).
   - The `www` record is a standard **CNAME**.
5. **Do not touch** any existing `MX`, `TXT` (SPF/DKIM/DMARC), or other `CNAME` records in that hosted zone — those almost certainly belong to the domain's current email or other services and are unrelated to this change.
6. Wait for DNS propagation (usually minutes with Route 53, can take longer depending on prior TTLs), then confirm in Netlify's Domain management screen that the domain shows as verified and HTTPS certificate as issued.

I have not made any Route 53 changes myself — I don't have AWS access, and DNS changes on a live domain are worth doing deliberately with your own eyes on the hosted zone. If you'd rather I did it directly, the safe way is a scoped IAM user/role with `route53:ChangeResourceRecordSets` permission on just this hosted zone (not root/admin credentials), handed over as an access key pair; I'd still confirm the exact record values with you before submitting the change.

## 7. Email retries

Failed deliveries are stored in `email_deliveries` and retried with exponential backoff, at most 5 attempts. Trigger retries either:

- from `/admin/enquiries/<id>` ("Retry now"), or
- on a schedule via an external cron, since Netlify's own Scheduled Functions are separate function files rather than something you attach to an existing Next.js route handler. Any of these work:
  - A GitHub Actions workflow in this repo on a `schedule:` cron trigger, calling the endpoint with `curl`.
  - A free external cron service (e.g. cron-job.org) hitting the endpoint every 10–15 minutes.

  ```bash
  curl -X POST -H "Authorization: Bearer $EMAIL_RETRY_SECRET" https://<domain>/api/email/retry
  ```

## 8. Health checks, logs, backups, rollback

- **Health**: `GET /api/health` returns `{ status: "ok", integrations: { ... } }` — booleans only, no secret values. Point an external uptime monitor (UptimeRobot, Better Uptime, etc.) at it if you want alerting; Netlify itself doesn't require a healthcheck to serve traffic.
- **Logs**: Netlify > Site > Logs > **Function logs** shows server-side output (Server Actions, Route Handlers, middleware). Email failures are logged as `[email] ...`, enquiry failures as `[enquiry] ...`, rate-limit RPC failures as `[rate-limit] ...`. **Deploy logs** show the build output separately.
- **Backups**: enquiry data lives in Supabase. Enable Supabase's automated backups (Pro plan) or schedule `pg_dump` via the Supabase CLI. Netlify itself holds no application state — every deploy is rebuilt from Git.
- **Rollback**: Netlify keeps every previous deploy. **Deploys > (pick an earlier one) > Publish deploy** instantly rolls back, no rebuild needed. Database migrations are forward-only; write a new migration to undo a schema change.
- **Staging**: Netlify's own **branch deploys** and **deploy previews** (automatic on pull requests) act as staging out of the box. Set `NEXT_PUBLIC_SITE_ENV=staging` for the non-production deploy context under Environment variables, so previews send noindex headers and show the integration banner. Point previews at a separate Supabase project if you want fully isolated data.

## 9. Local development

```bash
cp .env.example .env.local   # fill in real values, or leave placeholders to preview without integrations
npm install
npm run dev
```

Without Supabase/Brevo values the public site renders fully, the enquiry form explains that enquiries are not live, and the admin area reports that it is not configured. Nothing is simulated.

Checks: `npm run check` runs typecheck, lint, unit tests and a production build (`next build`, which passes cleanly).

### Known gap: `netlify build`/`netlify dev` on native Windows

Running `npx netlify-cli build` **on native Windows** currently fails at the "Edge Functions bundling" step, where it tries to package `src/proxy.ts` (the admin-session middleware) as a Netlify Edge Function. The error is a module-resolution failure with a visibly malformed, duplicated file path in its stack trace — the signature of a path-handling bug in the CLI's local esbuild/edge-runtime emulator, not a real missing file. `next build` itself (the actual compiler Netlify runs) completes with no errors on the same machine, and Netlify's own docs note that native Windows support for their local tooling is limited and recommend WSL2 for it.

This has **not** been confirmed against Netlify's real (Linux) build infrastructure — that only happens on an actual deploy, which needs the site connected per section 1. Two ways to get a stronger signal before the first real deploy, if wanted:

- Run `npx netlify-cli build --offline` inside WSL2 instead of native Windows.
- Just do the first real Netlify deploy from a `deploy-preview`/branch context and watch the **Edge Functions bundling** step in the deploy log specifically. If it fails there too, the fix is almost certainly on Netlify/Next's side (open a ticket referencing Next.js 16 + `@netlify/plugin-nextjs` middleware bundling) rather than anything in this app's code, since the middleware itself (`src/proxy.ts`) is a small, dependency-free file.

## 10. Open items before go-live

- Confirm which Netlify account owns/will own this site long-term, and whether the assistant should have a Netlify personal access token (see section 1, Option B) for automated deploys, or whether deploys stay manual/CI-driven from GitHub.
- Confirm the exact domain name and get the Route 53 hosted zone ID or console access to add the two DNS records in section 6.
- Brevo sender/domain verification (section 5) still needs to happen before enquiry emails will send in production.
