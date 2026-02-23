/*
 * AUTO ANNOTATION
 * File: src/sessions/send-policy.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeChatType } from "../channels/chat-type.js";
import type { OpenClawConfig } from "../config/config.js";
import type { SessionChatType, SessionEntry } from "../config/sessions.js";

export type SessionSendPolicyDecision = "allow" | "deny";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeSendPolicy(raw?: string | null): SessionSendPolicyDecision | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = raw?.trim().toLowerCase();
  if (value === "allow") {
    return "allow";
  }
  if (value === "deny") {
    return "deny";
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeMatchValue(raw?: string | null) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = raw?.trim().toLowerCase();
  return value ? value : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function stripAgentSessionKeyPrefix(key?: string): string | undefined {
  if (!key) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parts = key.split(":").filter(Boolean);
  // Canonical agent session keys: agent:<agentId>:<sessionKey...>
  if (parts.length >= 3 && parts[0] === "agent") {
    return parts.slice(2).join(":");
  }
  return key;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function deriveChannelFromKey(key?: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedKey = stripAgentSessionKeyPrefix(key);
  if (!normalizedKey) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parts = normalizedKey.split(":").filter(Boolean);
  if (parts.length >= 3 && (parts[1] === "group" || parts[1] === "channel")) {
    return normalizeMatchValue(parts[0]);
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function deriveChatTypeFromKey(key?: string): SessionChatType | undefined {
  const normalizedKey = stripAgentSessionKeyPrefix(key);
  if (!normalizedKey) {
    return undefined;
  }
  if (normalizedKey.includes(":group:")) {
    return "group";
  }
  if (normalizedKey.includes(":channel:")) {
    return "channel";
  }
  return undefined;
}

export function resolveSendPolicy(params: {
  cfg: OpenClawConfig;
  entry?: SessionEntry;
  sessionKey?: string;
  channel?: string;
  chatType?: SessionChatType;
}): SessionSendPolicyDecision {
  const override = normalizeSendPolicy(params.entry?.sendPolicy);
  if (override) {
    return override;
  }

  const policy = params.cfg.session?.sendPolicy;
  if (!policy) {
    return "allow";
  }

  const channel =
    normalizeMatchValue(params.channel) ??
    normalizeMatchValue(params.entry?.channel) ??
    normalizeMatchValue(params.entry?.lastChannel) ??
    deriveChannelFromKey(params.sessionKey);
  const chatType =
    normalizeChatType(params.chatType ?? params.entry?.chatType) ??
    normalizeChatType(deriveChatTypeFromKey(params.sessionKey));
  const rawSessionKey = params.sessionKey ?? "";
  const strippedSessionKey = stripAgentSessionKeyPrefix(rawSessionKey) ?? "";
  const rawSessionKeyNorm = rawSessionKey.toLowerCase();
  const strippedSessionKeyNorm = strippedSessionKey.toLowerCase();

  let allowedMatch = false;
  for (const rule of policy.rules ?? []) {
    if (!rule) {
      continue;
    }
    const action = normalizeSendPolicy(rule.action) ?? "allow";
    const match = rule.match ?? {};
    const matchChannel = normalizeMatchValue(match.channel);
    const matchChatType = normalizeChatType(match.chatType);
    const matchPrefix = normalizeMatchValue(match.keyPrefix);
    const matchRawPrefix = normalizeMatchValue(match.rawKeyPrefix);

    if (matchChannel && matchChannel !== channel) {
      continue;
    }
    if (matchChatType && matchChatType !== chatType) {
      continue;
    }
    if (matchRawPrefix && !rawSessionKeyNorm.startsWith(matchRawPrefix)) {
      continue;
    }
    if (
      matchPrefix &&
      !rawSessionKeyNorm.startsWith(matchPrefix) &&
      !strippedSessionKeyNorm.startsWith(matchPrefix)
    ) {
      continue;
    }
    if (action === "deny") {
      return "deny";
    }
    allowedMatch = true;
  }

  if (allowedMatch) {
    return "allow";
  }

  const fallback = normalizeSendPolicy(policy.default);
  return fallback ?? "allow";
}
