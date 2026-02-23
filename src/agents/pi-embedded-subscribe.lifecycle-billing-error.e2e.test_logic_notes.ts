/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-subscribe.lifecycle-billing-error.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AssistantMessage } from "@mariozechner/pi-ai";
import { describe, expect, it, vi } from "vitest";
import { createStubSessionHarness } from "./pi-embedded-subscribe.e2e-harness.js";
import { subscribeEmbeddedPiSession } from "./pi-embedded-subscribe.js";

describe("subscribeEmbeddedPiSession lifecycle billing errors", () => {
  it("includes provider and model context in lifecycle billing errors", () => {
    const { session, emit } = createStubSessionHarness();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onAgentEvent = vi.fn();

    subscribeEmbeddedPiSession({
      session,
      runId: "run-billing-error",
      onAgentEvent,
      sessionKey: "test-session",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const assistantMessage = {
      role: "assistant",
      stopReason: "error",
      errorMessage: "insufficient credits",
      provider: "Anthropic",
      model: "claude-3-5-sonnet",
    } as AssistantMessage;

    emit({ type: "message_update", message: assistantMessage });
    emit({ type: "agent_end" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const lifecycleError = onAgentEvent.mock.calls.find(
      (call) => call[0]?.stream === "lifecycle" && call[0]?.data?.phase === "error",
    );
    expect(lifecycleError).toBeDefined();
    expect(lifecycleError?.[0]?.data?.error).toContain("Anthropic (claude-3-5-sonnet)");
  });
});
