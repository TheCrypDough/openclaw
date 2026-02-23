/*
 * AUTO ANNOTATION
 * File: src/gateway/server-restart-deferral.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAllDispatchers,
  getTotalPendingReplies,
} from "../auto-reply/reply/dispatcher-registry.js";
import { createReplyDispatcher } from "../auto-reply/reply/reply-dispatcher.js";
import { getTotalQueueSize } from "../process/command-queue.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function flushMicrotasks(count = 10): Promise<void> {
  for (let i = 0; i < count; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.resolve();
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createDeferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("gateway restart deferral", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let replyErrors: string[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    replyErrors = [];
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await flushMicrotasks();
    clearAllDispatchers();
  });

  it("defers restart while reply delivery is in flight", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let rpcConnected = true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const deliveredReplies: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const deliveryStarted = createDeferred();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const allowDelivery = createDeferred();

    // Hold delivery open so restart checks run while reply is in-flight.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const dispatcher = createReplyDispatcher({
      deliver: async (payload) => {
        if (!rpcConnected) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const error = "Error: imsg rpc not running";
          replyErrors.push(error);
          throw new Error(error);
        }
        deliveryStarted.resolve();
        await allowDelivery.promise;
        deliveredReplies.push(payload.text ?? "");
      },
      onError: () => {
        // Swallow delivery errors so the test can assert on replyErrors.
      },
    });

    // Enqueue reply and immediately clear the reservation.
    // This is the critical sequence: after markComplete(), the ONLY thing
    // keeping pending > 0 is the in-flight delivery itself.
    dispatcher.sendFinalReply({ text: "Configuration updated!" });
    dispatcher.markComplete();
    await deliveryStarted.promise;

    // At this point: delivery is in flight; pending > 0 prevents restart.
    expect(getTotalPendingReplies()).toBeGreaterThan(0);

    let restartTriggered = false;
    for (let i = 0; i < 3; i += 1) {
      await Promise.resolve();
      const pending = getTotalPendingReplies();
      if (pending === 0) {
        restartTriggered = true;
        rpcConnected = false;
        break;
      }
    }

    allowDelivery.resolve();
    await dispatcher.waitForIdle();

    expect(getTotalPendingReplies()).toBe(0);
    expect(restartTriggered).toBe(false);
    expect(replyErrors).toEqual([]);
    expect(deliveredReplies).toEqual(["Configuration updated!"]);
  });

  it("keeps pending > 0 until the reply is actually enqueued", async () => {
    const allowDelivery = createDeferred();

    const dispatcher = createReplyDispatcher({
      deliver: async () => {
        await allowDelivery.promise;
      },
    });

    expect(getTotalPendingReplies()).toBe(1);

    await Promise.resolve();
    expect(getTotalPendingReplies()).toBe(1);

    dispatcher.sendFinalReply({ text: "Reply" });
    expect(getTotalPendingReplies()).toBe(2);

    dispatcher.markComplete();
    expect(getTotalPendingReplies()).toBeGreaterThan(0);

    allowDelivery.resolve();
    await dispatcher.waitForIdle();
    expect(getTotalPendingReplies()).toBe(0);
  });

  it("defers restart until reply dispatcher completes", async () => {
    const deliveredReplies: string[] = [];
    const dispatcher = createReplyDispatcher({
      deliver: async (payload) => {
        await Promise.resolve();
        deliveredReplies.push(payload.text ?? "");
      },
      onError: (err) => {
        throw err;
      },
    });

    expect(getTotalPendingReplies()).toBe(1);

    dispatcher.sendFinalReply({ text: "Configuration updated successfully!" });
    expect(getTotalPendingReplies()).toBe(2);

    dispatcher.markComplete();
    expect(getTotalPendingReplies()).toBeGreaterThan(0);

    await dispatcher.waitForIdle();

    expect(getTotalPendingReplies()).toBe(0);
    expect(deliveredReplies).toEqual(["Configuration updated successfully!"]);
    expect(getTotalQueueSize()).toBe(0);
  });

  it("clears dispatcher reservation when no replies were sent", async () => {
    let deliverCalled = false;
    const dispatcher = createReplyDispatcher({
      deliver: async () => {
        deliverCalled = true;
      },
    });

    expect(getTotalPendingReplies()).toBe(1);

    dispatcher.markComplete();
    await flushMicrotasks();

    expect(getTotalPendingReplies()).toBe(0);
    await dispatcher.waitForIdle();

    expect(deliverCalled).toBe(false);
    expect(getTotalPendingReplies()).toBe(0);
  });
});
