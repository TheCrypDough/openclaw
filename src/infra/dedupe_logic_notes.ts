/*
 * AUTO ANNOTATION
 * File: src/infra/dedupe.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { pruneMapToMaxSize } from "./map-size.js";

export type DedupeCache = {
  check: (key: string | undefined | null, now?: number) => boolean;
  clear: () => void;
  size: () => number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DedupeCacheOptions = {
  ttlMs: number;
  maxSize: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createDedupeCache(options: DedupeCacheOptions): DedupeCache {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ttlMs = Math.max(0, options.ttlMs);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxSize = Math.max(0, Math.floor(options.maxSize));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cache = new Map<string, number>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const touch = (key: string, now: number) => {
    cache.delete(key);
    cache.set(key, now);
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prune = (now: number) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cutoff = ttlMs > 0 ? now - ttlMs : undefined;
    if (cutoff !== undefined) {
      for (const [entryKey, entryTs] of cache) {
        if (entryTs < cutoff) {
          cache.delete(entryKey);
        }
      }
    }
    if (maxSize <= 0) {
      cache.clear();
      return;
    }
    pruneMapToMaxSize(cache, maxSize);
  };

  return {
    check: (key, now = Date.now()) => {
      if (!key) {
        return false;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const existing = cache.get(key);
      if (existing !== undefined && (ttlMs <= 0 || now - existing < ttlMs)) {
        touch(key, now);
        return true;
      }
      touch(key, now);
      prune(now);
      return false;
    },
    clear: () => {
      cache.clear();
    },
    size: () => cache.size,
  };
}
