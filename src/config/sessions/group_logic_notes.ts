/*
 * AUTO ANNOTATION
 * File: src/config/sessions/group.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MsgContext } from "../../auto-reply/templating.js";
import { normalizeHyphenSlug } from "../../shared/string-normalization.js";
import { listDeliverableMessageChannels } from "../../utils/message-channel.js";
import type { GroupKeyResolution } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const getGroupSurfaces = () => new Set<string>([...listDeliverableMessageChannels(), "webchat"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeGroupLabel(raw?: string) {
  return normalizeHyphenSlug(raw);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function shortenGroupId(value?: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return "";
  }
  if (trimmed.length <= 14) {
    return trimmed;
  }
  return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildGroupDisplayName(params: {
  provider?: string;
  subject?: string;
  groupChannel?: string;
  space?: string;
  id?: string;
  key: string;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providerKey = (params.provider?.trim().toLowerCase() || "group").trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupChannel = params.groupChannel?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const space = params.space?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const subject = params.subject?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const detail =
    (groupChannel && space
      ? `${space}${groupChannel.startsWith("#") ? "" : "#"}${groupChannel}`
      : groupChannel || subject || space || "") || "";
  const fallbackId = params.id?.trim() || params.key;
  const rawLabel = detail || fallbackId;
  let token = normalizeGroupLabel(rawLabel);
  if (!token) {
    token = normalizeGroupLabel(shortenGroupId(rawLabel));
  }
  if (!params.groupChannel && token.startsWith("#")) {
    token = token.replace(/^#+/, "");
  }
  if (token && !/^[@#]/.test(token) && !token.startsWith("g-") && !token.includes("#")) {
    token = `g-${token}`;
  }
  return token ? `${providerKey}:${token}` : providerKey;
}

export function resolveGroupSessionKey(ctx: MsgContext): GroupKeyResolution | null {
  const from = typeof ctx.From === "string" ? ctx.From.trim() : "";
  const chatType = ctx.ChatType?.trim().toLowerCase();
  const normalizedChatType =
    chatType === "channel" ? "channel" : chatType === "group" ? "group" : undefined;

  const isWhatsAppGroupId = from.toLowerCase().endsWith("@g.us");
  const looksLikeGroup =
    normalizedChatType === "group" ||
    normalizedChatType === "channel" ||
    from.includes(":group:") ||
    from.includes(":channel:") ||
    isWhatsAppGroupId;
  if (!looksLikeGroup) {
    return null;
  }

  const providerHint = ctx.Provider?.trim().toLowerCase();

  const parts = from.split(":").filter(Boolean);
  const head = parts[0]?.trim().toLowerCase() ?? "";
  const headIsSurface = head ? getGroupSurfaces().has(head) : false;

  const provider = headIsSurface
    ? head
    : (providerHint ?? (isWhatsAppGroupId ? "whatsapp" : undefined));
  if (!provider) {
    return null;
  }

  const second = parts[1]?.trim().toLowerCase();
  const secondIsKind = second === "group" || second === "channel";
  const kind = secondIsKind
    ? second
    : from.includes(":channel:") || normalizedChatType === "channel"
      ? "channel"
      : "group";
  const id = headIsSurface
    ? secondIsKind
      ? parts.slice(2).join(":")
      : parts.slice(1).join(":")
    : from;
  const finalId = id.trim().toLowerCase();
  if (!finalId) {
    return null;
  }

  return {
    key: `${provider}:${kind}:${finalId}`,
    channel: provider,
    id: finalId,
    chatType: kind === "channel" ? "channel" : "group",
  };
}
