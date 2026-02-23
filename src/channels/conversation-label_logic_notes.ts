/*
 * AUTO ANNOTATION
 * File: src/channels/conversation-label.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MsgContext } from "../auto-reply/templating.js";
import { normalizeChatType } from "./chat-type.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function extractConversationId(from?: string): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = from?.trim();
  if (!trimmed) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parts = trimmed.split(":").filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : trimmed;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function shouldAppendId(id: string): boolean {
  if (/^[0-9]+$/.test(id)) {
    return true;
  }
  if (id.includes("@g.us")) {
    return true;
  }
  return false;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveConversationLabel(ctx: MsgContext): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const explicit = ctx.ConversationLabel?.trim();
  if (explicit) {
    return explicit;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const threadLabel = ctx.ThreadLabel?.trim();
  if (threadLabel) {
    return threadLabel;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chatType = normalizeChatType(ctx.ChatType);
  if (chatType === "direct") {
    return ctx.SenderName?.trim() || ctx.From?.trim() || undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base =
    ctx.GroupChannel?.trim() ||
    ctx.GroupSubject?.trim() ||
    ctx.GroupSpace?.trim() ||
    ctx.From?.trim() ||
    "";
  if (!base) {
    return undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const id = extractConversationId(ctx.From);
  if (!id) {
    return base;
  }
  if (!shouldAppendId(id)) {
    return base;
  }
  if (base === id) {
    return base;
  }
  if (base.includes(id)) {
    return base;
  }
  if (base.toLowerCase().includes(" id:")) {
    return base;
  }
  if (base.startsWith("#") || base.startsWith("@")) {
    return base;
  }
  return `${base} id:${id}`;
}
