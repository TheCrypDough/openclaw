/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/inbound-dedupe.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { logVerbose, shouldLogVerbose } from "../../globals.js";
import { createDedupeCache, type DedupeCache } from "../../infra/dedupe.js";
import type { MsgContext } from "../templating.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_INBOUND_DEDUPE_TTL_MS = 20 * 60_000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_INBOUND_DEDUPE_MAX = 5000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const inboundDedupeCache = createDedupeCache({
  ttlMs: DEFAULT_INBOUND_DEDUPE_TTL_MS,
  maxSize: DEFAULT_INBOUND_DEDUPE_MAX,
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const normalizeProvider = (value?: string | null) => value?.trim().toLowerCase() || "";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const resolveInboundPeerId = (ctx: MsgContext) =>
  ctx.OriginatingTo ?? ctx.To ?? ctx.From ?? ctx.SessionKey;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildInboundDedupeKey(ctx: MsgContext): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const provider = normalizeProvider(ctx.OriginatingChannel ?? ctx.Provider ?? ctx.Surface);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const messageId = ctx.MessageSid?.trim();
  if (!provider || !messageId) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const peerId = resolveInboundPeerId(ctx);
  if (!peerId) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sessionKey = ctx.SessionKey?.trim() ?? "";
  const accountId = ctx.AccountId?.trim() ?? "";
  const threadId =
    ctx.MessageThreadId !== undefined && ctx.MessageThreadId !== null
      ? String(ctx.MessageThreadId)
      : "";
  return [provider, accountId, sessionKey, peerId, threadId, messageId].filter(Boolean).join("|");
}

export function shouldSkipDuplicateInbound(
  ctx: MsgContext,
  opts?: { cache?: DedupeCache; now?: number },
): boolean {
  const key = buildInboundDedupeKey(ctx);
  if (!key) {
    return false;
  }
  const cache = opts?.cache ?? inboundDedupeCache;
  const skipped = cache.check(key, opts?.now);
  if (skipped && shouldLogVerbose()) {
    logVerbose(`inbound dedupe: skipped ${key}`);
  }
  return skipped;
}

export function resetInboundDedupe(): void {
  inboundDedupeCache.clear();
}
