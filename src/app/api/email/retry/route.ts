import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { retryDueDeliveries } from "@/lib/email/deliveries";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorised(request: Request) {
  const secret = env.emailRetrySecret;
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Bounded email retry. Call from a Coolify scheduled task (or manually):
 *   curl -X POST -H "Authorization: Bearer $EMAIL_RETRY_SECRET" https://<host>/api/email/retry
 * Processes deliveries whose next_attempt_at has passed, up to 25 per call.
 */
export async function POST(request: Request) {
  if (!authorised(request)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const summary = await retryDueDeliveries(25);
  return NextResponse.json(summary, { headers: { "Cache-Control": "no-store" } });
}
