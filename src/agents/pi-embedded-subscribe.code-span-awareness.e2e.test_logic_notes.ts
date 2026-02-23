/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-subscribe.code-span-awareness.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import {
  createStubSessionHarness,
  emitAssistantTextDelta,
} from "./pi-embedded-subscribe.e2e-harness.js";
import { subscribeEmbeddedPiSession } from "./pi-embedded-subscribe.js";

describe("subscribeEmbeddedPiSession thinking tag code span awareness", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function createPartialReplyHarness() {
    const { session, emit } = createStubSessionHarness();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onPartialReply = vi.fn();

    subscribeEmbeddedPiSession({
      session,
      runId: "run",
      onPartialReply,
    });

    return { emit, onPartialReply };
  }

  it("does not strip thinking tags inside inline code backticks", () => {
    const { emit, onPartialReply } = createPartialReplyHarness();

    emitAssistantTextDelta({
      emit,
      delta: "The fix strips leaked `<thinking>` tags from messages.",
    });

    expect(onPartialReply).toHaveBeenCalled();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const lastCall = onPartialReply.mock.calls[onPartialReply.mock.calls.length - 1];
    expect(lastCall[0].text).toContain("`<thinking>`");
  });

  it("does not strip thinking tags inside fenced code blocks", () => {
    const { emit, onPartialReply } = createPartialReplyHarness();

    emitAssistantTextDelta({
      emit,
      delta: "Example:\n  ````\n<thinking>code example</thinking>\n  ````\nDone.",
    });

    expect(onPartialReply).toHaveBeenCalled();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const lastCall = onPartialReply.mock.calls[onPartialReply.mock.calls.length - 1];
    expect(lastCall[0].text).toContain("<thinking>code example</thinking>");
  });

  it("still strips actual thinking tags outside code spans", () => {
    const { emit, onPartialReply } = createPartialReplyHarness();

    emitAssistantTextDelta({
      emit,
      delta: "Hello <thinking>internal thought</thinking> world",
    });

    expect(onPartialReply).toHaveBeenCalled();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const lastCall = onPartialReply.mock.calls[onPartialReply.mock.calls.length - 1];
    expect(lastCall[0].text).not.toContain("internal thought");
    expect(lastCall[0].text).toContain("Hello");
    expect(lastCall[0].text).toContain("world");
  });
});
