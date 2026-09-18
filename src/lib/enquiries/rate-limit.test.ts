import { beforeEach, describe, expect, it } from "vitest";

import { _resetBurstLimits, checkBurstLimit, extractClientIp, hashIp, RATE_LIMITS } from "./rate-limit";

describe("checkBurstLimit", () => {
  beforeEach(() => _resetBurstLimits());

  it("allows up to the burst maximum then blocks within the window", () => {
    const now = 1_000_000;
    for (let i = 0; i < RATE_LIMITS.burst.max; i++) {
      expect(checkBurstLimit("k", now + i)).toBe(true);
    }
    expect(checkBurstLimit("k", now + 10)).toBe(false);
  });

  it("allows again once the window has passed", () => {
    const now = 1_000_000;
    for (let i = 0; i < RATE_LIMITS.burst.max; i++) checkBurstLimit("k", now);
    expect(checkBurstLimit("k", now + RATE_LIMITS.burst.windowMs + 1)).toBe(true);
  });

  it("tracks keys independently", () => {
    const now = 1_000_000;
    for (let i = 0; i < RATE_LIMITS.burst.max; i++) checkBurstLimit("a", now);
    expect(checkBurstLimit("b", now)).toBe(true);
  });
});

describe("extractClientIp", () => {
  it("prefers the first x-forwarded-for entry", () => {
    const h = new Headers({ "x-forwarded-for": "203.0.113.5, 10.0.0.1", "x-real-ip": "10.0.0.2" });
    expect(extractClientIp(h)).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip and then null", () => {
    expect(extractClientIp(new Headers({ "x-real-ip": "203.0.113.9" }))).toBe("203.0.113.9");
    expect(extractClientIp(new Headers())).toBeNull();
  });
});

describe("hashIp", () => {
  it("returns null without a secret or ip", () => {
    // ENQUIRY_IP_HASH_SECRET is not set in the test environment.
    expect(hashIp("203.0.113.5")).toBeNull();
    expect(hashIp(null)).toBeNull();
  });
});
