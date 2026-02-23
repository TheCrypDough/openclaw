/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-subscribe.reply-tags.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AssistantMessage } from "@mariozechner/pi-ai";
import { describe, expect, it, vi } from "vitest";
import {
  createStubSessionHarness,
  emitAssistantTextDelta,
  emitAssistantTextEnd,
} from "./pi-embedded-subscribe.e2e-harness.js";
import { subscribeEmbeddedPiSession } from "./pi-embedded-subscribe.js";

describe("subscribeEmbeddedPiSession reply tags", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function createBlockReplyHarness() {
    const { session, emit } = createStubSessionHarness();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onBlockReply = vi.fn();

    subscribeEmbeddedPiSession({
      session,
      runId: "run",
      onBlockReply,
      blockReplyBreak: "text_end",
      blockReplyChunking: {
        minChars: 1,
        maxChars: 50,
        breakPreference: "newline",
      },
    });

    return { emit, onBlockReply };
  }

  it("carries reply_to_current across tag-only block chunks", () => {
    const { emit, onBlockReply } = createBlockReplyHarness();

    emit({ type: "message_start", message: { role: "assistant" } });
    emitAssistantTextDelta({ emit, delta: "[[reply_to_current]]\nHello" });
    emitAssistantTextEnd({ emit });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const assistantMessage = {
      role: "assistant",
      content: [{ type: "text", text: "[[reply_to_current]]\nHello" }],
    } as AssistantMessage;
    emit({ type: "message_end", message: assistantMessage });

    expect(onBlockReply).toHaveBeenCalledTimes(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const payload = onBlockReply.mock.calls[0]?.[0];
    expect(payload?.text).toBe("Hello");
    expect(payload?.replyToCurrent).toBe(true);
    expect(payload?.replyToTag).toBe(true);
  });

  it("flushes trailing directive tails on stream end", () => {
    const { emit, onBlockReply } = createBlockReplyHarness();

    emit({ type: "message_start", message: { role: "assistant" } });
    emitAssistantTextDelta({ emit, delta: "Hello [[" });
    emitAssistantTextEnd({ emit });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const assistantMessage = {
      role: "assistant",
      content: [{ type: "text", text: "Hello [[" }],
    } as AssistantMessage;
    emit({ type: "message_end", message: assistantMessage });

    expect(onBlockReply).toHaveBeenCalledTimes(2);
    expect(onBlockReply.mock.calls[0]?.[0]?.text).toBe("Hello");
    expect(onBlockReply.mock.calls[1]?.[0]?.text).toBe("[[");
  });

  it("streams partial replies past reply_to tags split across chunks", () => {
    const { session, emit } = createStubSessionHarness();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onPartialReply = vi.fn();

    subscribeEmbeddedPiSession({
      session,
      runId: "run",
      onPartialReply,
    });

    emit({ type: "message_start", message: { role: "assistant" } });
    emitAssistantTextDelta({ emit, delta: "[[reply_to:1897" });
    emitAssistantTextDelta({ emit, delta: "]] Hello" });
    emitAssistantTextDelta({ emit, delta: " world" });
    emitAssistantTextEnd({ emit });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const lastPayload = onPartialReply.mock.calls.at(-1)?.[0];
    expect(lastPayload?.text).toBe("Hello world");
    for (const call of onPartialReply.mock.calls) {
      expect(call[0]?.text?.includes("[[reply_to")).toBe(false);
    }
  });
});
