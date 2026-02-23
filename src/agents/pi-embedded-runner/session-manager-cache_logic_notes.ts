/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner/session-manager-cache.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Buffer } from "node:buffer";
import fs from "node:fs/promises";
import { isCacheEnabled, resolveCacheTtlMs } from "../../config/cache-utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SessionManagerCacheEntry = {
  sessionFile: string;
  loadedAt: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SESSION_MANAGER_CACHE = new Map<string, SessionManagerCacheEntry>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_SESSION_MANAGER_TTL_MS = 45_000; // 45 seconds

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function getSessionManagerTtl(): number {
  return resolveCacheTtlMs({
    envValue: process.env.OPENCLAW_SESSION_MANAGER_CACHE_TTL_MS,
    defaultTtlMs: DEFAULT_SESSION_MANAGER_TTL_MS,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isSessionManagerCacheEnabled(): boolean {
  return isCacheEnabled(getSessionManagerTtl());
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function trackSessionManagerAccess(sessionFile: string): void {
  if (!isSessionManagerCacheEnabled()) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = Date.now();
  SESSION_MANAGER_CACHE.set(sessionFile, {
    sessionFile,
    loadedAt: now,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isSessionManagerCached(sessionFile: string): boolean {
  if (!isSessionManagerCacheEnabled()) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entry = SESSION_MANAGER_CACHE.get(sessionFile);
  if (!entry) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = Date.now();
  const ttl = getSessionManagerTtl();
  return now - entry.loadedAt <= ttl;
}

export async function prewarmSessionFile(sessionFile: string): Promise<void> {
  if (!isSessionManagerCacheEnabled()) {
    return;
  }
  if (isSessionManagerCached(sessionFile)) {
    return;
  }

  try {
    // Read a small chunk to encourage OS page cache warmup.
    const handle = await fs.open(sessionFile, "r");
    try {
      const buffer = Buffer.alloc(4096);
      await handle.read(buffer, 0, buffer.length, 0);
    } finally {
      await handle.close();
    }
    trackSessionManagerAccess(sessionFile);
  } catch {
    // File doesn't exist yet, SessionManager will create it
  }
}
