/*
 * AUTO ANNOTATION
 * File: src/telegram/bot-message-context.dm-topic-threadid.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { buildTelegramMessageContextForTest } from "./bot-message-context.test-harness.js";

// Mock recordInboundSession to capture updateLastRoute parameter
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const recordInboundSessionMock = vi.fn().mockResolvedValue(undefined);
vi.mock("../channels/session.js", () => ({
  recordInboundSession: (...args: unknown[]) => recordInboundSessionMock(...args),
}));

describe("buildTelegramMessageContext DM topic threadId in deliveryContext (#8891)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function buildCtx(params: {
    message: Record<string, unknown>;
    options?: Record<string, unknown>;
    resolveGroupActivation?: () => boolean | undefined;
  }) {
    return await buildTelegramMessageContextForTest({
      message: params.message,
      options: params.options,
      resolveGroupActivation: params.resolveGroupActivation,
    });
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function getUpdateLastRoute(): unknown {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const callArgs = recordInboundSessionMock.mock.calls[0]?.[0] as { updateLastRoute?: unknown };
    return callArgs?.updateLastRoute;
  }

  beforeEach(() => {
    recordInboundSessionMock.mockClear();
  });

  it("passes threadId to updateLastRoute for DM topics", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ctx = await buildCtx({
      message: {
        chat: { id: 1234, type: "private" },
        message_thread_id: 42, // DM Topic ID
      },
    });

    expect(ctx).not.toBeNull();
    expect(recordInboundSessionMock).toHaveBeenCalled();

    // Check that updateLastRoute includes threadId
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const updateLastRoute = getUpdateLastRoute() as { threadId?: string } | undefined;
    expect(updateLastRoute).toBeDefined();
    expect(updateLastRoute?.threadId).toBe("42");
  });

  it("does not pass threadId for regular DM without topic", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ctx = await buildCtx({
      message: {
        chat: { id: 1234, type: "private" },
      },
    });

    expect(ctx).not.toBeNull();
    expect(recordInboundSessionMock).toHaveBeenCalled();

    // Check that updateLastRoute does NOT include threadId
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const updateLastRoute = getUpdateLastRoute() as { threadId?: string } | undefined;
    expect(updateLastRoute).toBeDefined();
    expect(updateLastRoute?.threadId).toBeUndefined();
  });

  it("does not set updateLastRoute for group messages", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ctx = await buildCtx({
      message: {
        chat: { id: -1001234567890, type: "supergroup", title: "Test Group" },
        text: "@bot hello",
        message_thread_id: 99,
      },
      options: { forceWasMentioned: true },
      resolveGroupActivation: () => true,
    });

    expect(ctx).not.toBeNull();
    expect(recordInboundSessionMock).toHaveBeenCalled();

    // Check that updateLastRoute is undefined for groups
    expect(getUpdateLastRoute()).toBeUndefined();
  });
});
