/*
 * AUTO ANNOTATION
 * File: src/config/sessions/session-key.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MsgContext } from "../../auto-reply/templating.js";
import {
  buildAgentMainSessionKey,
  DEFAULT_AGENT_ID,
  normalizeMainKey,
} from "../../routing/session-key.js";
import { normalizeE164 } from "../../utils.js";
import { resolveGroupSessionKey } from "./group.js";
import type { SessionScope } from "./types.js";

// Decide which session bucket to use (per-sender vs global).
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function deriveSessionKey(scope: SessionScope, ctx: MsgContext) {
  if (scope === "global") {
    return "global";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedGroup = resolveGroupSessionKey(ctx);
  if (resolvedGroup) {
    return resolvedGroup.key;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const from = ctx.From ? normalizeE164(ctx.From) : "";
  return from || "unknown";
}

/**
 * Resolve the session key with a canonical direct-chat bucket (default: "main").
 * All non-group direct chats collapse to this bucket; groups stay isolated.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSessionKey(scope: SessionScope, ctx: MsgContext, mainKey?: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const explicit = ctx.SessionKey?.trim();
  if (explicit) {
    return explicit.toLowerCase();
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = deriveSessionKey(scope, ctx);
  if (scope === "global") {
    return raw;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const canonicalMainKey = normalizeMainKey(mainKey);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const canonical = buildAgentMainSessionKey({
    agentId: DEFAULT_AGENT_ID,
    mainKey: canonicalMainKey,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isGroup = raw.includes(":group:") || raw.includes(":channel:");
  if (!isGroup) {
    return canonical;
  }
  return `agent:${DEFAULT_AGENT_ID}:${raw}`;
}
