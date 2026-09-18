import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

import type { Database } from "./types";

let cached: SupabaseClient<Database> | null = null;

/**
 * Service-role client. Bypasses RLS, so it is only ever used on the server
 * for: inserting enquiries, recording email deliveries, checking admin
 * membership and rate limits. Returns null when not configured so callers
 * can report "unconfigured" honestly instead of pretending to succeed.
 */
export function getSupabaseAdmin(): SupabaseClient<Database> | null {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) return null;
  if (!cached) {
    cached = createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers: { "X-Client-Info": "gym-website-server" } },
    });
  }
  return cached;
}
