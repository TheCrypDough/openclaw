/*
 * AUTO ANNOTATION
 * File: src/gateway/server-session-key.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { loadConfig } from "../config/config.js";
import { loadSessionStore, resolveStorePath } from "../config/sessions.js";
import { getAgentRunContext, registerAgentRunContext } from "../infra/agent-events.js";
import { toAgentRequestSessionKey } from "../routing/session-key.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSessionKeyForRun(runId: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cached = getAgentRunContext(runId)?.sessionKey;
  if (cached) {
    return cached;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storePath = resolveStorePath(cfg.session?.store);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const store = loadSessionStore(storePath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const found = Object.entries(store).find(([, entry]) => entry?.sessionId === runId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storeKey = found?.[0];
  if (storeKey) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sessionKey = toAgentRequestSessionKey(storeKey) ?? storeKey;
    registerAgentRunContext(runId, { sessionKey });
    return sessionKey;
  }
  return undefined;
}
