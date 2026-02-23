/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/sent-message-cache.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type CacheEntry = {
  timestamps: Map<string, number>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const sentMessages = new Map<string, CacheEntry>();

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

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function recordMSTeamsSentMessage(conversationId: string, messageId: string): void {
  if (!conversationId || !messageId) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let entry = sentMessages.get(conversationId);
  if (!entry) {
    entry = { timestamps: new Map() };
    sentMessages.set(conversationId, entry);
  }
  entry.timestamps.set(messageId, Date.now());
  if (entry.timestamps.size > 200) {
    cleanupExpired(entry);
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function wasMSTeamsMessageSent(conversationId: string, messageId: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entry = sentMessages.get(conversationId);
  if (!entry) {
    return false;
  }
  cleanupExpired(entry);
  return entry.timestamps.has(messageId);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function clearMSTeamsSentMessageCache(): void {
  sentMessages.clear();
}
