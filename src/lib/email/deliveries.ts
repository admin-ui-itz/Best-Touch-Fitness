import "server-only";

import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { EmailDeliveryRow, EmailKind, EnquiryRow } from "@/lib/supabase/types";

import { sendBrevoEmail } from "./brevo";
import { acknowledgementEmail, ownerNotificationEmail } from "./templates";

/** Bounded retries: 5 attempts with exponential backoff (2, 4, 8, 16 minutes). */
export const MAX_EMAIL_ATTEMPTS = 5;

export function backoffMs(attempt: number) {
  return Math.min(2 ** attempt, 32) * 60_000;
}

/**
 * Creates a delivery row per email kind for a stored enquiry. Idempotent:
 * the unique (enquiry_id, kind) index means re-running does not duplicate.
 */
export async function queueEnquiryEmails(enquiryId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  const kinds: EmailKind[] = ["acknowledgement", "owner_notification"];
  const { error } = await supabase
    .from("email_deliveries")
    .upsert(
      kinds.map((kind) => ({ enquiry_id: enquiryId, kind, max_attempts: MAX_EMAIL_ATTEMPTS })),
      { onConflict: "enquiry_id,kind", ignoreDuplicates: true },
    );
  if (error) console.error("[email] failed to queue deliveries", error.message);
}

function buildMessage(kind: EmailKind, enquiry: EnquiryRow) {
  if (kind === "acknowledgement") {
    const m = acknowledgementEmail(enquiry);
    return {
      to: [{ email: enquiry.email, name: enquiry.name }],
      subject: m.subject,
      htmlContent: m.html,
      textContent: m.text,
      replyTo: env.enquiryReplyToEmail ? { email: env.enquiryReplyToEmail } : undefined,
      tags: ["enquiry-acknowledgement"],
    };
  }
  if (!env.enquiryNotifyEmail) return null;
  const m = ownerNotificationEmail(enquiry, `${env.siteUrl}/admin/enquiries/${enquiry.id}`);
  return {
    to: [{ email: env.enquiryNotifyEmail }],
    subject: m.subject,
    htmlContent: m.html,
    textContent: m.text,
    replyTo: { email: enquiry.email, name: enquiry.name },
    tags: ["enquiry-owner-notification"],
  };
}

/**
 * Attempts one delivery and records the outcome. Never throws.
 * Returns the new status.
 */
export async function attemptDelivery(delivery: EmailDeliveryRow, enquiry: EnquiryRow) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return "pending" as const;
  if (delivery.status === "sent" || delivery.status === "abandoned") return delivery.status;

  const attempts = delivery.attempts + 1;
  const message = buildMessage(delivery.kind, enquiry);
  const result = message
    ? await sendBrevoEmail(message)
    : { ok: false as const, error: "ENQUIRY_NOTIFY_EMAIL is not configured.", retryable: true };

  if (result.ok) {
    await supabase
      .from("email_deliveries")
      .update({
        status: "sent",
        attempts,
        provider_message_id: result.messageId,
        last_error: null,
        sent_at: new Date().toISOString(),
      })
      .eq("id", delivery.id);
    return "sent" as const;
  }

  const exhausted = attempts >= delivery.max_attempts || !result.retryable;
  const status = exhausted ? "abandoned" : "failed";
  await supabase
    .from("email_deliveries")
    .update({
      status,
      attempts,
      last_error: result.error.slice(0, 1000),
      next_attempt_at: new Date(Date.now() + backoffMs(attempts)).toISOString(),
    })
    .eq("id", delivery.id);
  console.error(`[email] ${delivery.kind} for enquiry ${enquiry.id} ${status}: ${result.error}`);
  return status;
}

/** Sends all pending deliveries for a single enquiry (used right after submit). */
export async function sendQueuedEmailsForEnquiry(enquiryId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  const [{ data: enquiry }, { data: deliveries }] = await Promise.all([
    supabase.from("enquiries").select("*").eq("id", enquiryId).single(),
    supabase.from("email_deliveries").select("*").eq("enquiry_id", enquiryId).eq("status", "pending"),
  ]);
  if (!enquiry || !deliveries) return;
  await Promise.all(deliveries.map((d) => attemptDelivery(d, enquiry)));
}

/**
 * Retries due deliveries (status pending/failed, next_attempt_at in the
 * past) up to `limit`. Called by POST /api/email/retry and the admin UI.
 */
export async function retryDueDeliveries(limit = 25, opts: { force?: boolean; enquiryId?: string } = {}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { processed: 0, sent: 0, failed: 0, abandoned: 0, error: "Supabase not configured" };

  let query = supabase
    .from("email_deliveries")
    .select("*")
    .in("status", ["pending", "failed"])
    .order("next_attempt_at", { ascending: true })
    .limit(limit);
  if (!opts.force) query = query.lte("next_attempt_at", new Date().toISOString());
  if (opts.enquiryId) query = query.eq("enquiry_id", opts.enquiryId);

  const { data: deliveries, error } = await query;
  if (error) return { processed: 0, sent: 0, failed: 0, abandoned: 0, error: error.message };

  const summary = { processed: 0, sent: 0, failed: 0, abandoned: 0, error: null as string | null };
  for (const delivery of deliveries ?? []) {
    const { data: enquiry } = await supabase.from("enquiries").select("*").eq("id", delivery.enquiry_id).single();
    if (!enquiry) continue;
    const status = await attemptDelivery(delivery, enquiry);
    summary.processed += 1;
    if (status === "sent") summary.sent += 1;
    else if (status === "failed") summary.failed += 1;
    else if (status === "abandoned") summary.abandoned += 1;
  }
  return summary;
}
