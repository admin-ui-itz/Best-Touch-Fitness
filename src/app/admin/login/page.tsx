import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/login-form";
import { getIntegrationStatus } from "@/lib/env";

export const metadata: Metadata = { title: "Sign in" };

type LoginPageProps = {
  searchParams: Promise<{ next?: string; reason?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { next, reason } = await searchParams;
  const integrations = getIntegrationStatus();

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl">Admin sign in</h1>
      <p className="mt-2 text-ink-muted">For the team only. Accounts are created by the site owner; there is no registration.</p>

      {reason === "forbidden" ? (
        <p role="alert" className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
          Your account is signed in but is not an administrator, or your session expired. Sign in with an admin
          account.
        </p>
      ) : null}

      <div className="mt-8 rounded-xl border border-cream-300 bg-cream-50 p-6">
        {integrations.supabaseAuth && integrations.supabaseAdmin ? (
          <LoginForm next={next} />
        ) : (
          <p className="text-sm text-ink-muted" role="status">
            Admin sign-in is not configured on this environment. Set the Supabase URL, anon key and service role key
            to enable it.
          </p>
        )}
      </div>
    </div>
  );
}
