/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply/monitor/message-line.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveMessagePrefix } from "../../../agents/identity.js";
import { formatInboundEnvelope, type EnvelopeFormatOptions } from "../../../auto-reply/envelope.js";
import type { loadConfig } from "../../../config/config.js";
import type { WebInboundMsg } from "../types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatReplyContext(msg: WebInboundMsg) {
  if (!msg.replyToBody) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sender = msg.replyToSender ?? "unknown sender";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const idPart = msg.replyToId ? ` id:${msg.replyToId}` : "";
  return `[Replying to ${sender}${idPart}]\n${msg.replyToBody}\n[/Replying]`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildInboundLine(params: {
  cfg: ReturnType<typeof loadConfig>;
  msg: WebInboundMsg;
  agentId: string;
  previousTimestamp?: number;
  envelope?: EnvelopeFormatOptions;
}) {
  const { cfg, msg, agentId, previousTimestamp, envelope } = params;
  // WhatsApp inbound prefix: channels.whatsapp.messagePrefix > legacy messages.messagePrefix > identity/defaults
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const messagePrefix = resolveMessagePrefix(cfg, agentId, {
    configured: cfg.channels?.whatsapp?.messagePrefix,
    hasAllowFrom: (cfg.channels?.whatsapp?.allowFrom?.length ?? 0) > 0,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prefixStr = messagePrefix ? `${messagePrefix} ` : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const replyContext = formatReplyContext(msg);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseLine = `${prefixStr}${msg.body}${replyContext ? `\n\n${replyContext}` : ""}`;

  // Wrap with standardized envelope for the agent.
  return formatInboundEnvelope({
    channel: "WhatsApp",
    from: msg.chatType === "group" ? msg.from : msg.from?.replace(/^whatsapp:/, ""),
    timestamp: msg.timestamp,
    body: baseLine,
    chatType: msg.chatType,
    sender: {
      name: msg.senderName,
      e164: msg.senderE164,
      id: msg.senderJid,
    },
    previousTimestamp,
    envelope,
  });
}
