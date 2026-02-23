/*
 * AUTO ANNOTATION
 * File: src/telegram/draft-chunking.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveTextChunkLimit } from "../auto-reply/chunk.js";
import { getChannelDock } from "../channels/dock.js";
import type { OpenClawConfig } from "../config/config.js";
import { normalizeAccountId } from "../routing/session-key.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_TELEGRAM_DRAFT_STREAM_MIN = 200;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_TELEGRAM_DRAFT_STREAM_MAX = 800;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveTelegramDraftStreamingChunking(
  cfg: OpenClawConfig | undefined,
  accountId?: string | null,
): {
  minChars: number;
  maxChars: number;
  breakPreference: "paragraph" | "newline" | "sentence";
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providerChunkLimit = getChannelDock("telegram")?.outbound?.textChunkLimit;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const textLimit = resolveTextChunkLimit(cfg, "telegram", accountId, {
    fallbackLimit: providerChunkLimit,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedAccountId = normalizeAccountId(accountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const draftCfg =
    cfg?.channels?.telegram?.accounts?.[normalizedAccountId]?.draftChunk ??
    cfg?.channels?.telegram?.draftChunk;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxRequested = Math.max(
    1,
    Math.floor(draftCfg?.maxChars ?? DEFAULT_TELEGRAM_DRAFT_STREAM_MAX),
  );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxChars = Math.max(1, Math.min(maxRequested, textLimit));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const minRequested = Math.max(
    1,
    Math.floor(draftCfg?.minChars ?? DEFAULT_TELEGRAM_DRAFT_STREAM_MIN),
  );
  const minChars = Math.min(minRequested, maxChars);
  const breakPreference =
    draftCfg?.breakPreference === "newline" || draftCfg?.breakPreference === "sentence"
      ? draftCfg.breakPreference
      : "paragraph";
  return { minChars, maxChars, breakPreference };
}
