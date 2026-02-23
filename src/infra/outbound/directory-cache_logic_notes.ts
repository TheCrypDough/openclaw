/*
 * AUTO ANNOTATION
 * File: src/infra/outbound/directory-cache.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChannelDirectoryEntryKind, ChannelId } from "../../channels/plugins/types.js";
import type { OpenClawConfig } from "../../config/config.js";

type CacheEntry<T> = {
  value: T;
  fetchedAt: number;
};

export type DirectoryCacheKey = {
  channel: ChannelId;
  accountId?: string | null;
  kind: ChannelDirectoryEntryKind;
  source: "cache" | "live";
  signature?: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildDirectoryCacheKey(key: DirectoryCacheKey): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const signature = key.signature ?? "default";
  return `${key.channel}:${key.accountId ?? "default"}:${key.kind}:${key.source}:${signature}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class DirectoryCache<T> {
  private readonly cache = new Map<string, CacheEntry<T>>();
  private lastConfigRef: OpenClawConfig | null = null;
  private readonly maxSize: number;

  constructor(
    private readonly ttlMs: number,
    maxSize = 2000,
  ) {
    this.maxSize = Math.max(1, Math.floor(maxSize));
  }

  get(key: string, cfg: OpenClawConfig): T | undefined {
    this.resetIfConfigChanged(cfg);
    this.pruneExpired(Date.now());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T, cfg: OpenClawConfig): void {
    this.resetIfConfigChanged(cfg);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const now = Date.now();
    this.pruneExpired(now);
    // Refresh insertion order so active keys are less likely to be evicted.
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, { value, fetchedAt: now });
    this.evictToMaxSize();
  }

  clearMatching(match: (key: string) => boolean): void {
    for (const key of this.cache.keys()) {
      if (match(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(cfg?: OpenClawConfig): void {
    this.cache.clear();
    if (cfg) {
      this.lastConfigRef = cfg;
    }
  }

  private resetIfConfigChanged(cfg: OpenClawConfig): void {
    if (this.lastConfigRef && this.lastConfigRef !== cfg) {
      this.cache.clear();
    }
    this.lastConfigRef = cfg;
  }

  private pruneExpired(now: number): void {
    if (this.ttlMs <= 0) {
      return;
    }
    for (const [cacheKey, entry] of this.cache.entries()) {
      if (now - entry.fetchedAt > this.ttlMs) {
        this.cache.delete(cacheKey);
      }
    }
  }

  private evictToMaxSize(): void {
    while (this.cache.size > this.maxSize) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const oldestKey = this.cache.keys().next().value;
      if (typeof oldestKey !== "string") {
        break;
      }
      this.cache.delete(oldestKey);
    }
  }
}
