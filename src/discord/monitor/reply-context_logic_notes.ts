/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/reply-context.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Guild, Message, User } from "@buape/carbon";
import { resolveTimestampMs } from "./format.js";
import { resolveDiscordSenderIdentity } from "./sender-identity.js";

export type DiscordReplyContext = {
  id: string;
  channelId: string;
  sender: string;
  body: string;
  timestamp?: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveReplyContext(
  message: Message,
  resolveDiscordMessageText: (message: Message, options?: { includeForwarded?: boolean }) => string,
): DiscordReplyContext | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const referenced = message.referencedMessage;
  if (!referenced?.author) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const referencedText = resolveDiscordMessageText(referenced, {
    includeForwarded: true,
  });
  if (!referencedText) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sender = resolveDiscordSenderIdentity({
    author: referenced.author,
    pluralkitInfo: null,
  });
  return {
    id: referenced.id,
    channelId: referenced.channelId,
    sender: sender.tag ?? sender.label ?? "unknown",
    body: referencedText,
    timestamp: resolveTimestampMs(referenced.timestamp),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildDirectLabel(author: User, tagOverride?: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const username =
    tagOverride?.trim() || resolveDiscordSenderIdentity({ author, pluralkitInfo: null }).tag;
  return `${username ?? "unknown"} user id:${author.id}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildGuildLabel(params: {
  guild?: Guild<true> | Guild;
  channelName: string;
  channelId: string;
}) {
  const { guild, channelName, channelId } = params;
  return `${guild?.name ?? "Guild"} #${channelName} channel id:${channelId}`;
}
