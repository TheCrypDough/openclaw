/*
 * AUTO ANNOTATION
 * File: src/agents/test-helpers/assistant-message-fixtures.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AssistantMessage } from "@mariozechner/pi-ai";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ZERO_USAGE: AssistantMessage["usage"] = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
  totalTokens: 0,
  cost: {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    total: 0,
  },
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function makeAssistantMessageFixture(
  overrides: Partial<AssistantMessage> = {},
): AssistantMessage {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const errorText = typeof overrides.errorMessage === "string" ? overrides.errorMessage : "error";
  return {
    role: "assistant",
    api: "openai-responses",
    provider: "openai",
    model: "test-model",
    usage: ZERO_USAGE,
    timestamp: 0,
    stopReason: "error",
    errorMessage: errorText,
    content: [{ type: "text", text: errorText }],
    ...overrides,
  };
}
