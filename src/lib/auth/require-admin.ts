import "server-only";

import { redirect } from "next/navigation";

import { getIntegrationStatus } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AdminSession = {
  userId: string;
  email: string | null;
};

/**
 * Server-side check used by EVERY admin page and action.
 * 1. getUser() validates the JWT with Supabase (not just the cookie).
 * 2. Membership is checked in admin_users with the service role so it cannot
 *    be spoofed by client state.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const { data } = await admin.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!data) return null;
  return { userId: user.id, email: user.email ?? null };
}

/** Redirects to the login page (or a forbidden notice) when not an admin. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    const { supabaseAuth, supabaseAdmin } = getIntegrationStatus();
    // Only call it "forbidden" when auth is actually configured; otherwise the
    // login page explains that the integration is missing.
    redirect(supabaseAuth && supabaseAdmin ? "/admin/login?reason=forbidden" : "/admin/login");
  }
  return session;
}

/** For Server Actions: throw instead of redirect so callers can return an error state. */
export async function assertAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new Error("Forbidden");
  return session;
}
