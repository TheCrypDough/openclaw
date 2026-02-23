/*
 * AUTO ANNOTATION
 * File: src/signal/monitor.event-handler.sender-prefix.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SignalReactionMessage } from "./monitor/event-handler.types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const dispatchMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const readAllowFromMock = vi.fn();

vi.mock("../auto-reply/dispatch.js", () => ({
  dispatchInboundMessage: (...args: unknown[]) => dispatchMock(...args),
  dispatchInboundMessageWithDispatcher: (...args: unknown[]) => dispatchMock(...args),
  dispatchInboundMessageWithBufferedDispatcher: (...args: unknown[]) => dispatchMock(...args),
}));

vi.mock("../pairing/pairing-store.js", () => ({
  readChannelAllowFromStore: (...args: unknown[]) => readAllowFromMock(...args),
  upsertChannelPairingRequest: vi.fn(),
}));

describe("signal event handler sender prefix", () => {
  beforeEach(() => {
    dispatchMock.mockReset().mockImplementation(async ({ dispatcher, ctx }) => {
      dispatcher.sendFinalReply({ text: "ok" });
      return { queuedFinal: true, counts: { tool: 0, block: 0, final: 1 }, ctx };
    });
    readAllowFromMock.mockReset().mockResolvedValue([]);
  });

  it("prefixes group bodies with sender label", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let capturedBody = "";
    dispatchMock.mockImplementationOnce(async ({ dispatcher, ctx }) => {
      capturedBody = ctx.Body ?? "";
      dispatcher.sendFinalReply({ text: "ok" });
      return { queuedFinal: true, counts: { tool: 0, block: 0, final: 1 } };
    });

    const { createSignalEventHandler } = await import("./monitor/event-handler.js");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handler = createSignalEventHandler({
      runtime: {
        log: vi.fn(),
        error: vi.fn(),
        exit: (code: number): never => {
          throw new Error(`exit ${code}`);
        },
      },
      cfg: {
        agents: { defaults: { model: "anthropic/claude-opus-4-5", workspace: "/tmp/openclaw" } },
        channels: { signal: {} },
      } as never,
      baseUrl: "http://localhost",
      account: "+15550009999",
      accountId: "default",
      blockStreaming: false,
      historyLimit: 0,
      groupHistories: new Map(),
      textLimit: 4000,
      dmPolicy: "open",
      allowFrom: [],
      groupAllowFrom: [],
      groupPolicy: "open",
      reactionMode: "off",
      reactionAllowlist: [],
      mediaMaxBytes: 1000,
      ignoreAttachments: true,
      sendReadReceipts: false,
      readReceiptsViaDaemon: false,
      fetchAttachment: async () => null,
      deliverReplies: async () => undefined,
      resolveSignalReactionTargets: () => [],
      isSignalReactionMessage: (_reaction): _reaction is SignalReactionMessage => false,
      shouldEmitSignalReactionNotification: () => false,
      buildSignalReactionSystemEventText: () => "",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const payload = {
      envelope: {
        sourceNumber: "+15550002222",
        sourceName: "Alice",
        timestamp: 1700000000000,
        dataMessage: {
          message: "hello",
          groupInfo: { groupId: "group-1", groupName: "Test Group" },
        },
      },
    };

    await handler({ event: "receive", data: JSON.stringify(payload) });

    expect(dispatchMock).toHaveBeenCalled();
    expect(capturedBody).toContain("Alice (+15550002222): hello");
  });
});
