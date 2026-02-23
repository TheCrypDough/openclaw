/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/group-mentions.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChannelGroupContext, GroupToolPolicyConfig } from "openclaw/plugin-sdk";
import { resolveMatrixAccountConfig } from "./matrix/accounts.js";
import { resolveMatrixRoomConfig } from "./matrix/monitor/rooms.js";
import type { CoreConfig } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function stripLeadingPrefixCaseInsensitive(value: string, prefix: string): string {
  return value.toLowerCase().startsWith(prefix.toLowerCase())
    ? value.slice(prefix.length).trim()
    : value;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveMatrixRoomConfigForGroup(params: ChannelGroupContext) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rawGroupId = params.groupId?.trim() ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let roomId = rawGroupId;
  roomId = stripLeadingPrefixCaseInsensitive(roomId, "matrix:");
  roomId = stripLeadingPrefixCaseInsensitive(roomId, "channel:");
  roomId = stripLeadingPrefixCaseInsensitive(roomId, "room:");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupChannel = params.groupChannel?.trim() ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const aliases = groupChannel ? [groupChannel] : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = params.cfg as CoreConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matrixConfig = resolveMatrixAccountConfig({ cfg, accountId: params.accountId });
  return resolveMatrixRoomConfig({
    rooms: matrixConfig.groups ?? matrixConfig.rooms,
    roomId,
    aliases,
    name: groupChannel || undefined,
  }).config;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveMatrixGroupRequireMention(params: ChannelGroupContext): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved = resolveMatrixRoomConfigForGroup(params);
  if (resolved) {
    if (resolved.autoReply === true) {
      return false;
    }
    if (resolved.autoReply === false) {
      return true;
    }
    if (typeof resolved.requireMention === "boolean") {
      return resolved.requireMention;
    }
  }
  return true;
}

export function resolveMatrixGroupToolPolicy(
  params: ChannelGroupContext,
): GroupToolPolicyConfig | undefined {
  const resolved = resolveMatrixRoomConfigForGroup(params);
  return resolved?.tools;
}
