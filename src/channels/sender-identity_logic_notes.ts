/*
 * AUTO ANNOTATION
 * File: src/channels/sender-identity.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MsgContext } from "../auto-reply/templating.js";
import { normalizeChatType } from "./chat-type.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function validateSenderIdentity(ctx: MsgContext): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const issues: string[] = [];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chatType = normalizeChatType(ctx.ChatType);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isDirect = chatType === "direct";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const senderId = ctx.SenderId?.trim() || "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const senderName = ctx.SenderName?.trim() || "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const senderUsername = ctx.SenderUsername?.trim() || "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const senderE164 = ctx.SenderE164?.trim() || "";

  if (!isDirect) {
    if (!senderId && !senderName && !senderUsername && !senderE164) {
      issues.push("missing sender identity (SenderId/SenderName/SenderUsername/SenderE164)");
    }
  }

  if (senderE164) {
    if (!/^\+\d{3,}$/.test(senderE164)) {
      issues.push(`invalid SenderE164: ${senderE164}`);
    }
  }

  if (senderUsername) {
    if (senderUsername.includes("@")) {
      issues.push(`SenderUsername should not include "@": ${senderUsername}`);
    }
    if (/\s/.test(senderUsername)) {
      issues.push(`SenderUsername should not include whitespace: ${senderUsername}`);
    }
  }

  if (ctx.SenderId != null && !senderId) {
    issues.push("SenderId is set but empty");
  }

  return issues;
}
