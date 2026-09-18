# Deployment: Coolify on a Google Cloud VM

The site ships as a single Docker container built from `Dockerfile` (Next.js standalone output, non-root user, health check). Supabase and Brevo are external managed services. Nothing depends on Vercel or Netlify.

## 1. Coolify application settings

| Setting | Value |
| --- | --- |
| Source | This Git repository, branch `main` |
| Build pack | **Dockerfile** |
| Dockerfile location | `/Dockerfile` |
| Port (exposed) | `3000` |
| Health check path | `/api/health` (HTTP 200, JSON) |
| Health check interval | 30s, start period 20s |
| Domain | `https://<your-domain>` (Coolify's Traefik proxy terminates TLS) |

Docker Compose is not needed. Coolify builds the image on the VM; allow ~2 GB RAM free during builds (three.js and sharp are the heaviest steps). If the VM is small, enable swap or build on a larger machine and push to a registry.

## 2. Environment variables

`NEXT_PUBLIC_*` values are compiled into the browser bundle, so they must be present **at build time**. Everything else is read **at runtime** by the server and can be changed in Coolify without rebuilding (restart the container).

| Variable | When | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Build | Canonical origin, e.g. `https://www.example.com`. Used for canonical URLs, sitemap, Open Graph and admin links in emails. |
| `NEXT_PUBLIC_SITE_ENV` | Build | `production` enables indexing. Any other value (e.g. `staging`) sends `X-Robots-Tag: noindex` and a disallow-all robots.txt. |
| `NEXT_PUBLIC_SUPABASE_URL` | Build | From Supabase project settings. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build | Public anon / publishable key. Safe to expose; RLS protects data. |
| `SUPABASE_SERVICE_ROLE_KEY` | Runtime | **Secret.** Server only. Required to store enquiries. |
| `BREVO_API_KEY` | Runtime | **Secret.** Brevo v3 API key (SMTP & API section). |
| `BREVO_SENDER_EMAIL` | Runtime | Must be a verified sender in Brevo. |
| `BREVO_SENDER_NAME` | Runtime | Display name on emails. |
| `ENQUIRY_NOTIFY_EMAIL` | Runtime | Where owner notifications go. |
| `ENQUIRY_REPLY_TO_EMAIL` | Runtime | Optional reply-to for acknowledgements. |
| `ENQUIRY_IP_HASH_SECRET` | Runtime | **Secret.** Random 32+ chars. IPs are HMAC-hashed before storage. |
| `EMAIL_RETRY_SECRET` | Runtime | **Secret.** Bearer token for `POST /api/email/retry`. |

In Coolify, tick **"Build variable"** for the four `NEXT_PUBLIC_*` entries so they are passed as Docker build args (the Dockerfile declares matching `ARG`s). Leave the secrets as runtime-only.

Generate secrets with:

```bash
openssl rand -base64 48
```

`.env.example` lists every variable with placeholders only.

## 3. HTTPS and reverse proxy

Coolify's bundled Traefik proxy handles TLS (Let's Encrypt) and forwards to the container on port 3000. Requirements on the VM:

- Google Cloud firewall rules allowing TCP 80 and 443 to the VM (and 8000 for the Coolify dashboard, ideally restricted to your IP).
- DNS `A` record for the site hostname pointing at the VM's **static external IP** (reserve a static IP in Google Cloud so it does not change on restart).
- In Coolify, set the FQDN with `https://` and enable "Force HTTPS". Traefik sets `X-Forwarded-For`, which the app uses for rate limiting.

The app also sets its own security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) in `next.config.ts`.

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

## 5. Brevo setup

1. Create a Brevo account and an API key (SMTP & API > API keys).
2. **Verify the sender.** Either verify a single address (Senders & IP > Senders) or, preferably, authenticate the whole domain (Senders & IP > Domains > Add a domain). Brevo will show the exact DNS records to add. They are typically:
   - a **TXT** record for domain verification (`brevo-code:` value),
   - a **TXT** record for DKIM (Brevo's `mail._domainkey` selector),
   - optionally a **TXT** record for DMARC.

   Copy the values **exactly as Brevo displays them** for your account; they are unique per account and are not reproduced here.
3. Set `BREVO_SENDER_EMAIL` to the verified address and restart the app.
4. Send a test enquiry and check `/admin` shows both deliveries as "sent".

Do not remove or alter existing MX, SPF or DKIM records for the domain's current email provider. If SPF already exists, add Brevo's include (`include:spf.brevo.com`, as shown in the Brevo dashboard) to the existing record rather than creating a second SPF record.

## 6. Email retries

Failed deliveries are stored in `email_deliveries` and retried with exponential backoff, at most 5 attempts. Trigger retries either:

- from `/admin/enquiries/<id>` ("Retry now"), or
- on a schedule. In Coolify, add a **Scheduled Task** on the application (e.g. every 10 minutes):

  ```bash
  wget -qO- --post-data='' --header="Authorization: Bearer $EMAIL_RETRY_SECRET" http://127.0.0.1:3000/api/email/retry
  ```

  or from any external cron with `curl -X POST -H "Authorization: Bearer <secret>" https://<domain>/api/email/retry`.

## 7. Domain connection (after confirming the DNS provider)

The registrar was mentioned as possibly GoDaddy, but **this is unconfirmed**, and the registrar is not necessarily where the authoritative nameservers live. Before changing anything:

1. Run `nslookup -type=NS <domain>` (or `dig NS <domain>`) to see which nameservers are authoritative.
2. Log in to **that** provider.
3. Add `A` records for the apex (`@`) and `www` pointing to the VM's static IP. If the provider does not support apex `A` records well, use its ALIAS/ANAME feature.
4. Do **not** touch existing `MX`, `TXT` (SPF/DKIM/DMARC) or `CNAME` records used by email or other services.
5. In Coolify, add both `https://example.com` and `https://www.example.com` as domains (or redirect one to the other) and let Traefik issue certificates once DNS resolves.

## 8. Health checks, logs, backups, rollback

- **Health**: `GET /api/health` returns `{ status: "ok", integrations: { ... } }`. The integration flags are booleans only. The Docker `HEALTHCHECK` uses the same endpoint.
- **Logs**: Coolify > Application > Logs streams container stdout/stderr. Email failures are logged as `[email] ...`, enquiry failures as `[enquiry] ...`, rate-limit RPC failures as `[rate-limit] ...`.
- **Backups**: enquiry data lives in Supabase. Enable Supabase's automated backups (Pro plan) or schedule `pg_dump` via the Supabase CLI. The app container is stateless; the image is rebuilt from Git.
- **Rollback**: Coolify keeps previous images. Use **Deployments > Redeploy** on an earlier successful deployment, or revert the Git commit and push. Database migrations are forward-only; write a new migration to undo a change.
- **Staging**: deploy the same repository as a second Coolify app with `NEXT_PUBLIC_SITE_ENV=staging` and its own Supabase project. It will send noindex headers and show the integration banner.

## 9. Local development

```bash
cp .env.example .env.local   # fill in real values, or leave placeholders to preview without integrations
npm install
npm run dev
```

Without Supabase/Brevo values the public site renders fully, the enquiry form explains that enquiries are not live, and the admin area reports that it is not configured. Nothing is simulated.

Checks: `npm run check` runs typecheck, lint, unit tests and a production build.

## 10. Container build (reference)

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://www.example.com \
  --build-arg NEXT_PUBLIC_SITE_ENV=production \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=... \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -t gym-website .
docker run --rm -p 3000:3000 --env-file .env.local gym-website
```
