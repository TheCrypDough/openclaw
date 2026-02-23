/*
 * AUTO ANNOTATION
 * File: src/infra/outbound/message-action-spec.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChannelMessageActionName } from "../../channels/plugins/types.js";

export type MessageActionTargetMode = "to" | "channelId" | "none";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const MESSAGE_ACTION_TARGET_MODE: Record<ChannelMessageActionName, MessageActionTargetMode> =
  {
    send: "to",
    broadcast: "none",
    poll: "to",
    react: "to",
    reactions: "to",
    read: "to",
    edit: "to",
    unsend: "to",
    reply: "to",
    sendWithEffect: "to",
    renameGroup: "to",
    setGroupIcon: "to",
    addParticipant: "to",
    removeParticipant: "to",
    leaveGroup: "to",
    sendAttachment: "to",
    delete: "to",
    pin: "to",
    unpin: "to",
    "list-pins": "to",
    permissions: "to",
    "thread-create": "to",
    "thread-list": "none",
    "thread-reply": "to",
    search: "none",
    sticker: "to",
    "sticker-search": "none",
    "member-info": "none",
    "role-info": "none",
    "emoji-list": "none",
    "emoji-upload": "none",
    "sticker-upload": "none",
    "role-add": "none",
    "role-remove": "none",
    "channel-info": "channelId",
    "channel-list": "none",
    "channel-create": "none",
    "channel-edit": "channelId",
    "channel-delete": "channelId",
    "channel-move": "channelId",
    "category-create": "none",
    "category-edit": "none",
    "category-delete": "none",
    "topic-create": "to",
    "voice-status": "none",
    "event-list": "none",
    "event-create": "none",
    timeout: "none",
    kick: "none",
    ban: "none",
    "set-presence": "none",
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ACTION_TARGET_ALIASES: Partial<Record<ChannelMessageActionName, string[]>> = {
  unsend: ["messageId"],
  edit: ["messageId"],
  react: ["chatGuid", "chatIdentifier", "chatId"],
  renameGroup: ["chatGuid", "chatIdentifier", "chatId"],
  setGroupIcon: ["chatGuid", "chatIdentifier", "chatId"],
  addParticipant: ["chatGuid", "chatIdentifier", "chatId"],
  removeParticipant: ["chatGuid", "chatIdentifier", "chatId"],
  leaveGroup: ["chatGuid", "chatIdentifier", "chatId"],
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function actionRequiresTarget(action: ChannelMessageActionName): boolean {
  return MESSAGE_ACTION_TARGET_MODE[action] !== "none";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function actionHasTarget(
  action: ChannelMessageActionName,
  params: Record<string, unknown>,
): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const to = typeof params.to === "string" ? params.to.trim() : "";
  if (to) {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelId = typeof params.channelId === "string" ? params.channelId.trim() : "";
  if (channelId) {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const aliases = ACTION_TARGET_ALIASES[action];
  if (!aliases) {
    return false;
  }
  return aliases.some((alias) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = params[alias];
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    if (typeof value === "number") {
      return Number.isFinite(value);
    }
    return false;
  });
}
