/*
 * AUTO ANNOTATION
 * File: src/gateway/agent-event-assistant-text.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentEventPayload } from "../infra/agent-events.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveAssistantStreamDeltaText(evt: AgentEventPayload): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const delta = evt.data.delta;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const text = evt.data.text;
  return typeof delta === "string" ? delta : typeof text === "string" ? text : "";
}
