/*
 * AUTO ANNOTATION
 * File: src/infra/transport-ready.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { waitForTransportReady } from "./transport-ready.js";

// Perf: `sleepWithAbort` uses `node:timers/promises` which isn't controlled by fake timers.
// Route sleeps through global `setTimeout` so tests can advance time deterministically.
vi.mock("./backoff.js", () => ({
  sleepWithAbort: async (ms: number) => {
    if (ms <= 0) {
      return;
    }
    await new Promise<void>((resolve) => setTimeout(resolve, ms));
  },
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createRuntime() {
  return { log: vi.fn(), error: vi.fn(), exit: vi.fn() };
}

describe("waitForTransportReady", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns when the check succeeds and logs after the delay", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runtime = createRuntime();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let attempts = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const readyPromise = waitForTransportReady({
      label: "test transport",
      timeoutMs: 220,
      // Deterministic: first attempt at t=0 won't log; second attempt at t=50 will.
      logAfterMs: 1,
      logIntervalMs: 1_000,
      pollIntervalMs: 50,
      runtime,
      check: async () => {
        attempts += 1;
        if (attempts > 2) {
          return { ok: true };
        }
        return { ok: false, error: "not ready" };
      },
    });

    await vi.advanceTimersByTimeAsync(200);

    await readyPromise;
    expect(runtime.error).toHaveBeenCalled();
  });

  it("throws after the timeout", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runtime = createRuntime();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const waitPromise = waitForTransportReady({
      label: "test transport",
      timeoutMs: 110,
      logAfterMs: 0,
      logIntervalMs: 1_000,
      pollIntervalMs: 50,
      runtime,
      check: async () => ({ ok: false, error: "still down" }),
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const asserted = expect(waitPromise).rejects.toThrow("test transport not ready");
    await vi.advanceTimersByTimeAsync(200);
    await asserted;
    expect(runtime.error).toHaveBeenCalled();
  });

  it("returns early when aborted", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runtime = createRuntime();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const controller = new AbortController();
    controller.abort();
    await waitForTransportReady({
      label: "test transport",
      timeoutMs: 200,
      runtime,
      abortSignal: controller.signal,
      check: async () => ({ ok: false, error: "still down" }),
    });
    expect(runtime.error).not.toHaveBeenCalled();
  });
});
