/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/conversation-store-memory.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type {
  MSTeamsConversationStore,
  MSTeamsConversationStoreEntry,
  StoredConversationReference,
} from "./conversation-store.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createMSTeamsConversationStoreMemory(
  initial: MSTeamsConversationStoreEntry[] = [],
): MSTeamsConversationStore {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const map = new Map<string, StoredConversationReference>();
  for (const { conversationId, reference } of initial) {
    map.set(conversationId, reference);
  }

  return {
    upsert: async (conversationId, reference) => {
      map.set(conversationId, reference);
    },
    get: async (conversationId) => {
      return map.get(conversationId) ?? null;
    },
    list: async () => {
      return Array.from(map.entries()).map(([conversationId, reference]) => ({
        conversationId,
        reference,
      }));
    },
    remove: async (conversationId) => {
      return map.delete(conversationId);
    },
    findByUserId: async (id) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const target = id.trim();
      if (!target) {
        return null;
      }
      for (const [conversationId, reference] of map.entries()) {
        if (reference.user?.aadObjectId === target) {
          return { conversationId, reference };
        }
        if (reference.user?.id === target) {
          return { conversationId, reference };
        }
      }
      return null;
    },
  };
}
