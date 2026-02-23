/*
 * AUTO ANNOTATION
 * File: src/infra/outbound/format.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getChannelPlugin } from "../../channels/plugins/index.js";
import type { ChannelId } from "../../channels/plugins/types.js";
import { getChatChannelMeta, normalizeChatChannelId } from "../../channels/registry.js";
import type { OutboundDeliveryResult } from "./deliver.js";

export type OutboundDeliveryJson = {
  channel: string;
  via: "direct" | "gateway";
  to: string;
  messageId: string;
  mediaUrl: string | null;
  chatId?: string;
  channelId?: string;
  roomId?: string;
  conversationId?: string;
  timestamp?: number;
  toJid?: string;
  meta?: Record<string, unknown>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type OutboundDeliveryMeta = {
  messageId?: string;
  chatId?: string;
  channelId?: string;
  roomId?: string;
  conversationId?: string;
  timestamp?: number;
  toJid?: string;
  meta?: Record<string, unknown>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const resolveChannelLabel = (channel: string) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pluginLabel = getChannelPlugin(channel as ChannelId)?.meta.label;
  if (pluginLabel) {
    return pluginLabel;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeChatChannelId(channel);
  if (normalized) {
    return getChatChannelMeta(normalized).label;
  }
  return channel;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatOutboundDeliverySummary(
  channel: string,
  result?: OutboundDeliveryResult,
): string {
  if (!result) {
    return `✅ Sent via ${resolveChannelLabel(channel)}. Message ID: unknown`;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const label = resolveChannelLabel(result.channel);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = `✅ Sent via ${label}. Message ID: ${result.messageId}`;

  if ("chatId" in result) {
    return `${base} (chat ${result.chatId})`;
  }
  if ("channelId" in result) {
    return `${base} (channel ${result.channelId})`;
  }
  if ("roomId" in result) {
    return `${base} (room ${result.roomId})`;
  }
  if ("conversationId" in result) {
    return `${base} (conversation ${result.conversationId})`;
  }
  return base;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildOutboundDeliveryJson(params: {
  channel: string;
  to: string;
  result?: OutboundDeliveryMeta | OutboundDeliveryResult;
  via?: "direct" | "gateway";
  mediaUrl?: string | null;
}): OutboundDeliveryJson {
  const { channel, to, result } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const messageId = result?.messageId ?? "unknown";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payload: OutboundDeliveryJson = {
    channel,
    via: params.via ?? "direct",
    to,
    messageId,
    mediaUrl: params.mediaUrl ?? null,
  };

  if (result && "chatId" in result && result.chatId !== undefined) {
    payload.chatId = result.chatId;
  }
  if (result && "channelId" in result && result.channelId !== undefined) {
    payload.channelId = result.channelId;
  }
  if (result && "roomId" in result && result.roomId !== undefined) {
    payload.roomId = result.roomId;
  }
  if (result && "conversationId" in result && result.conversationId !== undefined) {
    payload.conversationId = result.conversationId;
  }
  if (result && "timestamp" in result && result.timestamp !== undefined) {
    payload.timestamp = result.timestamp;
  }
  if (result && "toJid" in result && result.toJid !== undefined) {
    payload.toJid = result.toJid;
  }
  if (result && "meta" in result && result.meta !== undefined) {
    payload.meta = result.meta;
  }

  return payload;
}

export function formatGatewaySummary(params: {
  action?: string;
  channel?: string;
  messageId?: string | null;
}): string {
  const action = params.action ?? "Sent";
  const channelSuffix = params.channel ? ` (${params.channel})` : "";
  const messageId = params.messageId ?? "unknown";
  return `✅ ${action} via gateway${channelSuffix}. Message ID: ${messageId}`;
}
