# AUTOPLACEHOLDER_ANNOTATION: src/slack/monitor/channel-config.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import {
  applyChannelMatchMeta,
  buildChannelKeyCandidates,
  resolveChannelEntryMatchWithFallback,
  type ChannelMatchSource,
} from "../../channels/channel-config.js";
import type { SlackReactionNotificationMode } from "../../config/config.js";
import type { SlackMessageEvent } from "../types.js";
import { allowListMatches, normalizeAllowListLower, normalizeSlackSlug } from "./allow-list.js";

export type SlackChannelConfigResolved = {
  allowed: boolean;
  requireMention: boolean;
  allowBots?: boolean;
  users?: Array<string | number>;
  skills?: string[];
  systemPrompt?: string;
  matchKey?: string;
  matchSource?: ChannelMatchSource;
};

export type SlackChannelConfigEntry = {
  enabled?: boolean;
  allow?: boolean;
  requireMention?: boolean;
  allowBots?: boolean;
  users?: Array<string | number>;
  skills?: string[];
  systemPrompt?: string;
};

export type SlackChannelConfigEntries = Record<string, SlackChannelConfigEntry>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function firstDefined<T>(...values: Array<T | undefined>) {
  for (const value of values) {
    if (typeof value !== "undefined") {
      return value;
    }
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function shouldEmitSlackReactionNotification(params: {
  mode: SlackReactionNotificationMode | undefined;
  botId?: string | null;
  messageAuthorId?: string | null;
  userId: string;
  userName?: string | null;
  allowlist?: Array<string | number> | null;
}) {
  const { mode, botId, messageAuthorId, userId, userName, allowlist } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const effectiveMode = mode ?? "own";
  if (effectiveMode === "off") {
    return false;
  }
  if (effectiveMode === "own") {
    if (!botId || !messageAuthorId) {
      return false;
    }
    return messageAuthorId === botId;
  }
  if (effectiveMode === "allowlist") {
    if (!Array.isArray(allowlist) || allowlist.length === 0) {
      return false;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const users = normalizeAllowListLower(allowlist);
    return allowListMatches({
      allowList: users,
      id: userId,
      name: userName ?? undefined,
    });
  }
  return true;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSlackChannelLabel(params: { channelId?: string; channelName?: string }) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelName = params.channelName?.trim();
  if (channelName) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const slug = normalizeSlackSlug(channelName);
    return `#${slug || channelName}`;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelId = params.channelId?.trim();
  return channelId ? `#${channelId}` : "unknown channel";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSlackChannelConfig(params: {
  channelId: string;
  channelName?: string;
  channels?: SlackChannelConfigEntries;
  defaultRequireMention?: boolean;
}): SlackChannelConfigResolved | null {
  const { channelId, channelName, channels, defaultRequireMention } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entries = channels ?? {};
  const keys = Object.keys(entries);
  const normalizedName = channelName ? normalizeSlackSlug(channelName) : "";
  const directName = channelName ? channelName.trim() : "";
  const candidates = buildChannelKeyCandidates(
    channelId,
    channelName ? `#${directName}` : undefined,
    directName,
    normalizedName,
  );
  const match = resolveChannelEntryMatchWithFallback({
    entries,
    keys: candidates,
    wildcardKey: "*",
  });
  const { entry: matched, wildcardEntry: fallback } = match;

  const requireMentionDefault = defaultRequireMention ?? true;
  if (keys.length === 0) {
    return { allowed: true, requireMention: requireMentionDefault };
  }
  if (!matched && !fallback) {
    return { allowed: false, requireMention: requireMentionDefault };
  }

  const resolved = matched ?? fallback ?? {};
  const allowed =
    firstDefined(resolved.enabled, resolved.allow, fallback?.enabled, fallback?.allow, true) ??
    true;
  const requireMention =
    firstDefined(resolved.requireMention, fallback?.requireMention, requireMentionDefault) ??
    requireMentionDefault;
  const allowBots = firstDefined(resolved.allowBots, fallback?.allowBots);
  const users = firstDefined(resolved.users, fallback?.users);
  const skills = firstDefined(resolved.skills, fallback?.skills);
  const systemPrompt = firstDefined(resolved.systemPrompt, fallback?.systemPrompt);
  const result: SlackChannelConfigResolved = {
    allowed,
    requireMention,
    allowBots,
    users,
    skills,
    systemPrompt,
  };
  return applyChannelMatchMeta(result, match);
}

export type { SlackMessageEvent };
