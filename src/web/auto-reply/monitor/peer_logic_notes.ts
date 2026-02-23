/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply/monitor/peer.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { jidToE164, normalizeE164 } from "../../../utils.js";
import type { WebInboundMsg } from "../types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolvePeerId(msg: WebInboundMsg) {
  if (msg.chatType === "group") {
    return msg.conversationId ?? msg.from;
  }
  if (msg.senderE164) {
    return normalizeE164(msg.senderE164) ?? msg.senderE164;
  }
  if (msg.from.includes("@")) {
    return jidToE164(msg.from) ?? msg.from;
  }
  return normalizeE164(msg.from) ?? msg.from;
}
