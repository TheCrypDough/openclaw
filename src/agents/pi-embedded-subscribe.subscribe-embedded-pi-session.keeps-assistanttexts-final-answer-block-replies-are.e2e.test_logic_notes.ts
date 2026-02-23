/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.keeps-assistanttexts-final-answer-block-replies-are.e2e.test.ts
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

describe("subscribeEmbeddedPiSession", () => {
  it("keeps assistantTexts to the final answer when block replies are disabled", () => {
    const { session, emit } = createStubSessionHarness();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const subscription = subscribeEmbeddedPiSession({
      session,
      runId: "run",
      reasoningMode: "on",
    });

    emit({ type: "message_start", message: { role: "assistant" } });
    emitAssistantTextDelta({ emit, delta: "Final " });
    emitAssistantTextDelta({ emit, delta: "answer" });
    emitAssistantTextEnd({ emit });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const assistantMessage = {
      role: "assistant",
      content: [
        { type: "thinking", thinking: "Because it helps" },
        { type: "text", text: "Final answer" },
      ],
    } as AssistantMessage;

    emit({ type: "message_end", message: assistantMessage });

    expect(subscription.assistantTexts).toEqual(["Final answer"]);
  });
  it("suppresses partial replies when reasoning is enabled and block replies are disabled", () => {
    const { session, emit } = createStubSessionHarness();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onPartialReply = vi.fn();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const subscription = subscribeEmbeddedPiSession({
      session,
      runId: "run",
      reasoningMode: "on",
      onPartialReply,
    });

    emit({ type: "message_start", message: { role: "assistant" } });
    emitAssistantTextDelta({ emit, delta: "Draft " });
    emitAssistantTextDelta({ emit, delta: "reply" });

    expect(onPartialReply).not.toHaveBeenCalled();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const assistantMessage = {
      role: "assistant",
      content: [
        { type: "thinking", thinking: "Because it helps" },
        { type: "text", text: "Final answer" },
      ],
    } as AssistantMessage;

    emit({ type: "message_end", message: assistantMessage });
    emitAssistantTextEnd({ emit, content: "Draft reply" });

    expect(onPartialReply).not.toHaveBeenCalled();
    expect(subscription.assistantTexts).toEqual(["Final answer"]);
  });
});
