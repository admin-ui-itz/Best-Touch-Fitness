import "server-only";

/**
 * Server-side environment access. Secrets never leave this module as values;
 * only boolean "configured" flags are exposed to UI code.
 */

function read(name: string): string | null {
  const value = process.env[name];
  if (!value || value.trim() === "") return null;
  return value.trim();
}

const placeholderPatterns = [/^your-/i, /^change-me/i, /^xkeysib-your/i, /example\.com$/i];

/** Treat obvious .env.example placeholders as unset so nothing "half works". */
function real(name: string): string | null {
  const value = read(name);
  if (!value) return null;
  if (placeholderPatterns.some((p) => p.test(value))) return null;
  return value;
}

export const env = {
  siteUrl: (read("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000").replace(/\/$/, ""),
  siteEnv: read("NEXT_PUBLIC_SITE_ENV") ?? "development",
  get isProduction() {
    return this.siteEnv === "production";
  },

  supabaseUrl: real("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: real("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: real("SUPABASE_SERVICE_ROLE_KEY"),

  brevoApiKey: real("BREVO_API_KEY"),
  brevoSenderEmail: real("BREVO_SENDER_EMAIL"),
  brevoSenderName: read("BREVO_SENDER_NAME") ?? "Best Touch Fitness",
  enquiryNotifyEmail: real("ENQUIRY_NOTIFY_EMAIL"),
  enquiryReplyToEmail: real("ENQUIRY_REPLY_TO_EMAIL"),

  ipHashSecret: real("ENQUIRY_IP_HASH_SECRET"),
  emailRetrySecret: real("EMAIL_RETRY_SECRET"),
};

export type IntegrationStatus = {
  /** Public Supabase client (auth) can be created. */
  supabaseAuth: boolean;
  /** Service-role client can be created (required to store enquiries). */
  supabaseAdmin: boolean;
  /** Brevo can send email. */
  brevo: boolean;
  /** Owner notification address is set. */
  ownerNotification: boolean;
  /** IP hashing secret present (rate limiting is disabled without it). */
  rateLimiting: boolean;
  /** Everything required for the public enquiry form to work end to end. */
  enquiries: boolean;
};

export function getIntegrationStatus(): IntegrationStatus {
  const supabaseAuth = Boolean(env.supabaseUrl && env.supabaseAnonKey);
  const supabaseAdmin = Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
  const brevo = Boolean(env.brevoApiKey && env.brevoSenderEmail);
  const ownerNotification = Boolean(env.enquiryNotifyEmail);
  const rateLimiting = Boolean(env.ipHashSecret);
  return {
    supabaseAuth,
    supabaseAdmin,
    brevo,
    ownerNotification,
    rateLimiting,
    // Email is intentionally NOT required: enquiries must persist even when
    // email is down; failures are recorded in email_deliveries and retried.
    enquiries: supabaseAdmin,
  };
}

/** Human-readable list of what is missing, for staging banners and admin. */
export function listUnconfiguredIntegrations(): string[] {
  const s = getIntegrationStatus();
  const missing: string[] = [];
  if (!s.supabaseAdmin) missing.push("Supabase (service role): enquiries cannot be stored");
  if (!s.supabaseAuth) missing.push("Supabase (public keys): admin sign-in unavailable");
  if (!s.brevo) missing.push("Brevo: emails will be queued as failed until configured");
  if (!s.ownerNotification) missing.push("ENQUIRY_NOTIFY_EMAIL: owner notifications have no recipient");
  if (!s.rateLimiting) missing.push("ENQUIRY_IP_HASH_SECRET: rate limiting disabled");
  return missing;
}
