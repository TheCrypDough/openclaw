/*
 * AUTO ANNOTATION
 * File: src/config/sessions/delivery-info.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { loadConfig } from "../io.js";
import { resolveStorePath } from "./paths.js";
import { loadSessionStore } from "./store.js";

/**
 * Extract deliveryContext and threadId from a sessionKey.
 * Supports both :thread: (most channels) and :topic: (Telegram).
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseSessionThreadInfo(sessionKey: string | undefined): {
  baseSessionKey: string | undefined;
  threadId: string | undefined;
} {
  if (!sessionKey) {
    return { baseSessionKey: undefined, threadId: undefined };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const topicIndex = sessionKey.lastIndexOf(":topic:");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const threadIndex = sessionKey.lastIndexOf(":thread:");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const markerIndex = Math.max(topicIndex, threadIndex);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const marker = topicIndex > threadIndex ? ":topic:" : ":thread:";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseSessionKey = markerIndex === -1 ? sessionKey : sessionKey.slice(0, markerIndex);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const threadIdRaw =
    markerIndex === -1 ? undefined : sessionKey.slice(markerIndex + marker.length);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const threadId = threadIdRaw?.trim() || undefined;
  return { baseSessionKey, threadId };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractDeliveryInfo(sessionKey: string | undefined): {
  deliveryContext: { channel?: string; to?: string; accountId?: string } | undefined;
  threadId: string | undefined;
} {
  const { baseSessionKey, threadId } = parseSessionThreadInfo(sessionKey);
  if (!sessionKey || !baseSessionKey) {
    return { deliveryContext: undefined, threadId };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let deliveryContext: { channel?: string; to?: string; accountId?: string } | undefined;
  try {
    const cfg = loadConfig();
    const storePath = resolveStorePath(cfg.session?.store);
    const store = loadSessionStore(storePath);
    let entry = store[sessionKey];
    if (!entry?.deliveryContext && baseSessionKey !== sessionKey) {
      entry = store[baseSessionKey];
    }
    if (entry?.deliveryContext) {
      deliveryContext = {
        channel: entry.deliveryContext.channel,
        to: entry.deliveryContext.to,
        accountId: entry.deliveryContext.accountId,
      };
    }
  } catch {
    // ignore: best-effort
  }
  return { deliveryContext, threadId };
}
