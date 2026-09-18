"use client";

import { useActionState, useEffect, useId, useRef } from "react";

import { enquiryInterests } from "@/config/classes";
import { siteConfig } from "@/config/site";
import { submitEnquiry, type EnquiryActionState } from "@/lib/enquiries/actions";

type EnquiryFormProps = {
  /** Pre-selects the interest (from ?interest= on the contact page). */
  defaultInterest?: string;
  /** When false the form explains that submissions are not live. */
  enabled: boolean;
};

const initialState: EnquiryActionState = { status: "idle" };

function newToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  // Fallback for very old browsers: RFC4122-ish v4.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function EnquiryForm({ defaultInterest, enabled }: EnquiryFormProps) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  // Kept in refs (not state) so they survive React's automatic form reset
  // after a server action without triggering a re-render of their own.
  const tokenRef = useRef<HTMLInputElement>(null);
  const renderedAtRef = useRef<HTMLInputElement>(null);
  const antiSpam = useRef({ token: "", renderedAt: "0" });
  const ids = {
    name: useId(),
    email: useId(),
    phone: useId(),
    interest: useId(),
    message: useId(),
    consent: useId(),
    status: useId(),
  };
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Token + render time are written straight into the hidden inputs on the
  // client so they are unique per visit and never part of the static HTML.
  useEffect(() => {
    if (!antiSpam.current.token) {
      antiSpam.current = { token: newToken(), renderedAt: String(Date.now()) };
    }
    if (tokenRef.current) tokenRef.current.value = antiSpam.current.token;
    if (renderedAtRef.current) renderedAtRef.current.value = antiSpam.current.renderedAt;
  });

  // Move focus to the outcome so screen-reader and keyboard users hear it.
  useEffect(() => {
    if (state.status === "error") alertRef.current?.focus();
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};
  const validInterest = enquiryInterests.some((i) => i.value === defaultInterest) ? defaultInterest : "";

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-success/30 bg-success-soft p-6 text-charcoal-900"
      >
        <h2 className="text-2xl">Enquiry received</h2>
        <p className="mt-3">{state.message}</p>
        <p className="mt-3 text-sm text-ink-muted">
          You should also receive a confirmation email shortly. If it does not arrive, check your spam
          folder; your enquiry has still been saved.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-6" aria-describedby={ids.status}>
      {!enabled ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950" role="status">
          <p className="font-semibold">Enquiries are not live yet.</p>
          <p>
            This form is a preview. Submissions will not be stored or sent until the enquiry service is
            configured.
          </p>
        </div>
      ) : null}

      {state.status === "error" ? (
        <div
          ref={alertRef}
          tabIndex={-1}
          role="alert"
          id={ids.status}
          className="rounded-2xl border border-danger/30 bg-danger-soft p-4 text-sm font-medium text-danger"
        >
          {state.message}
        </div>
      ) : (
        <p id={ids.status} className="sr-only">
          All fields marked required must be completed.
        </p>
      )}

      {/* Anti-spam: token, render time and a honeypot that humans never see. */}
      <input ref={tokenRef} type="hidden" name="clientToken" defaultValue="" />
      <input ref={renderedAtRef} type="hidden" name="renderedAt" defaultValue="0" />
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website-field">Leave this field empty</label>
        <input id="website-field" type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.name} className="field-label">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id={ids.name}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            defaultValue={values.name ?? ""}
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? `${ids.name}-error` : undefined}
            className="field-input"
          />
          {errors.name ? (
            <p id={`${ids.name}-error`} className="field-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={ids.email} className="field-label">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id={ids.email}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={254}
            defaultValue={values.email ?? ""}
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? `${ids.email}-error` : undefined}
            className="field-input"
          />
          {errors.email ? (
            <p id={`${ids.email}-error`} className="field-error">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={ids.phone} className="field-label">
            Telephone <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id={ids.phone}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={40}
            defaultValue={values.phone ?? ""}
            aria-invalid={errors.phone ? "true" : undefined}
            aria-describedby={errors.phone ? `${ids.phone}-error` : `${ids.phone}-hint`}
            className="field-input"
          />
          {errors.phone ? (
            <p id={`${ids.phone}-error`} className="field-error">
              {errors.phone}
            </p>
          ) : (
            <p id={`${ids.phone}-hint`} className="field-hint">
              Only if you would prefer a call.
            </p>
          )}
        </div>

        <div>
          <label htmlFor={ids.interest} className="field-label">
            I am interested in <span aria-hidden="true">*</span>
          </label>
          <select
            id={ids.interest}
            name="interest"
            required
            defaultValue={values.interest ?? validInterest}
            aria-invalid={errors.interest ? "true" : undefined}
            aria-describedby={errors.interest ? `${ids.interest}-error` : undefined}
            className="field-input"
          >
            <option value="">Choose an option</option>
            {enquiryInterests.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
          {errors.interest ? (
            <p id={`${ids.interest}-error`} className="field-error">
              {errors.interest}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor={ids.message} className="field-label">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={ids.message}
          name="message"
          required
          rows={5}
          minLength={10}
          maxLength={2000}
          defaultValue={values.message ?? ""}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? `${ids.message}-error` : `${ids.message}-hint`}
          className="field-input"
        />
        {errors.message ? (
          <p id={`${ids.message}-error`} className="field-error">
            {errors.message}
          </p>
        ) : (
          <p id={`${ids.message}-hint`} className="field-hint">
            Tell us a little about yourself and what you are hoping to get from training.
          </p>
        )}
      </div>

      {siteConfig.marketingSignupEnabled ? (
        <div className="flex items-start gap-3">
          <input
            id={ids.consent}
            name="marketingConsent"
            type="checkbox"
            defaultChecked={Boolean(values.marketingConsent)}
            className="mt-1 h-5 w-5 accent-lime-600"
          />
          <label htmlFor={ids.consent} className="text-sm text-ink-muted">
            Keep me posted about classes and news by email. Optional, and you can unsubscribe at any
            time.
          </label>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={pending}
          aria-disabled={pending}
          aria-busy={pending}
        >
          {pending ? (
            <>
              <span
                aria-hidden="true"
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-charcoal-900/30 border-t-charcoal-900"
              />
              Sending
            </>
          ) : (
            "Send enquiry"
          )}
        </button>
        <p className="text-sm text-ink-muted">
          Sending an enquiry does not book a class. We reply personally to every message.
        </p>
      </div>
      <p className="sr-only" aria-live="polite">
        {pending ? "Sending your enquiry, please wait." : ""}
      </p>
    </form>
  );
}
