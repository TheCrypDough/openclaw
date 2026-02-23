/*
 * AUTO ANNOTATION
 * File: src/infra/outbound/tool-payload.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentToolResult } from "@mariozechner/pi-agent-core";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractToolPayload(result: AgentToolResult<unknown>): unknown {
  if (result.details !== undefined) {
    return result.details;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const textBlock = Array.isArray(result.content)
    ? result.content.find(
        (block) =>
          block &&
          typeof block === "object" &&
          (block as { type?: unknown }).type === "text" &&
          typeof (block as { text?: unknown }).text === "string",
      )
    : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const text = (textBlock as { text?: string } | undefined)?.text;
  if (text) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return result.content ?? result;
}
