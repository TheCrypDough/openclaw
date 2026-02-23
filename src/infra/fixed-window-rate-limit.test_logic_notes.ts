/*
 * AUTO ANNOTATION
 * File: src/infra/fixed-window-rate-limit.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { createFixedWindowRateLimiter } from "./fixed-window-rate-limit.js";

describe("fixed-window rate limiter", () => {
  it("blocks after max requests until window reset", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let nowMs = 1_000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const limiter = createFixedWindowRateLimiter({
      maxRequests: 2,
      windowMs: 1_000,
      now: () => nowMs,
    });

    expect(limiter.consume()).toMatchObject({ allowed: true, remaining: 1 });
    expect(limiter.consume()).toMatchObject({ allowed: true, remaining: 0 });
    expect(limiter.consume()).toMatchObject({ allowed: false, retryAfterMs: 1_000 });

    nowMs += 1_000;
    expect(limiter.consume()).toMatchObject({ allowed: true, remaining: 1 });
  });

  it("supports explicit reset", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const limiter = createFixedWindowRateLimiter({
      maxRequests: 1,
      windowMs: 10_000,
    });
    expect(limiter.consume().allowed).toBe(true);
    expect(limiter.consume().allowed).toBe(false);
    limiter.reset();
    expect(limiter.consume().allowed).toBe(true);
  });
});
