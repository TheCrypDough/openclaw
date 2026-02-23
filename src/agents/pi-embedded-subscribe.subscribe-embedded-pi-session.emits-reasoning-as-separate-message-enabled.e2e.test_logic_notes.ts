/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.emits-reasoning-as-separate-message-enabled.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AssistantMessage } from "@mariozechner/pi-ai";
import { describe, expect, it, vi } from "vitest";
import {
  THINKING_TAG_CASES,
  createStubSessionHarness,
} from "./pi-embedded-subscribe.e2e-harness.js";
import { subscribeEmbeddedPiSession } from "./pi-embedded-subscribe.js";

describe("subscribeEmbeddedPiSession", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function createReasoningBlockReplyHarness() {
    const { session, emit } = createStubSessionHarness();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onBlockReply = vi.fn();

    subscribeEmbeddedPiSession({
      session,
      runId: "run",
      onBlockReply,
      blockReplyBreak: "message_end",
      reasoningMode: "on",
    });

    return { emit, onBlockReply };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function expectReasoningAndAnswerCalls(onBlockReply: ReturnType<typeof vi.fn>) {
    expect(onBlockReply).toHaveBeenCalledTimes(2);
    expect(onBlockReply.mock.calls[0][0].text).toBe("Reasoning:\n_Because it helps_");
    expect(onBlockReply.mock.calls[1][0].text).toBe("Final answer");
  }

  it("emits reasoning as a separate message when enabled", () => {
    const { emit, onBlockReply } = createReasoningBlockReplyHarness();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const assistantMessage = {
      role: "assistant",
      content: [
        { type: "thinking", thinking: "Because it helps" },
        { type: "text", text: "Final answer" },
      ],
    } as AssistantMessage;

    emit({ type: "message_end", message: assistantMessage });

    expectReasoningAndAnswerCalls(onBlockReply);
  });
  it.each(THINKING_TAG_CASES)(
    "promotes <%s> tags to thinking blocks at write-time",
    ({ open, close }) => {
      const { emit, onBlockReply } = createReasoningBlockReplyHarness();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const assistantMessage = {
        role: "assistant",
        content: [
          {
            type: "text",
            text: `${open}\nBecause it helps\n${close}\n\nFinal answer`,
          },
        ],
      } as AssistantMessage;

      emit({ type: "message_end", message: assistantMessage });

      expectReasoningAndAnswerCalls(onBlockReply);

      expect(assistantMessage.content).toEqual([
        { type: "thinking", thinking: "Because it helps" },
        { type: "text", text: "Final answer" },
      ]);
    },
  );
});
