import { describe, expect, it } from "vitest";

import { backoffMs, MAX_EMAIL_ATTEMPTS } from "./deliveries";
import { acknowledgementEmail, ownerNotificationEmail } from "./templates";
import type { EnquiryRow } from "@/lib/supabase/types";

describe("backoffMs", () => {
  it("grows exponentially in minutes and is capped", () => {
    expect(backoffMs(1)).toBe(2 * 60_000);
    expect(backoffMs(2)).toBe(4 * 60_000);
    expect(backoffMs(4)).toBe(16 * 60_000);
    expect(backoffMs(10)).toBe(32 * 60_000);
  });

  it("bounds retries", () => {
    expect(MAX_EMAIL_ATTEMPTS).toBe(5);
  });
});

describe("acknowledgementEmail", () => {
  const enquiry: EnquiryRow = {
    id: "00000000-0000-4000-8000-000000000000",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Sam <Test>",
    email: "sam@example.com",
    phone: null,
    interest: "bootcamp",
    message: "Hello & welcome <script>alert(1)</script>",
    marketing_consent: false,
    status: "new",
    client_token: "00000000-0000-4000-8000-000000000001",
    ip_hash: null,
    user_agent: null,
    notes: null,
  };

  it("states the enquiry was received and is not a booking", () => {
    const m = acknowledgementEmail(enquiry);
    expect(m.subject.toLowerCase()).toContain("received");
    expect(m.text).toContain("not a booking");
    expect(m.text).not.toMatch(/booked|reserved for you/i);
  });

  it("escapes user content in HTML", () => {
    const ack = acknowledgementEmail(enquiry);
    expect(ack.html).not.toContain("<script>");
    expect(ack.html).toContain("&lt;script&gt;");
    expect(ack.html).not.toContain("<Test>");

    const owner = ownerNotificationEmail(enquiry, "https://example.com/admin/enquiries/x");
    expect(owner.html).toContain("Sam &lt;Test&gt;");
    expect(owner.html).not.toContain("<script>");
    expect(owner.text).toContain("Sam <Test>");
  });
});
