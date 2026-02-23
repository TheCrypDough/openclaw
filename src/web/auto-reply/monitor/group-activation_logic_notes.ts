/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply/monitor/group-activation.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeGroupActivation } from "../../../auto-reply/group-activation.js";
import type { loadConfig } from "../../../config/config.js";
import {
  resolveChannelGroupPolicy,
  resolveChannelGroupRequireMention,
} from "../../../config/group-policy.js";
import {
  loadSessionStore,
  resolveGroupSessionKey,
  resolveStorePath,
} from "../../../config/sessions.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveGroupPolicyFor(cfg: ReturnType<typeof loadConfig>, conversationId: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupId = resolveGroupSessionKey({
    From: conversationId,
    ChatType: "group",
    Provider: "whatsapp",
  })?.id;
  return resolveChannelGroupPolicy({
    cfg,
    channel: "whatsapp",
    groupId: groupId ?? conversationId,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveGroupRequireMentionFor(
  cfg: ReturnType<typeof loadConfig>,
  conversationId: string,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupId = resolveGroupSessionKey({
    From: conversationId,
    ChatType: "group",
    Provider: "whatsapp",
  })?.id;
  return resolveChannelGroupRequireMention({
    cfg,
    channel: "whatsapp",
    groupId: groupId ?? conversationId,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveGroupActivationFor(params: {
  cfg: ReturnType<typeof loadConfig>;
  agentId: string;
  sessionKey: string;
  conversationId: string;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storePath = resolveStorePath(params.cfg.session?.store, {
    agentId: params.agentId,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const store = loadSessionStore(storePath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entry = store[params.sessionKey];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requireMention = resolveGroupRequireMentionFor(params.cfg, params.conversationId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const defaultActivation = !requireMention ? "always" : "mention";
  return normalizeGroupActivation(entry?.groupActivation) ?? defaultActivation;
}
