/*
 * AUTO ANNOTATION
 * File: src/agents/tool-summaries.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentTool } from "@mariozechner/pi-agent-core";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildToolSummaryMap(tools: AgentTool[]): Record<string, string> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const summaries: Record<string, string> = {};
  for (const tool of tools) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const summary = tool.description?.trim() || tool.label?.trim();
    if (!summary) {
      continue;
    }
    summaries[tool.name.toLowerCase()] = summary;
  }
  return summaries;
}
