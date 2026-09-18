import "server-only";

import { createHmac } from "node:crypto";

import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/** Limits applied per hashed IP. */
export const RATE_LIMITS = {
  /** In-memory burst guard (per process). */
  burst: { max: 3, windowMs: 60_000 },
  /** Persistent guard (per database), survives restarts and multiple replicas. */
  hourly: { max: 5, windowMs: 60 * 60_000 },
};

/** Hash IPs so raw addresses are never stored. */
export function hashIp(ip: string | null): string | null {
  if (!ip || !env.ipHashSecret) return null;
  return createHmac("sha256", env.ipHashSecret).update(ip).digest("hex");
}

export function extractClientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || null;
}

// --- In-memory sliding window (burst protection) ---------------------------
const buckets = new Map<string, number[]>();

export function checkBurstLimit(key: string, now = Date.now()): boolean {
  const { max, windowMs } = RATE_LIMITS.burst;
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  // Opportunistic cleanup so the map never grows unbounded.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return true;
}

/** Test helper. */
export function _resetBurstLimits() {
  buckets.clear();
}

// --- Database-backed hourly limit -----------------------------------------
export async function checkHourlyLimit(ipHash: string | null): Promise<boolean> {
  if (!ipHash) return true; // cannot identify the client; burst guard still applies
  const supabase = getSupabaseAdmin();
  if (!supabase) return true;
  const since = new Date(Date.now() - RATE_LIMITS.hourly.windowMs).toISOString();
  const { data, error } = await supabase.rpc("count_recent_enquiries", {
    p_ip_hash: ipHash,
    p_since: since,
  });
  if (error) {
    console.error("[rate-limit] count_recent_enquiries failed", error.message);
    return true; // fail open on infrastructure errors; burst guard still applies
  }
  return (data ?? 0) < RATE_LIMITS.hourly.max;
}
