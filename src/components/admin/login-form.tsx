"use client";

import { useActionState, useId } from "react";

import { signIn, type LoginState } from "@/lib/auth/actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signIn, {} as LoginState);
  const emailId = useId();
  const passwordId = useId();

  return (
    <form action={action} className="space-y-5">
      {state.error ? (
        <p role="alert" className="rounded-xl border border-danger/30 bg-danger-soft p-3 text-sm font-medium text-danger">
          {state.error}
        </p>
      ) : null}
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <div>
        <label htmlFor={emailId} className="field-label">
          Email
        </label>
        <input id={emailId} name="email" type="email" autoComplete="username" required className="field-input" />
      </div>
      <div>
        <label htmlFor={passwordId} className="field-label">
          Password
        </label>
        <input
          id={passwordId}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field-input"
        />
      </div>
      <button type="submit" className="btn btn-primary w-full" disabled={pending} aria-busy={pending}>
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
