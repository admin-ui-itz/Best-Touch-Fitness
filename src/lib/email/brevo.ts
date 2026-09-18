import "server-only";

import { env } from "@/lib/env";

export type BrevoMessage = {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent: string;
  replyTo?: { email: string; name?: string };
  tags?: string[];
};

export type BrevoResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string; retryable: boolean };

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

/**
 * Sends one transactional email through Brevo's REST API.
 * Never throws: returns a structured result so callers can record the
 * attempt and decide whether to retry.
 */
export async function sendBrevoEmail(message: BrevoMessage): Promise<BrevoResult> {
  if (!env.brevoApiKey || !env.brevoSenderEmail) {
    return { ok: false, error: "Brevo is not configured (BREVO_API_KEY / BREVO_SENDER_EMAIL).", retryable: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": env.brevoApiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: env.brevoSenderEmail, name: env.brevoSenderName },
        to: message.to,
        replyTo: message.replyTo,
        subject: message.subject,
        htmlContent: message.htmlContent,
        textContent: message.textContent,
        tags: message.tags,
      }),
      signal: controller.signal,
    });

    if (response.ok) {
      const body = (await response.json().catch(() => ({}))) as { messageId?: string };
      return { ok: true, messageId: body.messageId ?? "unknown" };
    }

    const text = await response.text().catch(() => "");
    // 4xx (other than 429) means the request itself is wrong; retrying will not help.
    const retryable = response.status === 429 || response.status >= 500;
    return { ok: false, error: `Brevo ${response.status}: ${text.slice(0, 300)}`, retryable };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Brevo request failed: ${msg}`, retryable: true };
  } finally {
    clearTimeout(timeout);
  }
}
