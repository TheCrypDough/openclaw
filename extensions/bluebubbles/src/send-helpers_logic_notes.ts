/*
 * AUTO ANNOTATION
 * File: extensions/bluebubbles/src/send-helpers.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeBlueBubblesHandle, parseBlueBubblesTarget } from "./targets.js";
import type { BlueBubblesSendTarget } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveBlueBubblesSendTarget(raw: string): BlueBubblesSendTarget {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = parseBlueBubblesTarget(raw);
  if (parsed.kind === "handle") {
    return {
      kind: "handle",
      address: normalizeBlueBubblesHandle(parsed.to),
      service: parsed.service,
    };
  }
  if (parsed.kind === "chat_id") {
    return { kind: "chat_id", chatId: parsed.chatId };
  }
  if (parsed.kind === "chat_guid") {
    return { kind: "chat_guid", chatGuid: parsed.chatGuid };
  }
  return { kind: "chat_identifier", chatIdentifier: parsed.chatIdentifier };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractBlueBubblesMessageId(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "unknown";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const record = payload as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const data =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const candidates = [
    record.messageId,
    record.messageGuid,
    record.message_guid,
    record.guid,
    record.id,
    data?.messageId,
    data?.messageGuid,
    data?.message_guid,
    data?.message_id,
    data?.guid,
    data?.id,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return String(candidate);
    }
  }
  return "unknown";
}
