/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/message-handler.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Client } from "@buape/carbon";
import { hasControlCommand } from "../../auto-reply/command-detection.js";
import {
  createInboundDebouncer,
  resolveInboundDebounceMs,
} from "../../auto-reply/inbound-debounce.js";
import { danger } from "../../globals.js";
import type { DiscordMessageEvent, DiscordMessageHandler } from "./listeners.js";
import { preflightDiscordMessage } from "./message-handler.preflight.js";
import type { DiscordMessagePreflightParams } from "./message-handler.preflight.types.js";
import { processDiscordMessage } from "./message-handler.process.js";
import {
  hasDiscordMessageStickers,
  resolveDiscordMessageChannelId,
  resolveDiscordMessageText,
} from "./message-utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DiscordMessageHandlerParams = Omit<
  DiscordMessagePreflightParams,
  "ackReactionScope" | "groupPolicy" | "data" | "client"
>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createDiscordMessageHandler(
  params: DiscordMessageHandlerParams,
): DiscordMessageHandler {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupPolicy = params.discordConfig?.groupPolicy ?? "open";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ackReactionScope = params.cfg.messages?.ackReactionScope ?? "group-mentions";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const debounceMs = resolveInboundDebounceMs({ cfg: params.cfg, channel: "discord" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const debouncer = createInboundDebouncer<{ data: DiscordMessageEvent; client: Client }>({
    debounceMs,
    buildKey: (entry) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const message = entry.data.message;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const authorId = entry.data.author?.id;
      if (!message || !authorId) {
        return null;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const channelId = resolveDiscordMessageChannelId({
        message,
        eventChannelId: entry.data.channel_id,
      });
      if (!channelId) {
        return null;
      }
      return `discord:${params.accountId}:${channelId}:${authorId}`;
    },
    shouldDebounce: (entry) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const message = entry.data.message;
      if (!message) {
        return false;
      }
      if (message.attachments && message.attachments.length > 0) {
        return false;
      }
      if (hasDiscordMessageStickers(message)) {
        return false;
      }
      const baseText = resolveDiscordMessageText(message, { includeForwarded: false });
      if (!baseText.trim()) {
        return false;
      }
      return !hasControlCommand(baseText, params.cfg);
    },
    onFlush: async (entries) => {
      const last = entries.at(-1);
      if (!last) {
        return;
      }
      if (entries.length === 1) {
        const ctx = await preflightDiscordMessage({
          ...params,
          ackReactionScope,
          groupPolicy,
          data: last.data,
          client: last.client,
        });
        if (!ctx) {
          return;
        }
        await processDiscordMessage(ctx);
        return;
      }
      const combinedBaseText = entries
        .map((entry) => resolveDiscordMessageText(entry.data.message, { includeForwarded: false }))
        .filter(Boolean)
        .join("\n");
      const syntheticMessage = {
        ...last.data.message,
        content: combinedBaseText,
        attachments: [],
        message_snapshots: (last.data.message as { message_snapshots?: unknown }).message_snapshots,
        messageSnapshots: (last.data.message as { messageSnapshots?: unknown }).messageSnapshots,
        rawData: {
          ...(last.data.message as { rawData?: Record<string, unknown> }).rawData,
        },
      };
      const syntheticData: DiscordMessageEvent = {
        ...last.data,
        message: syntheticMessage,
      };
      const ctx = await preflightDiscordMessage({
        ...params,
        ackReactionScope,
        groupPolicy,
        data: syntheticData,
        client: last.client,
      });
      if (!ctx) {
        return;
      }
      if (entries.length > 1) {
        const ids = entries.map((entry) => entry.data.message?.id).filter(Boolean) as string[];
        if (ids.length > 0) {
          const ctxBatch = ctx as typeof ctx & {
            MessageSids?: string[];
            MessageSidFirst?: string;
            MessageSidLast?: string;
          };
          ctxBatch.MessageSids = ids;
          ctxBatch.MessageSidFirst = ids[0];
          ctxBatch.MessageSidLast = ids[ids.length - 1];
        }
      }
      await processDiscordMessage(ctx);
    },
    onError: (err) => {
      params.runtime.error?.(danger(`discord debounce flush failed: ${String(err)}`));
    },
  });

  return async (data, client) => {
    try {
      await debouncer.enqueue({ data, client });
    } catch (err) {
      params.runtime.error?.(danger(`handler failed: ${String(err)}`));
    }
  };
}
