/*
 * AUTO ANNOTATION
 * File: src/channels/chat-type.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type ChatType = "direct" | "group" | "channel";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeChatType(raw?: string): ChatType | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = raw?.trim().toLowerCase();
  if (!value) {
    return undefined;
  }
  if (value === "direct" || value === "dm") {
    return "direct";
  }
  if (value === "group") {
    return "group";
  }
  if (value === "channel") {
    return "channel";
  }
  return undefined;
}
