"use client";

import { useActionState } from "react";

import type { AdminActionState } from "@/lib/admin/actions";

import { SubmitButton } from "./submit-button";

type ActionFormProps = {
  action: (prev: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  children?: React.ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  className?: string;
  buttonClassName?: string;
};

/** Small wrapper giving admin forms pending/success/error feedback. */
export function ActionForm({
  action,
  children,
  submitLabel,
  pendingLabel,
  className = "",
  buttonClassName,
}: ActionFormProps) {
  const [state, formAction] = useActionState(action, {} as AdminActionState);
  return (
    <form action={formAction} className={className}>
      {children}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <SubmitButton pendingLabel={pendingLabel} className={buttonClassName}>
          {submitLabel}
        </SubmitButton>
        {state.error ? (
          <p role="alert" className="text-sm font-medium text-danger">
            {state.error}
          </p>
        ) : null}
        {state.ok && state.info ? (
          <p role="status" className="text-sm font-medium text-success">
            {state.info}
          </p>
        ) : null}
      </div>
    </form>
  );
}
