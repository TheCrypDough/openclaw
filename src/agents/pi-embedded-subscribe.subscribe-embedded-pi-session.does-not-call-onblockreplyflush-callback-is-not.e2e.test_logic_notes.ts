/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.does-not-call-onblockreplyflush-callback-is-not.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { subscribeEmbeddedPiSession } from "./pi-embedded-subscribe.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type StubSession = {
  subscribe: (fn: (evt: unknown) => void) => () => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SessionEventHandler = (evt: unknown) => void;

describe("subscribeEmbeddedPiSession", () => {
  it("does not call onBlockReplyFlush when callback is not provided", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let handler: SessionEventHandler | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const session: StubSession = {
      subscribe: (fn) => {
        handler = fn;
        return () => {};
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onBlockReply = vi.fn();

    // No onBlockReplyFlush provided
    subscribeEmbeddedPiSession({
      session: session as unknown as Parameters<typeof subscribeEmbeddedPiSession>[0]["session"],
      runId: "run-no-flush",
      onBlockReply,
      blockReplyBreak: "text_end",
    });

    // This should not throw even without onBlockReplyFlush
    expect(() => {
      handler?.({
        type: "tool_execution_start",
        toolName: "bash",
        toolCallId: "tool-no-flush",
        args: { command: "echo test" },
      });
    }).not.toThrow();
  });
});
