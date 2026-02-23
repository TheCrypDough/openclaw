/*
 * AUTO ANNOTATION
 * File: src/plugin-sdk/tool-send.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractToolSend(
  args: Record<string, unknown>,
  expectedAction = "sendMessage",
): { to: string; accountId?: string } | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const action = typeof args.action === "string" ? args.action.trim() : "";
  if (action !== expectedAction) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const to = typeof args.to === "string" ? args.to : undefined;
  if (!to) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = typeof args.accountId === "string" ? args.accountId.trim() : undefined;
  return { to, accountId };
}
