/*
 * AUTO ANNOTATION
 * File: src/infra/provider-usage.shared.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { clampPercent, resolveUsageProviderId, withTimeout } from "./provider-usage.shared.js";

describe("provider-usage.shared", () => {
  it("normalizes supported usage provider ids", () => {
    expect(resolveUsageProviderId("z-ai")).toBe("zai");
    expect(resolveUsageProviderId(" GOOGLE-ANTIGRAVITY ")).toBe("google-antigravity");
    expect(resolveUsageProviderId("unknown-provider")).toBeUndefined();
    expect(resolveUsageProviderId()).toBeUndefined();
  });

  it("clamps usage percents and handles non-finite values", () => {
    expect(clampPercent(-5)).toBe(0);
    expect(clampPercent(120)).toBe(100);
    expect(clampPercent(Number.NaN)).toBe(0);
    expect(clampPercent(Number.POSITIVE_INFINITY)).toBe(0);
  });

  it("returns work result when it resolves before timeout", async () => {
    await expect(withTimeout(Promise.resolve("ok"), 100, "fallback")).resolves.toBe("ok");
  });

  it("returns fallback when timeout wins", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const late = new Promise<string>((resolve) => setTimeout(() => resolve("late"), 50));
    await expect(withTimeout(late, 1, "fallback")).resolves.toBe("fallback");
  });
});
