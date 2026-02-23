/*
 * AUTO ANNOTATION
 * File: src/telegram/allowed-updates.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { API_CONSTANTS } from "grammy";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type TelegramUpdateType = (typeof API_CONSTANTS.ALL_UPDATE_TYPES)[number];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveTelegramAllowedUpdates(): ReadonlyArray<TelegramUpdateType> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const updates = [...API_CONSTANTS.DEFAULT_UPDATE_TYPES] as TelegramUpdateType[];
  if (!updates.includes("message_reaction")) {
    updates.push("message_reaction");
  }
  if (!updates.includes("channel_post")) {
    updates.push("channel_post");
  }
  return updates;
}
