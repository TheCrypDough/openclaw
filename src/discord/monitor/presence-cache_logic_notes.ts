/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/presence-cache.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { GatewayPresenceUpdate } from "discord-api-types/v10";

/**
 * In-memory cache of Discord user presence data.
 * Populated by PRESENCE_UPDATE gateway events when the GuildPresences intent is enabled.
 * Per-account maps are capped to prevent unbounded growth (#4948).
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAX_PRESENCE_PER_ACCOUNT = 5000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const presenceCache = new Map<string, Map<string, GatewayPresenceUpdate>>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAccountKey(accountId?: string): string {
  return accountId ?? "default";
}

/** Update cached presence for a user. */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setPresence(
  accountId: string | undefined,
  userId: string,
  data: GatewayPresenceUpdate,
): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountKey = resolveAccountKey(accountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let accountCache = presenceCache.get(accountKey);
  if (!accountCache) {
    accountCache = new Map();
    presenceCache.set(accountKey, accountCache);
  }
  accountCache.set(userId, data);
  // Evict oldest entries if cache exceeds limit
  if (accountCache.size > MAX_PRESENCE_PER_ACCOUNT) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const oldest = accountCache.keys().next().value;
    if (oldest !== undefined) {
      accountCache.delete(oldest);
    }
  }
}

/** Get cached presence for a user. Returns undefined if not cached. */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getPresence(
  accountId: string | undefined,
  userId: string,
): GatewayPresenceUpdate | undefined {
  return presenceCache.get(resolveAccountKey(accountId))?.get(userId);
}

/** Clear cached presence data. */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function clearPresences(accountId?: string): void {
  if (accountId) {
    presenceCache.delete(resolveAccountKey(accountId));
    return;
  }
  presenceCache.clear();
}

/** Get the number of cached presence entries. */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function presenceCacheSize(): number {
  let total = 0;
  for (const accountCache of presenceCache.values()) {
    total += accountCache.size;
  }
  return total;
}
