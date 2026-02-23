/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/format.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Guild, User } from "@buape/carbon";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDiscordSystemLocation(params: {
  isDirectMessage: boolean;
  isGroupDm: boolean;
  guild?: Guild;
  channelName: string;
}) {
  const { isDirectMessage, isGroupDm, guild, channelName } = params;
  if (isDirectMessage) {
    return "DM";
  }
  if (isGroupDm) {
    return `Group DM #${channelName}`;
  }
  return guild?.name ? `${guild.name} #${channelName}` : `#${channelName}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatDiscordReactionEmoji(emoji: { id?: string | null; name?: string | null }) {
  if (emoji.id && emoji.name) {
    // Custom guild emoji in Discord-renderable form.
    return `<:${emoji.name}:${emoji.id}>`;
  }
  if (emoji.id) {
    // Keep id visible even when name is missing (instead of opaque "emoji").
    return `emoji:${emoji.id}`;
  }
  return emoji.name ?? "emoji";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatDiscordUserTag(user: User) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const discriminator = (user.discriminator ?? "").trim();
  if (discriminator && discriminator !== "0") {
    return `${user.username}#${discriminator}`;
  }
  return user.username ?? user.id;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveTimestampMs(timestamp?: string | null) {
  if (!timestamp) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = Date.parse(timestamp);
  return Number.isNaN(parsed) ? undefined : parsed;
}
