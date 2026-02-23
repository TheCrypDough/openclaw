/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/system-events.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { type Message, MessageType } from "@buape/carbon";
import { formatDiscordUserTag } from "./format.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDiscordSystemEvent(message: Message, location: string): string | null {
  switch (message.type) {
    case MessageType.ChannelPinnedMessage:
      return buildDiscordSystemEvent(message, location, "pinned a message");
    case MessageType.RecipientAdd:
      return buildDiscordSystemEvent(message, location, "added a recipient");
    case MessageType.RecipientRemove:
      return buildDiscordSystemEvent(message, location, "removed a recipient");
    case MessageType.UserJoin:
      return buildDiscordSystemEvent(message, location, "user joined");
    case MessageType.GuildBoost:
      return buildDiscordSystemEvent(message, location, "boosted the server");
    case MessageType.GuildBoostTier1:
      return buildDiscordSystemEvent(message, location, "boosted the server (Tier 1 reached)");
    case MessageType.GuildBoostTier2:
      return buildDiscordSystemEvent(message, location, "boosted the server (Tier 2 reached)");
    case MessageType.GuildBoostTier3:
      return buildDiscordSystemEvent(message, location, "boosted the server (Tier 3 reached)");
    case MessageType.ThreadCreated:
      return buildDiscordSystemEvent(message, location, "created a thread");
    case MessageType.AutoModerationAction:
      return buildDiscordSystemEvent(message, location, "auto moderation action");
    case MessageType.GuildIncidentAlertModeEnabled:
      return buildDiscordSystemEvent(message, location, "raid protection enabled");
    case MessageType.GuildIncidentAlertModeDisabled:
      return buildDiscordSystemEvent(message, location, "raid protection disabled");
    case MessageType.GuildIncidentReportRaid:
      return buildDiscordSystemEvent(message, location, "raid reported");
    case MessageType.GuildIncidentReportFalseAlarm:
      return buildDiscordSystemEvent(message, location, "raid report marked false alarm");
    case MessageType.StageStart:
      return buildDiscordSystemEvent(message, location, "stage started");
    case MessageType.StageEnd:
      return buildDiscordSystemEvent(message, location, "stage ended");
    case MessageType.StageSpeaker:
      return buildDiscordSystemEvent(message, location, "stage speaker updated");
    case MessageType.StageTopic:
      return buildDiscordSystemEvent(message, location, "stage topic updated");
    case MessageType.PollResult:
      return buildDiscordSystemEvent(message, location, "poll results posted");
    case MessageType.PurchaseNotification:
      return buildDiscordSystemEvent(message, location, "purchase notification");
    default:
      return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function buildDiscordSystemEvent(message: Message, location: string, action: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const authorLabel = message.author ? formatDiscordUserTag(message.author) : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actor = authorLabel ? `${authorLabel} ` : "";
  return `Discord system: ${actor}${action} in ${location}`;
}
