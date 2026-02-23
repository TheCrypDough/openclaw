/*
 * AUTO ANNOTATION
 * File: src/browser/routes/dispatcher.abort.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import type { BrowserRouteContext } from "../server-context.js";

vi.mock("./index.js", () => {
  return {
    registerBrowserRoutes(app: { get: (path: string, handler: unknown) => void }) {
      app.get(
        "/slow",
        async (req: { signal?: AbortSignal }, res: { json: (body: unknown) => void }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const signal = req.signal;
          await new Promise<void>((resolve, reject) => {
            if (signal?.aborted) {
              reject(signal.reason ?? new Error("aborted"));
              return;
            }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            const onAbort = () => reject(signal?.reason ?? new Error("aborted"));
            signal?.addEventListener("abort", onAbort, { once: true });
            queueMicrotask(() => {
              signal?.removeEventListener("abort", onAbort);
              resolve();
            });
          });
          res.json({ ok: true });
        },
      );
    },
  };
});

describe("browser route dispatcher (abort)", () => {
  it("propagates AbortSignal and lets handlers observe abort", async () => {
    const { createBrowserRouteDispatcher } = await import("./dispatcher.js");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const dispatcher = createBrowserRouteDispatcher({} as BrowserRouteContext);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ctrl = new AbortController();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const promise = dispatcher.dispatch({
      method: "GET",
      path: "/slow",
      signal: ctrl.signal,
    });

    ctrl.abort(new Error("timed out"));

    await expect(promise).resolves.toMatchObject({
      status: 500,
      body: { error: expect.stringContaining("timed out") },
    });
  });
});
