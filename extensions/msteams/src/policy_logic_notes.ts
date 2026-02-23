/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/policy.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type {
  AllowlistMatch,
  ChannelGroupContext,
  GroupPolicy,
  GroupToolPolicyConfig,
  MSTeamsChannelConfig,
  MSTeamsConfig,
  MSTeamsReplyStyle,
  MSTeamsTeamConfig,
} from "openclaw/plugin-sdk";
import {
  buildChannelKeyCandidates,
  normalizeChannelSlug,
  resolveAllowlistMatchSimple,
  resolveToolsBySender,
  resolveChannelEntryMatchWithFallback,
  resolveNestedAllowlistDecision,
} from "openclaw/plugin-sdk";

export type MSTeamsResolvedRouteConfig = {
  teamConfig?: MSTeamsTeamConfig;
  channelConfig?: MSTeamsChannelConfig;
  allowlistConfigured: boolean;
  allowed: boolean;
  teamKey?: string;
  channelKey?: string;
  channelMatchKey?: string;
  channelMatchSource?: "direct" | "wildcard";
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveMSTeamsRouteConfig(params: {
  cfg?: MSTeamsConfig;
  teamId?: string | null | undefined;
  teamName?: string | null | undefined;
  conversationId?: string | null | undefined;
  channelName?: string | null | undefined;
}): MSTeamsResolvedRouteConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const teamId = params.teamId?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const teamName = params.teamName?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const conversationId = params.conversationId?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelName = params.channelName?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const teams = params.cfg?.teams ?? {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allowlistConfigured = Object.keys(teams).length > 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const teamCandidates = buildChannelKeyCandidates(
    teamId,
    teamName,
    teamName ? normalizeChannelSlug(teamName) : undefined,
  );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const teamMatch = resolveChannelEntryMatchWithFallback({
    entries: teams,
    keys: teamCandidates,
    wildcardKey: "*",
    normalizeKey: normalizeChannelSlug,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const teamConfig = teamMatch.entry;
  const channels = teamConfig?.channels ?? {};
  const channelAllowlistConfigured = Object.keys(channels).length > 0;
  const channelCandidates = buildChannelKeyCandidates(
    conversationId,
    channelName,
    channelName ? normalizeChannelSlug(channelName) : undefined,
  );
  const channelMatch = resolveChannelEntryMatchWithFallback({
    entries: channels,
    keys: channelCandidates,
    wildcardKey: "*",
    normalizeKey: normalizeChannelSlug,
  });
  const channelConfig = channelMatch.entry;

  const allowed = resolveNestedAllowlistDecision({
    outerConfigured: allowlistConfigured,
    outerMatched: Boolean(teamConfig),
    innerConfigured: channelAllowlistConfigured,
    innerMatched: Boolean(channelConfig),
  });

  return {
    teamConfig,
    channelConfig,
    allowlistConfigured,
    allowed,
    teamKey: teamMatch.matchKey ?? teamMatch.key,
    channelKey: channelMatch.matchKey ?? channelMatch.key,
    channelMatchKey: channelMatch.matchKey,
    channelMatchSource:
      channelMatch.matchSource === "direct" || channelMatch.matchSource === "wildcard"
        ? channelMatch.matchSource
        : undefined,
  };
}

export function resolveMSTeamsGroupToolPolicy(
  params: ChannelGroupContext,
): GroupToolPolicyConfig | undefined {
  const cfg = params.cfg.channels?.msteams;
  if (!cfg) {
    return undefined;
  }
  const groupId = params.groupId?.trim();
  const groupChannel = params.groupChannel?.trim();
  const groupSpace = params.groupSpace?.trim();

  const resolved = resolveMSTeamsRouteConfig({
    cfg,
    teamId: groupSpace,
    teamName: groupSpace,
    conversationId: groupId,
    channelName: groupChannel,
  });

  if (resolved.channelConfig) {
    const senderPolicy = resolveToolsBySender({
      toolsBySender: resolved.channelConfig.toolsBySender,
      senderId: params.senderId,
      senderName: params.senderName,
      senderUsername: params.senderUsername,
      senderE164: params.senderE164,
    });
    if (senderPolicy) {
      return senderPolicy;
    }
    if (resolved.channelConfig.tools) {
      return resolved.channelConfig.tools;
    }
    const teamSenderPolicy = resolveToolsBySender({
      toolsBySender: resolved.teamConfig?.toolsBySender,
      senderId: params.senderId,
      senderName: params.senderName,
      senderUsername: params.senderUsername,
      senderE164: params.senderE164,
    });
    if (teamSenderPolicy) {
      return teamSenderPolicy;
    }
    return resolved.teamConfig?.tools;
  }
  if (resolved.teamConfig) {
    const teamSenderPolicy = resolveToolsBySender({
      toolsBySender: resolved.teamConfig.toolsBySender,
      senderId: params.senderId,
      senderName: params.senderName,
      senderUsername: params.senderUsername,
      senderE164: params.senderE164,
    });
    if (teamSenderPolicy) {
      return teamSenderPolicy;
    }
    if (resolved.teamConfig.tools) {
      return resolved.teamConfig.tools;
    }
  }

  if (!groupId) {
    return undefined;
  }

  const channelCandidates = buildChannelKeyCandidates(
    groupId,
    groupChannel,
    groupChannel ? normalizeChannelSlug(groupChannel) : undefined,
  );
  for (const teamConfig of Object.values(cfg.teams ?? {})) {
    const match = resolveChannelEntryMatchWithFallback({
      entries: teamConfig?.channels ?? {},
      keys: channelCandidates,
      wildcardKey: "*",
      normalizeKey: normalizeChannelSlug,
    });
    if (match.entry) {
      const senderPolicy = resolveToolsBySender({
        toolsBySender: match.entry.toolsBySender,
        senderId: params.senderId,
        senderName: params.senderName,
        senderUsername: params.senderUsername,
        senderE164: params.senderE164,
      });
      if (senderPolicy) {
        return senderPolicy;
      }
      if (match.entry.tools) {
        return match.entry.tools;
      }
      const teamSenderPolicy = resolveToolsBySender({
        toolsBySender: teamConfig?.toolsBySender,
        senderId: params.senderId,
        senderName: params.senderName,
        senderUsername: params.senderUsername,
        senderE164: params.senderE164,
      });
      if (teamSenderPolicy) {
        return teamSenderPolicy;
      }
      return teamConfig?.tools;
    }
  }

  return undefined;
}

export type MSTeamsReplyPolicy = {
  requireMention: boolean;
  replyStyle: MSTeamsReplyStyle;
};

export type MSTeamsAllowlistMatch = AllowlistMatch<"wildcard" | "id" | "name">;

export function resolveMSTeamsAllowlistMatch(params: {
  allowFrom: Array<string | number>;
  senderId: string;
  senderName?: string | null;
}): MSTeamsAllowlistMatch {
  return resolveAllowlistMatchSimple(params);
}

export function resolveMSTeamsReplyPolicy(params: {
  isDirectMessage: boolean;
  globalConfig?: MSTeamsConfig;
  teamConfig?: MSTeamsTeamConfig;
  channelConfig?: MSTeamsChannelConfig;
}): MSTeamsReplyPolicy {
  if (params.isDirectMessage) {
    return { requireMention: false, replyStyle: "thread" };
  }

  const requireMention =
    params.channelConfig?.requireMention ??
    params.teamConfig?.requireMention ??
    params.globalConfig?.requireMention ??
    true;

  const explicitReplyStyle =
    params.channelConfig?.replyStyle ??
    params.teamConfig?.replyStyle ??
    params.globalConfig?.replyStyle;

  const replyStyle: MSTeamsReplyStyle =
    explicitReplyStyle ?? (requireMention ? "thread" : "top-level");

  return { requireMention, replyStyle };
}

export function isMSTeamsGroupAllowed(params: {
  groupPolicy: GroupPolicy;
  allowFrom: Array<string | number>;
  senderId: string;
  senderName?: string | null;
}): boolean {
  const { groupPolicy } = params;
  if (groupPolicy === "disabled") {
    return false;
  }
  if (groupPolicy === "open") {
    return true;
  }
  return resolveMSTeamsAllowlistMatch(params).allowed;
}
