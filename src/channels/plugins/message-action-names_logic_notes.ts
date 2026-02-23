/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/message-action-names.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CHANNEL_MESSAGE_ACTION_NAMES = [
  "send",
  "broadcast",
  "poll",
  "react",
  "reactions",
  "read",
  "edit",
  "unsend",
  "reply",
  "sendWithEffect",
  "renameGroup",
  "setGroupIcon",
  "addParticipant",
  "removeParticipant",
  "leaveGroup",
  "sendAttachment",
  "delete",
  "pin",
  "unpin",
  "list-pins",
  "permissions",
  "thread-create",
  "thread-list",
  "thread-reply",
  "search",
  "sticker",
  "sticker-search",
  "member-info",
  "role-info",
  "emoji-list",
  "emoji-upload",
  "sticker-upload",
  "role-add",
  "role-remove",
  "channel-info",
  "channel-list",
  "channel-create",
  "channel-edit",
  "channel-delete",
  "channel-move",
  "category-create",
  "category-edit",
  "category-delete",
  "topic-create",
  "voice-status",
  "event-list",
  "event-create",
  "timeout",
  "kick",
  "ban",
  "set-presence",
] as const;

export type ChannelMessageActionName = (typeof CHANNEL_MESSAGE_ACTION_NAMES)[number];
