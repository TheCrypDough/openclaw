/*
 * AUTO ANNOTATION
 * File: src/gateway/session-preview.test-helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createToolSummaryPreviewTranscriptLines(sessionId: string): string[] {
  return [
    JSON.stringify({ type: "session", version: 1, id: sessionId }),
    JSON.stringify({ message: { role: "user", content: "Hello" } }),
    JSON.stringify({ message: { role: "assistant", content: "Hi" } }),
    JSON.stringify({
      message: { role: "assistant", content: [{ type: "toolcall", name: "weather" }] },
    }),
    JSON.stringify({ message: { role: "assistant", content: "Forecast ready" } }),
  ];
}
