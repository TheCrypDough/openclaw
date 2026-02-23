/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-messaging.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getChannelPlugin, normalizeChannelId } from "../channels/plugins/index.js";

export type MessagingToolSend = {
  tool: string;
  provider: string;
  accountId?: string;
  to?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CORE_MESSAGING_TOOLS = new Set(["sessions_send", "message"]);

// Provider docking: any plugin with `actions` opts into messaging tool handling.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isMessagingTool(toolName: string): boolean {
  if (CORE_MESSAGING_TOOLS.has(toolName)) {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providerId = normalizeChannelId(toolName);
  return Boolean(providerId && getChannelPlugin(providerId)?.actions);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isMessagingToolSendAction(
  toolName: string,
  args: Record<string, unknown>,
): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const action = typeof args.action === "string" ? args.action.trim() : "";
  if (toolName === "sessions_send") {
    return true;
  }
  if (toolName === "message") {
    return action === "send" || action === "thread-reply";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providerId = normalizeChannelId(toolName);
  if (!providerId) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const plugin = getChannelPlugin(providerId);
  if (!plugin?.actions?.extractToolSend) {
    return false;
  }
  return Boolean(plugin.actions.extractToolSend({ args })?.to);
}
