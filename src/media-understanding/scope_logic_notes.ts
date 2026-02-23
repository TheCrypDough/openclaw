/*
 * AUTO ANNOTATION
 * File: src/media-understanding/scope.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeChatType } from "../channels/chat-type.js";
import type { MediaUnderstandingScopeConfig } from "../config/types.tools.js";

export type MediaUnderstandingScopeDecision = "allow" | "deny";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeDecision(value?: string | null): MediaUnderstandingScopeDecision | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = value?.trim().toLowerCase();
  if (normalized === "allow") {
    return "allow";
  }
  if (normalized === "deny") {
    return "deny";
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeMatch(value?: string | null): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = value?.trim().toLowerCase();
  return normalized || undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeMediaUnderstandingChatType(raw?: string | null): string | undefined {
  return normalizeChatType(raw ?? undefined);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveMediaUnderstandingScope(params: {
  scope?: MediaUnderstandingScopeConfig;
  sessionKey?: string;
  channel?: string;
  chatType?: string;
}): MediaUnderstandingScopeDecision {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const scope = params.scope;
  if (!scope) {
    return "allow";
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channel = normalizeMatch(params.channel);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chatType = normalizeMediaUnderstandingChatType(params.chatType);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sessionKey = normalizeMatch(params.sessionKey) ?? "";

  for (const rule of scope.rules ?? []) {
    if (!rule) {
      continue;
    }
    const action = normalizeDecision(rule.action) ?? "allow";
    const match = rule.match ?? {};
    const matchChannel = normalizeMatch(match.channel);
    const matchChatType = normalizeMediaUnderstandingChatType(match.chatType);
    const matchPrefix = normalizeMatch(match.keyPrefix);

    if (matchChannel && matchChannel !== channel) {
      continue;
    }
    if (matchChatType && matchChatType !== chatType) {
      continue;
    }
    if (matchPrefix && !sessionKey.startsWith(matchPrefix)) {
      continue;
    }
    return action;
  }

  return normalizeDecision(scope.default) ?? "allow";
}
