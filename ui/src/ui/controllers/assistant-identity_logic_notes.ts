/*
 * AUTO ANNOTATION
 * File: ui/src/ui/controllers/assistant-identity.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeAssistantIdentity } from "../assistant-identity.ts";
import type { GatewayBrowserClient } from "../gateway.ts";

export type AssistantIdentityState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  sessionKey: string;
  assistantName: string;
  assistantAvatar: string | null;
  assistantAgentId: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function loadAssistantIdentity(
  state: AssistantIdentityState,
  opts?: { sessionKey?: string },
) {
  if (!state.client || !state.connected) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sessionKey = opts?.sessionKey?.trim() || state.sessionKey.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const params = sessionKey ? { sessionKey } : {};
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await state.client.request("agent.identity.get", params);
    if (!res) {
      return;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = normalizeAssistantIdentity(res);
    state.assistantName = normalized.name;
    state.assistantAvatar = normalized.avatar;
    state.assistantAgentId = normalized.agentId ?? null;
  } catch {
    // Ignore errors; keep last known identity.
  }
}
