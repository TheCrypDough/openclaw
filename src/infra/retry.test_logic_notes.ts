/*
 * AUTO ANNOTATION
 * File: src/infra/retry.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { retryAsync } from "./retry.js";

describe("retryAsync", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function runRetryAfterCase(options: {
    maxDelayMs: number;
    retryAfterMs: number;
    expectedDelayMs: number;
  }) {
    vi.useFakeTimers();
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const fn = vi.fn().mockRejectedValueOnce(new Error("boom")).mockResolvedValueOnce("ok");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const delays: number[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const promise = retryAsync(fn, {
        attempts: 2,
        minDelayMs: 0,
        maxDelayMs: options.maxDelayMs,
        jitter: 0,
        retryAfterMs: () => options.retryAfterMs,
        onRetry: (info) => delays.push(info.delayMs),
      });
      await vi.runAllTimersAsync();
      await expect(promise).resolves.toBe("ok");
      expect(delays[0]).toBe(options.expectedDelayMs);
    } finally {
      vi.useRealTimers();
    }
  }

  it("returns on first success", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fn = vi.fn().mockResolvedValue("ok");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await retryAsync(fn, 3, 10);
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries then succeeds", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fn = vi.fn().mockRejectedValueOnce(new Error("fail1")).mockResolvedValueOnce("ok");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await retryAsync(fn, 3, 1);
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("propagates after exhausting retries", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fn = vi.fn().mockRejectedValue(new Error("boom"));
    await expect(retryAsync(fn, 2, 1)).rejects.toThrow("boom");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("stops when shouldRetry returns false", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fn = vi.fn().mockRejectedValue(new Error("boom"));
    await expect(retryAsync(fn, { attempts: 3, shouldRetry: () => false })).rejects.toThrow("boom");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("calls onRetry before retrying", async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error("boom")).mockResolvedValueOnce("ok");
    const onRetry = vi.fn();
    const res = await retryAsync(fn, {
      attempts: 2,
      minDelayMs: 0,
      maxDelayMs: 0,
      onRetry,
    });
    expect(res).toBe("ok");
    expect(onRetry).toHaveBeenCalledWith(expect.objectContaining({ attempt: 1, maxAttempts: 2 }));
  });

  it("clamps attempts to at least 1", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("boom"));
    await expect(retryAsync(fn, { attempts: 0, minDelayMs: 0, maxDelayMs: 0 })).rejects.toThrow(
      "boom",
    );
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it.each([
    {
      name: "uses retryAfterMs when provided",
      maxDelayMs: 1000,
      retryAfterMs: 500,
      expectedDelayMs: 500,
    },
    {
      name: "clamps retryAfterMs to maxDelayMs",
      maxDelayMs: 100,
      retryAfterMs: 500,
      expectedDelayMs: 100,
    },
  ])("$name", async ({ maxDelayMs, retryAfterMs, expectedDelayMs }) => {
    await runRetryAfterCase({ maxDelayMs, retryAfterMs, expectedDelayMs });
  });
});
