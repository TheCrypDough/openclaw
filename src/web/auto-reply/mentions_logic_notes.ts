/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply/mentions.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { buildMentionRegexes, normalizeMentionText } from "../../auto-reply/reply/mentions.js";
import type { loadConfig } from "../../config/config.js";
import { isSelfChatMode, jidToE164, normalizeE164 } from "../../utils.js";
import type { WebInboundMsg } from "./types.js";

export type MentionConfig = {
  mentionRegexes: RegExp[];
  allowFrom?: Array<string | number>;
};

export type MentionTargets = {
  normalizedMentions: string[];
  selfE164: string | null;
  selfJid: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildMentionConfig(
  cfg: ReturnType<typeof loadConfig>,
  agentId?: string,
): MentionConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mentionRegexes = buildMentionRegexes(cfg, agentId);
  return { mentionRegexes, allowFrom: cfg.channels?.whatsapp?.allowFrom };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveMentionTargets(msg: WebInboundMsg, authDir?: string): MentionTargets {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const jidOptions = authDir ? { authDir } : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedMentions = msg.mentionedJids?.length
    ? msg.mentionedJids.map((jid) => jidToE164(jid, jidOptions) ?? jid).filter(Boolean)
    : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const selfE164 = msg.selfE164 ?? (msg.selfJid ? jidToE164(msg.selfJid, jidOptions) : null);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const selfJid = msg.selfJid ? msg.selfJid.replace(/:\\d+/, "") : null;
  return { normalizedMentions, selfE164, selfJid };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isBotMentionedFromTargets(
  msg: WebInboundMsg,
  mentionCfg: MentionConfig,
  targets: MentionTargets,
): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const clean = (text: string) =>
    // Remove zero-width and directionality markers WhatsApp injects around display names
    normalizeMentionText(text);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isSelfChat = isSelfChatMode(targets.selfE164, mentionCfg.allowFrom);

  const hasMentions = (msg.mentionedJids?.length ?? 0) > 0;
  if (hasMentions && !isSelfChat) {
    if (targets.selfE164 && targets.normalizedMentions.includes(targets.selfE164)) {
      return true;
    }
    if (targets.selfJid) {
      // Some mentions use the bare JID; match on E.164 to be safe.
      if (targets.normalizedMentions.includes(targets.selfJid)) {
        return true;
      }
    }
    // If the message explicitly mentions someone else, do not fall back to regex matches.
    return false;
  } else if (hasMentions && isSelfChat) {
    // Self-chat mode: ignore WhatsApp @mention JIDs, otherwise @mentioning the owner in group chats triggers the bot.
  }
  const bodyClean = clean(msg.body);
  if (mentionCfg.mentionRegexes.some((re) => re.test(bodyClean))) {
    return true;
  }

  // Fallback: detect body containing our own number (with or without +, spacing)
  if (targets.selfE164) {
    const selfDigits = targets.selfE164.replace(/\D/g, "");
    if (selfDigits) {
      const bodyDigits = bodyClean.replace(/[^\d]/g, "");
      if (bodyDigits.includes(selfDigits)) {
        return true;
      }
      const bodyNoSpace = msg.body.replace(/[\s-]/g, "");
      const pattern = new RegExp(`\\+?${selfDigits}`, "i");
      if (pattern.test(bodyNoSpace)) {
        return true;
      }
    }
  }

  return false;
}

export function debugMention(
  msg: WebInboundMsg,
  mentionCfg: MentionConfig,
  authDir?: string,
): { wasMentioned: boolean; details: Record<string, unknown> } {
  const mentionTargets = resolveMentionTargets(msg, authDir);
  const result = isBotMentionedFromTargets(msg, mentionCfg, mentionTargets);
  const details = {
    from: msg.from,
    body: msg.body,
    bodyClean: normalizeMentionText(msg.body),
    mentionedJids: msg.mentionedJids ?? null,
    normalizedMentionedJids: mentionTargets.normalizedMentions.length
      ? mentionTargets.normalizedMentions
      : null,
    selfJid: msg.selfJid ?? null,
    selfJidBare: mentionTargets.selfJid,
    selfE164: msg.selfE164 ?? null,
    resolvedSelfE164: mentionTargets.selfE164,
  };
  return { wasMentioned: result, details };
}

export function resolveOwnerList(mentionCfg: MentionConfig, selfE164?: string | null) {
  const allowFrom = mentionCfg.allowFrom;
  const raw =
    Array.isArray(allowFrom) && allowFrom.length > 0 ? allowFrom : selfE164 ? [selfE164] : [];
  return raw
    .filter((entry): entry is string => Boolean(entry && entry !== "*"))
    .map((entry) => normalizeE164(entry))
    .filter((entry): entry is string => Boolean(entry));
}
