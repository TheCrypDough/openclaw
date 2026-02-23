/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner.openai-tool-id-preservation.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentMessage } from "@mariozechner/pi-agent-core";
import { describe, expect, it } from "vitest";
import {
  makeInMemorySessionManager,
  makeModelSnapshotEntry,
} from "./pi-embedded-runner.sanitize-session-history.test-harness.js";
import { sanitizeSessionHistory } from "./pi-embedded-runner/google.js";

describe("sanitizeSessionHistory openai tool id preservation", () => {
  it("keeps canonical call_id|fc_id pairings for same-model openai replay", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sessionEntries = [
      makeModelSnapshotEntry({
        provider: "openai",
        modelApi: "openai-responses",
        modelId: "gpt-5.2-codex",
      }),
    ];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sessionManager = makeInMemorySessionManager(sessionEntries);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const messages: AgentMessage[] = [
      {
        role: "assistant",
        content: [{ type: "toolCall", id: "call_123|fc_123", name: "noop", arguments: {} }],
      } as unknown as AgentMessage,
      {
        role: "toolResult",
        toolCallId: "call_123|fc_123",
        toolName: "noop",
        content: [{ type: "text", text: "ok" }],
        isError: false,
      } as unknown as AgentMessage,
    ];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await sanitizeSessionHistory({
      messages,
      modelApi: "openai-responses",
      provider: "openai",
      modelId: "gpt-5.2-codex",
      sessionManager,
      sessionId: "test-session",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const assistant = result[0] as { content?: Array<{ type?: string; id?: string }> };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const toolCall = assistant.content?.find((block) => block.type === "toolCall");
    expect(toolCall?.id).toBe("call_123|fc_123");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const toolResult = result[1] as { toolCallId?: string };
    expect(toolResult.toolCallId).toBe("call_123|fc_123");
  });
});
