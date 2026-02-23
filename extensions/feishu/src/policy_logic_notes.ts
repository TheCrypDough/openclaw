/*
 * AUTO ANNOTATION
 * File: extensions/feishu/src/policy.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type {
  AllowlistMatch,
  ChannelGroupContext,
  GroupToolPolicyConfig,
} from "openclaw/plugin-sdk";
import { resolveAllowlistMatchSimple } from "openclaw/plugin-sdk";
import type { FeishuConfig, FeishuGroupConfig } from "./types.js";

export type FeishuAllowlistMatch = AllowlistMatch<"wildcard" | "id" | "name">;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveFeishuAllowlistMatch(params: {
  allowFrom: Array<string | number>;
  senderId: string;
  senderName?: string | null;
}): FeishuAllowlistMatch {
  return resolveAllowlistMatchSimple(params);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveFeishuGroupConfig(params: {
  cfg?: FeishuConfig;
  groupId?: string | null;
}): FeishuGroupConfig | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groups = params.cfg?.groups ?? {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupId = params.groupId?.trim();
  if (!groupId) {
    return undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const direct = groups[groupId];
  if (direct) {
    return direct;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lowered = groupId.toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matchKey = Object.keys(groups).find((key) => key.toLowerCase() === lowered);
  return matchKey ? groups[matchKey] : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveFeishuGroupToolPolicy(
  params: ChannelGroupContext,
): GroupToolPolicyConfig | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = params.cfg.channels?.feishu as FeishuConfig | undefined;
  if (!cfg) {
    return undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupConfig = resolveFeishuGroupConfig({
    cfg,
    groupId: params.groupId,
  });

  return groupConfig?.tools;
}

export function isFeishuGroupAllowed(params: {
  groupPolicy: "open" | "allowlist" | "disabled";
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
  return resolveFeishuAllowlistMatch(params).allowed;
}

export function resolveFeishuReplyPolicy(params: {
  isDirectMessage: boolean;
  globalConfig?: FeishuConfig;
  groupConfig?: FeishuGroupConfig;
}): { requireMention: boolean } {
  if (params.isDirectMessage) {
    return { requireMention: false };
  }

  const requireMention =
    params.groupConfig?.requireMention ?? params.globalConfig?.requireMention ?? true;

  return { requireMention };
}
