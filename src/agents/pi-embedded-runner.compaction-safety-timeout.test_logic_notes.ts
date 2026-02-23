/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner.compaction-safety-timeout.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  compactWithSafetyTimeout,
  EMBEDDED_COMPACTION_TIMEOUT_MS,
} from "./pi-embedded-runner/compaction-safety-timeout.js";

describe("compactWithSafetyTimeout", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("rejects with timeout when compaction never settles", async () => {
    vi.useFakeTimers();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const compactPromise = compactWithSafetyTimeout(() => new Promise<never>(() => {}));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const timeoutAssertion = expect(compactPromise).rejects.toThrow("Compaction timed out");

    await vi.advanceTimersByTimeAsync(EMBEDDED_COMPACTION_TIMEOUT_MS);
    await timeoutAssertion;
    expect(vi.getTimerCount()).toBe(0);
  });

  it("returns result and clears timer when compaction settles first", async () => {
    vi.useFakeTimers();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const compactPromise = compactWithSafetyTimeout(
      () => new Promise<string>((resolve) => setTimeout(() => resolve("ok"), 10)),
      30,
    );

    await vi.advanceTimersByTimeAsync(10);
    await expect(compactPromise).resolves.toBe("ok");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("preserves compaction errors and clears timer", async () => {
    vi.useFakeTimers();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const error = new Error("provider exploded");

    await expect(
      compactWithSafetyTimeout(async () => {
        throw error;
      }, 30),
    ).rejects.toBe(error);
    expect(vi.getTimerCount()).toBe(0);
  });
});
