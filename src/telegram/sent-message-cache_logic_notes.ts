/*
 * AUTO ANNOTATION
 * File: src/telegram/sent-message-cache.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * In-memory cache of sent message IDs per chat.
 * Used to identify bot's own messages for reaction filtering ("own" mode).
 */

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type CacheEntry = {
  timestamps: Map<number, number>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const sentMessages = new Map<string, CacheEntry>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function getChatKey(chatId: number | string): string {
  return String(chatId);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function cleanupExpired(entry: CacheEntry): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = Date.now();
  for (const [msgId, timestamp] of entry.timestamps) {
    if (now - timestamp > TTL_MS) {
      entry.timestamps.delete(msgId);
    }
  }
}

/**
 * Record a message ID as sent by the bot.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function recordSentMessage(chatId: number | string, messageId: number): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = getChatKey(chatId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let entry = sentMessages.get(key);
  if (!entry) {
    entry = { timestamps: new Map() };
    sentMessages.set(key, entry);
  }
  entry.timestamps.set(messageId, Date.now());
  // Periodic cleanup
  if (entry.timestamps.size > 100) {
    cleanupExpired(entry);
  }
}

/**
 * Check if a message was sent by the bot.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function wasSentByBot(chatId: number | string, messageId: number): boolean {
  const key = getChatKey(chatId);
  const entry = sentMessages.get(key);
  if (!entry) {
    return false;
  }
  // Clean up expired entries on read
  cleanupExpired(entry);
  return entry.timestamps.has(messageId);
}

/**
 * Clear all cached entries (for testing).
 */
export function clearSentMessageCache(): void {
  sentMessages.clear();
}
