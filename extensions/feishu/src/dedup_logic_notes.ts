/*
 * AUTO ANNOTATION
 * File: extensions/feishu/src/dedup.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
// Prevent duplicate processing when WebSocket reconnects or Feishu redelivers messages.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEDUP_TTL_MS = 30 * 60 * 1000; // 30 minutes
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEDUP_MAX_SIZE = 1_000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEDUP_CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // cleanup every 5 minutes
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const processedMessageIds = new Map<string, number>(); // messageId -> timestamp
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let lastCleanupTime = Date.now();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function tryRecordMessage(messageId: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = Date.now();

  // Throttled cleanup: evict expired entries at most once per interval.
  if (now - lastCleanupTime > DEDUP_CLEANUP_INTERVAL_MS) {
    for (const [id, ts] of processedMessageIds) {
      if (now - ts > DEDUP_TTL_MS) {
        processedMessageIds.delete(id);
      }
    }
    lastCleanupTime = now;
  }

  if (processedMessageIds.has(messageId)) {
    return false;
  }

  // Evict oldest entries if cache is full.
  if (processedMessageIds.size >= DEDUP_MAX_SIZE) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const first = processedMessageIds.keys().next().value!;
    processedMessageIds.delete(first);
  }

  processedMessageIds.set(messageId, now);
  return true;
}
