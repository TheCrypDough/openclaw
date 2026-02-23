/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner/thinking.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentMessage } from "@mariozechner/pi-agent-core";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AssistantContentBlock = Extract<AgentMessage, { role: "assistant" }>["content"][number];

/**
 * Strip all `type: "thinking"` content blocks from assistant messages.
 *
 * If an assistant message becomes empty after stripping, it is replaced with
 * a synthetic `{ type: "text", text: "" }` block to preserve turn structure
 * (some providers require strict user/assistant alternation).
 *
 * Returns the original array reference when nothing was changed (callers can
 * use reference equality to skip downstream work).
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function dropThinkingBlocks(messages: AgentMessage[]): AgentMessage[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let touched = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const out: AgentMessage[] = [];
  for (const msg of messages) {
    if (!msg || typeof msg !== "object" || msg.role !== "assistant") {
      out.push(msg);
      continue;
    }
    if (!Array.isArray(msg.content)) {
      out.push(msg);
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const nextContent: AssistantContentBlock[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let changed = false;
    for (const block of msg.content) {
      if (block && typeof block === "object" && (block as { type?: unknown }).type === "thinking") {
        touched = true;
        changed = true;
        continue;
      }
      nextContent.push(block);
    }
    if (!changed) {
      out.push(msg);
      continue;
    }
    // Preserve the assistant turn even if all blocks were thinking-only.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const content =
      nextContent.length > 0 ? nextContent : [{ type: "text", text: "" } as AssistantContentBlock];
    out.push({ ...msg, content });
  }
  return touched ? out : messages;
}
