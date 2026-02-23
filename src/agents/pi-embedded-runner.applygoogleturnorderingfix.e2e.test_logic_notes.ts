/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner.applygoogleturnorderingfix.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentMessage } from "@mariozechner/pi-agent-core";
import { SessionManager } from "@mariozechner/pi-coding-agent";
import { describe, expect, it, vi } from "vitest";
import { applyGoogleTurnOrderingFix } from "./pi-embedded-runner.js";

describe("applyGoogleTurnOrderingFix", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const makeAssistantFirst = (): AgentMessage[] => [
    {
      role: "assistant",
      content: [{ type: "toolCall", id: "call_1", name: "exec", arguments: {} }],
    } as unknown as AgentMessage,
  ];

  it("prepends a bootstrap once and records a marker for Google models", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sessionManager = SessionManager.inMemory();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const warn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const input = makeAssistantFirst();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const first = applyGoogleTurnOrderingFix({
      messages: input,
      modelApi: "google-generative-ai",
      sessionManager,
      sessionId: "session:1",
      warn,
    });
    expect(first.messages[0]?.role).toBe("user");
    expect(first.messages[1]?.role).toBe("assistant");
    expect(warn).toHaveBeenCalledTimes(1);
    expect(
      sessionManager
        .getEntries()
        .some(
          (entry) =>
            entry.type === "custom" && entry.customType === "google-turn-ordering-bootstrap",
        ),
    ).toBe(true);

    applyGoogleTurnOrderingFix({
      messages: input,
      modelApi: "google-generative-ai",
      sessionManager,
      sessionId: "session:1",
      warn,
    });
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("skips non-Google models", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sessionManager = SessionManager.inMemory();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const warn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const input = makeAssistantFirst();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = applyGoogleTurnOrderingFix({
      messages: input,
      modelApi: "openai",
      sessionManager,
      sessionId: "session:2",
      warn,
    });
    expect(result.messages).toBe(input);
    expect(warn).not.toHaveBeenCalled();
  });
});
