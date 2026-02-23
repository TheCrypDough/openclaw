/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply/session-snapshot.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { loadConfig } from "../../config/config.js";
import {
  evaluateSessionFreshness,
  loadSessionStore,
  resolveChannelResetConfig,
  resolveThreadFlag,
  resolveSessionResetPolicy,
  resolveSessionResetType,
  resolveSessionKey,
  resolveStorePath,
} from "../../config/sessions.js";
import { normalizeMainKey } from "../../routing/session-key.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getSessionSnapshot(
  cfg: ReturnType<typeof loadConfig>,
  from: string,
  _isHeartbeat = false,
  ctx?: {
    sessionKey?: string | null;
    isGroup?: boolean;
    messageThreadId?: string | number | null;
    threadLabel?: string | null;
    threadStarterBody?: string | null;
    parentSessionKey?: string | null;
  },
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sessionCfg = cfg.session;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const scope = sessionCfg?.scope ?? "per-sender";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key =
    ctx?.sessionKey?.trim() ??
    resolveSessionKey(
      scope,
      { From: from, To: "", Body: "" },
      normalizeMainKey(sessionCfg?.mainKey),
    );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const store = loadSessionStore(resolveStorePath(sessionCfg?.store));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entry = store[key];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isThread = resolveThreadFlag({
    sessionKey: key,
    messageThreadId: ctx?.messageThreadId ?? null,
    threadLabel: ctx?.threadLabel ?? null,
    threadStarterBody: ctx?.threadStarterBody ?? null,
    parentSessionKey: ctx?.parentSessionKey ?? null,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resetType = resolveSessionResetType({ sessionKey: key, isGroup: ctx?.isGroup, isThread });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelReset = resolveChannelResetConfig({
    sessionCfg,
    channel: entry?.lastChannel ?? entry?.channel,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resetPolicy = resolveSessionResetPolicy({
    sessionCfg,
    resetType,
    resetOverride: channelReset,
  });
  const now = Date.now();
  const freshness = entry
    ? evaluateSessionFreshness({ updatedAt: entry.updatedAt, now, policy: resetPolicy })
    : { fresh: false };
  return {
    key,
    entry,
    fresh: freshness.fresh,
    resetPolicy,
    resetType,
    dailyResetAt: freshness.dailyResetAt,
    idleExpiresAt: freshness.idleExpiresAt,
  };
}
