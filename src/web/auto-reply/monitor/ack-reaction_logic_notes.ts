/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply/monitor/ack-reaction.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { shouldAckReactionForWhatsApp } from "../../../channels/ack-reactions.js";
import type { loadConfig } from "../../../config/config.js";
import { logVerbose } from "../../../globals.js";
import { sendReactionWhatsApp } from "../../outbound.js";
import { formatError } from "../../session.js";
import type { WebInboundMsg } from "../types.js";
import { resolveGroupActivationFor } from "./group-activation.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function maybeSendAckReaction(params: {
  cfg: ReturnType<typeof loadConfig>;
  msg: WebInboundMsg;
  agentId: string;
  sessionKey: string;
  conversationId: string;
  verbose: boolean;
  accountId?: string;
  info: (obj: unknown, msg: string) => void;
  warn: (obj: unknown, msg: string) => void;
}) {
  if (!params.msg.id) {
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ackConfig = params.cfg.channels?.whatsapp?.ackReaction;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const emoji = (ackConfig?.emoji ?? "").trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const directEnabled = ackConfig?.direct ?? true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupMode = ackConfig?.group ?? "mentions";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const conversationIdForCheck = params.msg.conversationId ?? params.msg.from;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const activation =
    params.msg.chatType === "group"
      ? resolveGroupActivationFor({
          cfg: params.cfg,
          agentId: params.agentId,
          sessionKey: params.sessionKey,
          conversationId: conversationIdForCheck,
        })
      : null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const shouldSendReaction = () =>
    shouldAckReactionForWhatsApp({
      emoji,
      isDirect: params.msg.chatType === "direct",
      isGroup: params.msg.chatType === "group",
      directEnabled,
      groupMode,
      wasMentioned: params.msg.wasMentioned === true,
      groupActivated: activation === "always",
    });

  if (!shouldSendReaction()) {
    return;
  }

  params.info(
    { chatId: params.msg.chatId, messageId: params.msg.id, emoji },
    "sending ack reaction",
  );
  sendReactionWhatsApp(params.msg.chatId, params.msg.id, emoji, {
    verbose: params.verbose,
    fromMe: false,
    participant: params.msg.senderJid,
    accountId: params.accountId,
  }).catch((err) => {
    params.warn(
      {
        error: formatError(err),
        chatId: params.msg.chatId,
        messageId: params.msg.id,
      },
      "failed to send ack reaction",
    );
    logVerbose(`WhatsApp ack reaction failed for chat ${params.msg.chatId}: ${formatError(err)}`);
  });
}
