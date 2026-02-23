/*
 * AUTO ANNOTATION
 * File: src/web/inbound/dedupe.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createDedupeCache } from "../../infra/dedupe.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RECENT_WEB_MESSAGE_TTL_MS = 20 * 60_000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RECENT_WEB_MESSAGE_MAX = 5000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const recentInboundMessages = createDedupeCache({
  ttlMs: RECENT_WEB_MESSAGE_TTL_MS,
  maxSize: RECENT_WEB_MESSAGE_MAX,
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resetWebInboundDedupe(): void {
  recentInboundMessages.clear();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isRecentInboundMessage(key: string): boolean {
  return recentInboundMessages.check(key);
}
