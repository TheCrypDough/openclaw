/*
 * AUTO ANNOTATION
 * File: src/imessage/monitor.shutdown.unhandled-rejection.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { attachIMessageMonitorAbortHandler } from "./monitor/abort-handler.js";

describe("monitorIMessageProvider", () => {
  it("does not trigger unhandledRejection when aborting during shutdown", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const abortController = new AbortController();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let subscriptionId: number | null = 1;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const requestMock = vi.fn((method: string, _params?: Record<string, unknown>) => {
      if (method === "watch.unsubscribe") {
        return Promise.reject(new Error("imsg rpc closed"));
      }
      return Promise.resolve({});
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stopMock = vi.fn(async () => {});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const unhandled: unknown[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onUnhandled = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on("unhandledRejection", onUnhandled);

    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const detach = attachIMessageMonitorAbortHandler({
        abortSignal: abortController.signal,
        client: {
          request: requestMock,
          stop: stopMock,
        },
        getSubscriptionId: () => subscriptionId,
      });
      abortController.abort();
      // Give the event loop a turn to surface any unhandledRejection, if present.
      await new Promise<void>((resolve) => setImmediate(resolve));
      detach();
    } finally {
      process.off("unhandledRejection", onUnhandled);
    }

    expect(unhandled).toHaveLength(0);
    expect(stopMock).toHaveBeenCalled();
    expect(requestMock).toHaveBeenCalledWith("watch.unsubscribe", { subscription: 1 });
  });
});
