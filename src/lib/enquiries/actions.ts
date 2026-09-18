"use server";

import { headers } from "next/headers";

import { queueEnquiryEmails, sendQueuedEmailsForEnquiry } from "@/lib/email/deliveries";
import { getIntegrationStatus } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

import { checkBurstLimit, checkHourlyLimit, extractClientIp, hashIp } from "./rate-limit";
import { MIN_FILL_TIME_MS, parseEnquiryFormData, type EnquiryFieldErrors, type EnquiryInput } from "./schema";

export type EnquiryActionState = {
  status: "idle" | "success" | "error";
  /** Form-level message (shown in an alert region). */
  message?: string;
  fieldErrors?: EnquiryFieldErrors;
  /** Echoed values so the form keeps what the user typed after a server error. */
  values?: Partial<EnquiryInput>;
  /** Present on success: the stored enquiry id (for reference only). */
  enquiryId?: string;
};

const GENERIC_ERROR =
  "Sorry, we could not send your enquiry just now. Nothing was submitted; please try again in a moment.";

/**
 * Server Action behind the enquiry form.
 *
 * Order matters:
 *  1. validate + spam checks (honeypot, timing, rate limits)
 *  2. persist to Supabase (idempotent on client_token)
 *  3. only then report success
 *  4. queue + attempt emails; failures are recorded for retry and never
 *     turn a stored enquiry into a user-facing error
 */
export async function submitEnquiry(_prev: EnquiryActionState, formData: FormData): Promise<EnquiryActionState> {
  const parsed = parseEnquiryFormData(formData);
  const echo = {
    name: parsed.raw.name,
    email: parsed.raw.email,
    phone: parsed.raw.phone,
    interest: parsed.raw.interest,
    message: parsed.raw.message,
    marketingConsent: parsed.raw.marketingConsent,
  };

  if (!parsed.ok) {
    // Honeypot / token failures are reported generically, without hints for bots.
    if (parsed.fieldErrors.website || parsed.fieldErrors.clientToken || parsed.fieldErrors.renderedAt) {
      return { status: "error", message: GENERIC_ERROR, values: echo };
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
      values: echo,
    };
  }
  const { values } = parsed;

  // Timing check: real people need more than a few seconds.
  if (Date.now() - values.renderedAt < MIN_FILL_TIME_MS) {
    return { status: "error", message: GENERIC_ERROR, values: echo };
  }

  const integrations = getIntegrationStatus();
  const supabase = getSupabaseAdmin();
  if (!integrations.enquiries || !supabase) {
    // Never simulate success. The owner/developer sees this clearly.
    return {
      status: "error",
      message:
        "The enquiry service is not yet configured on this site, so your message was not sent. Please try again later.",
      values: echo,
    };
  }

  const requestHeaders = await headers();
  const ip = extractClientIp(requestHeaders);
  const ipHash = hashIp(ip);
  const burstKey = ipHash ?? "anonymous";

  if (!checkBurstLimit(burstKey) || !(await checkHourlyLimit(ipHash))) {
    return {
      status: "error",
      message: "You have sent a few enquiries recently. Please wait a little while before trying again.",
      values: echo,
    };
  }

  // Persist first. The unique client_token makes a double-submit (or a retry
  // after a flaky network) resolve to the same stored row.
  const { data: inserted, error: insertError } = await supabase
    .from("enquiries")
    .insert({
      name: values.name,
      email: values.email,
      phone: values.phone,
      interest: values.interest,
      message: values.message,
      marketing_consent: values.marketingConsent,
      client_token: values.clientToken,
      ip_hash: ipHash,
      user_agent: requestHeaders.get("user-agent")?.slice(0, 500) ?? null,
    })
    .select("id")
    .single();

  let enquiryId: string | null = inserted?.id ?? null;

  if (insertError) {
    if (insertError.code === "23505") {
      // Duplicate client_token: the first submission already succeeded.
      const { data: existing } = await supabase
        .from("enquiries")
        .select("id")
        .eq("client_token", values.clientToken)
        .single();
      enquiryId = existing?.id ?? null;
    } else {
      console.error("[enquiry] insert failed", insertError.message);
      return { status: "error", message: GENERIC_ERROR, values: echo };
    }
  }

  if (!enquiryId) {
    return { status: "error", message: GENERIC_ERROR, values: echo };
  }

  // Emails are best-effort here; the retry endpoint picks up anything that fails.
  try {
    await queueEnquiryEmails(enquiryId);
    await sendQueuedEmailsForEnquiry(enquiryId);
  } catch (err) {
    console.error("[enquiry] email step failed (enquiry stored)", err);
  }

  return {
    status: "success",
    enquiryId,
    message:
      "Thanks, we have received your enquiry. Someone from the team will reply personally. This is not a booking; no class place has been reserved yet.",
  };
}
