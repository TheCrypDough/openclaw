/*
 * AUTO ANNOTATION
 * File: src/gateway/test-helpers.agent-results.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AgentDeltaEvent = {
  runId: string;
  stream: "assistant";
  data: { delta: string };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractPayloadText(result: unknown): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const record = result as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payloads = Array.isArray(record.payloads) ? record.payloads : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const texts = payloads
    .map((p) => (p && typeof p === "object" ? (p as Record<string, unknown>).text : undefined))
    .filter((t): t is string => typeof t === "string" && t.trim().length > 0);
  return texts.join("\n").trim();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildAssistantDeltaResult(params: {
  opts: unknown;
  emit: (event: AgentDeltaEvent) => void;
  deltas: string[];
  text: string;
}): { payloads: Array<{ text: string }> } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const runId = (params.opts as { runId?: string } | undefined)?.runId ?? "";
  for (const delta of params.deltas) {
    params.emit({ runId, stream: "assistant", data: { delta } });
  }
  return { payloads: [{ text: params.text }] };
}
