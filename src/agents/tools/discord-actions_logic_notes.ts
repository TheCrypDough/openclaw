/*
 * AUTO ANNOTATION
 * File: src/agents/tools/discord-actions.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import type { OpenClawConfig } from "../../config/config.js";
import { createDiscordActionGate } from "../../discord/accounts.js";
import { readStringParam } from "./common.js";
import { handleDiscordGuildAction } from "./discord-actions-guild.js";
import { handleDiscordMessagingAction } from "./discord-actions-messaging.js";
import { handleDiscordModerationAction } from "./discord-actions-moderation.js";
import { handleDiscordPresenceAction } from "./discord-actions-presence.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const messagingActions = new Set([
  "react",
  "reactions",
  "sticker",
  "poll",
  "permissions",
  "fetchMessage",
  "readMessages",
  "sendMessage",
  "editMessage",
  "deleteMessage",
  "threadCreate",
  "threadList",
  "threadReply",
  "pinMessage",
  "unpinMessage",
  "listPins",
  "searchMessages",
]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const guildActions = new Set([
  "memberInfo",
  "roleInfo",
  "emojiList",
  "emojiUpload",
  "stickerUpload",
  "roleAdd",
  "roleRemove",
  "channelInfo",
  "channelList",
  "voiceStatus",
  "eventList",
  "eventCreate",
  "channelCreate",
  "channelEdit",
  "channelDelete",
  "channelMove",
  "categoryCreate",
  "categoryEdit",
  "categoryDelete",
  "channelPermissionSet",
  "channelPermissionRemove",
]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const moderationActions = new Set(["timeout", "kick", "ban"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const presenceActions = new Set(["setPresence"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function handleDiscordAction(
  params: Record<string, unknown>,
  cfg: OpenClawConfig,
): Promise<AgentToolResult<unknown>> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const action = readStringParam(params, "action", { required: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = readStringParam(params, "accountId");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isActionEnabled = createDiscordActionGate({ cfg, accountId });

  if (messagingActions.has(action)) {
    return await handleDiscordMessagingAction(action, params, isActionEnabled);
  }
  if (guildActions.has(action)) {
    return await handleDiscordGuildAction(action, params, isActionEnabled);
  }
  if (moderationActions.has(action)) {
    return await handleDiscordModerationAction(action, params, isActionEnabled);
  }
  if (presenceActions.has(action)) {
    return await handleDiscordPresenceAction(action, params, isActionEnabled);
  }
  throw new Error(`Unknown action: ${action}`);
}
