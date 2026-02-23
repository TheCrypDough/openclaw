/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/conversation-store-fs.ts
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
import { resolveMSTeamsStorePath } from "./storage.js";
import { readJsonFile, withFileLock, writeJsonFile } from "./store-fs.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ConversationStoreData = {
  version: 1;
  conversations: Record<string, StoredConversationReference & { lastSeenAt?: string }>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const STORE_FILENAME = "msteams-conversations.json";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAX_CONVERSATIONS = 1000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CONVERSATION_TTL_MS = 365 * 24 * 60 * 60 * 1000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseTimestamp(value: string | undefined): number | null {
  if (!value) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function pruneToLimit(
  conversations: Record<string, StoredConversationReference & { lastSeenAt?: string }>,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entries = Object.entries(conversations);
  if (entries.length <= MAX_CONVERSATIONS) {
    return conversations;
  }

  entries.sort((a, b) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const aTs = parseTimestamp(a[1].lastSeenAt) ?? 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const bTs = parseTimestamp(b[1].lastSeenAt) ?? 0;
    return aTs - bTs;
  });

  const keep = entries.slice(entries.length - MAX_CONVERSATIONS);
  return Object.fromEntries(keep);
}

function pruneExpired(
  conversations: Record<string, StoredConversationReference & { lastSeenAt?: string }>,
  nowMs: number,
  ttlMs: number,
) {
  let removed = false;
  const kept: typeof conversations = {};
  for (const [conversationId, reference] of Object.entries(conversations)) {
    const lastSeenAt = parseTimestamp(reference.lastSeenAt);
    // Preserve legacy entries that have no lastSeenAt until they're seen again.
    if (lastSeenAt != null && nowMs - lastSeenAt > ttlMs) {
      removed = true;
      continue;
    }
    kept[conversationId] = reference;
  }
  return { conversations: kept, removed };
}

function normalizeConversationId(raw: string): string {
  return raw.split(";")[0] ?? raw;
}

export function createMSTeamsConversationStoreFs(params?: {
  env?: NodeJS.ProcessEnv;
  homedir?: () => string;
  ttlMs?: number;
  stateDir?: string;
  storePath?: string;
}): MSTeamsConversationStore {
  const ttlMs = params?.ttlMs ?? CONVERSATION_TTL_MS;
  const filePath = resolveMSTeamsStorePath({
    filename: STORE_FILENAME,
    env: params?.env,
    homedir: params?.homedir,
    stateDir: params?.stateDir,
    storePath: params?.storePath,
  });

  const empty: ConversationStoreData = { version: 1, conversations: {} };

  const readStore = async (): Promise<ConversationStoreData> => {
    const { value } = await readJsonFile<ConversationStoreData>(filePath, empty);
    if (
      value.version !== 1 ||
      !value.conversations ||
      typeof value.conversations !== "object" ||
      Array.isArray(value.conversations)
    ) {
      return empty;
    }
    const nowMs = Date.now();
    const pruned = pruneExpired(value.conversations, nowMs, ttlMs).conversations;
    return { version: 1, conversations: pruneToLimit(pruned) };
  };

  const list = async (): Promise<MSTeamsConversationStoreEntry[]> => {
    const store = await readStore();
    return Object.entries(store.conversations).map(([conversationId, reference]) => ({
      conversationId,
      reference,
    }));
  };

  const get = async (conversationId: string): Promise<StoredConversationReference | null> => {
    const store = await readStore();
    return store.conversations[normalizeConversationId(conversationId)] ?? null;
  };

  const findByUserId = async (id: string): Promise<MSTeamsConversationStoreEntry | null> => {
    const target = id.trim();
    if (!target) {
      return null;
    }
    for (const entry of await list()) {
      const { conversationId, reference } = entry;
      if (reference.user?.aadObjectId === target) {
        return { conversationId, reference };
      }
      if (reference.user?.id === target) {
        return { conversationId, reference };
      }
    }
    return null;
  };

  const upsert = async (
    conversationId: string,
    reference: StoredConversationReference,
  ): Promise<void> => {
    const normalizedId = normalizeConversationId(conversationId);
    await withFileLock(filePath, empty, async () => {
      const store = await readStore();
      store.conversations[normalizedId] = {
        ...reference,
        lastSeenAt: new Date().toISOString(),
      };
      const nowMs = Date.now();
      store.conversations = pruneExpired(store.conversations, nowMs, ttlMs).conversations;
      store.conversations = pruneToLimit(store.conversations);
      await writeJsonFile(filePath, store);
    });
  };

  const remove = async (conversationId: string): Promise<boolean> => {
    const normalizedId = normalizeConversationId(conversationId);
    return await withFileLock(filePath, empty, async () => {
      const store = await readStore();
      if (!(normalizedId in store.conversations)) {
        return false;
      }
      delete store.conversations[normalizedId];
      await writeJsonFile(filePath, store);
      return true;
    });
  };

  return { upsert, get, list, remove, findByUserId };
}
