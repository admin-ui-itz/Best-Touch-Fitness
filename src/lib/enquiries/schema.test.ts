import { describe, expect, it } from "vitest";

import { parseEnquiryFormData } from "./schema";

function form(overrides: Record<string, string> = {}) {
  const fd = new FormData();
  const base: Record<string, string> = {
    name: "Jordan Example",
    email: "Jordan@Example.com",
    phone: "",
    interest: "bootcamp",
    message: "I would like to try a first session please.",
    clientToken: "6f1c2a4e-3b7d-4c8e-9a1f-2b3c4d5e6f70",
    website: "",
    renderedAt: String(Date.now() - 10_000),
  };
  for (const [k, v] of Object.entries({ ...base, ...overrides })) fd.set(k, v);
  return fd;
}

describe("parseEnquiryFormData", () => {
  it("accepts a valid submission and normalises values", () => {
    const result = parseEnquiryFormData(form());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values.email).toBe("jordan@example.com");
    expect(result.values.phone).toBeNull();
    expect(result.values.marketingConsent).toBe(false);
  });

  it("rejects missing name/email with per-field errors", () => {
    const result = parseEnquiryFormData(form({ name: "J", email: "nope" }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.fieldErrors.name).toBeTruthy();
    expect(result.fieldErrors.email).toBeTruthy();
  });

  it("treats message as optional: empty is accepted and normalised to null", () => {
    const result = parseEnquiryFormData(form({ message: "" }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values.message).toBeNull();
  });

  it("still accepts a short, non-empty message now that the 10-char minimum is gone", () => {
    const result = parseEnquiryFormData(form({ message: "short" }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values.message).toBe("short");
  });

  it("rejects unknown interests, including coming-soon classes", () => {
    const spin = parseEnquiryFormData(form({ interest: "spin" }));
    expect(spin.ok).toBe(false);
    const step = parseEnquiryFormData(form({ interest: "step" }));
    expect(step.ok).toBe(false);
  });

  it("rejects the honeypot when filled", () => {
    const result = parseEnquiryFormData(form({ website: "http://spam.example" }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.fieldErrors.website).toBeTruthy();
  });

  it("rejects an invalid client token", () => {
    const result = parseEnquiryFormData(form({ clientToken: "not-a-uuid" }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.fieldErrors.clientToken).toBeTruthy();
  });

  it("validates optional phone numbers loosely", () => {
    expect(parseEnquiryFormData(form({ phone: "+1 (246) 555-0100" })).ok).toBe(true);
    expect(parseEnquiryFormData(form({ phone: "call me maybe" })).ok).toBe(false);
  });
});
