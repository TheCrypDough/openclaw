/*
 * AUTO ANNOTATION
 * File: src/agents/tools/discord-actions-moderation-shared.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { PermissionFlagsBits } from "discord-api-types/v10";
import { readNumberParam, readStringParam } from "./common.js";

export type DiscordModerationAction = "timeout" | "kick" | "ban";

export type DiscordModerationCommand = {
  action: DiscordModerationAction;
  guildId: string;
  userId: string;
  durationMinutes?: number;
  until?: string;
  reason?: string;
  deleteMessageDays?: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const moderationPermissions: Record<DiscordModerationAction, bigint> = {
  timeout: PermissionFlagsBits.ModerateMembers,
  kick: PermissionFlagsBits.KickMembers,
  ban: PermissionFlagsBits.BanMembers,
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isDiscordModerationAction(action: string): action is DiscordModerationAction {
  return action === "timeout" || action === "kick" || action === "ban";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function requiredGuildPermissionForModerationAction(
  action: DiscordModerationAction,
): bigint {
  return moderationPermissions[action];
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function readDiscordModerationCommand(
  action: string,
  params: Record<string, unknown>,
): DiscordModerationCommand {
  if (!isDiscordModerationAction(action)) {
    throw new Error(`Unsupported Discord moderation action: ${action}`);
  }
  return {
    action,
    guildId: readStringParam(params, "guildId", { required: true }),
    userId: readStringParam(params, "userId", { required: true }),
    durationMinutes: readNumberParam(params, "durationMinutes", { integer: true }),
    until: readStringParam(params, "until"),
    reason: readStringParam(params, "reason"),
    deleteMessageDays: readNumberParam(params, "deleteMessageDays", { integer: true }),
  };
}
