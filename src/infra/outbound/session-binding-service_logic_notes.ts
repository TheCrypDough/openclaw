/*
 * AUTO ANNOTATION
 * File: src/infra/outbound/session-binding-service.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeAccountId } from "../../routing/session-key.js";

export type BindingTargetKind = "subagent" | "session";
export type BindingStatus = "active" | "ending" | "ended";

export type ConversationRef = {
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
};

export type SessionBindingRecord = {
  bindingId: string;
  targetSessionKey: string;
  targetKind: BindingTargetKind;
  conversation: ConversationRef;
  status: BindingStatus;
  boundAt: number;
  expiresAt?: number;
  metadata?: Record<string, unknown>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SessionBindingBindInput = {
  targetSessionKey: string;
  targetKind: BindingTargetKind;
  conversation: ConversationRef;
  metadata?: Record<string, unknown>;
  ttlMs?: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SessionBindingUnbindInput = {
  bindingId?: string;
  targetSessionKey?: string;
  reason: string;
};

export type SessionBindingService = {
  bind: (input: SessionBindingBindInput) => Promise<SessionBindingRecord>;
  listBySession: (targetSessionKey: string) => SessionBindingRecord[];
  resolveByConversation: (ref: ConversationRef) => SessionBindingRecord | null;
  touch: (bindingId: string, at?: number) => void;
  unbind: (input: SessionBindingUnbindInput) => Promise<SessionBindingRecord[]>;
};

export type SessionBindingAdapter = {
  channel: string;
  accountId: string;
  bind?: (input: SessionBindingBindInput) => Promise<SessionBindingRecord | null>;
  listBySession: (targetSessionKey: string) => SessionBindingRecord[];
  resolveByConversation: (ref: ConversationRef) => SessionBindingRecord | null;
  touch?: (bindingId: string, at?: number) => void;
  unbind?: (input: SessionBindingUnbindInput) => Promise<SessionBindingRecord[]>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeConversationRef(ref: ConversationRef): ConversationRef {
  return {
    channel: ref.channel.trim().toLowerCase(),
    accountId: normalizeAccountId(ref.accountId),
    conversationId: ref.conversationId.trim(),
    parentConversationId: ref.parentConversationId?.trim() || undefined,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function toAdapterKey(params: { channel: string; accountId: string }): string {
  return `${params.channel.trim().toLowerCase()}:${normalizeAccountId(params.accountId)}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ADAPTERS_BY_CHANNEL_ACCOUNT = new Map<string, SessionBindingAdapter>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerSessionBindingAdapter(adapter: SessionBindingAdapter): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = toAdapterKey({
    channel: adapter.channel,
    accountId: adapter.accountId,
  });
  ADAPTERS_BY_CHANNEL_ACCOUNT.set(key, {
    ...adapter,
    channel: adapter.channel.trim().toLowerCase(),
    accountId: normalizeAccountId(adapter.accountId),
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function unregisterSessionBindingAdapter(params: {
  channel: string;
  accountId: string;
}): void {
  ADAPTERS_BY_CHANNEL_ACCOUNT.delete(toAdapterKey(params));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAdapterForConversation(ref: ConversationRef): SessionBindingAdapter | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeConversationRef(ref);
  const key = toAdapterKey({
    channel: normalized.channel,
    accountId: normalized.accountId,
  });
  return ADAPTERS_BY_CHANNEL_ACCOUNT.get(key) ?? null;
}

function dedupeBindings(records: SessionBindingRecord[]): SessionBindingRecord[] {
  const byId = new Map<string, SessionBindingRecord>();
  for (const record of records) {
    if (!record?.bindingId) {
      continue;
    }
    byId.set(record.bindingId, record);
  }
  return [...byId.values()];
}

function createDefaultSessionBindingService(): SessionBindingService {
  return {
    bind: async (input) => {
      const normalizedConversation = normalizeConversationRef(input.conversation);
      const adapter = resolveAdapterForConversation(normalizedConversation);
      if (!adapter?.bind) {
        throw new Error(
          `Session binding adapter unavailable for ${normalizedConversation.channel}:${normalizedConversation.accountId}`,
        );
      }
      const bound = await adapter.bind({
        ...input,
        conversation: normalizedConversation,
      });
      if (!bound) {
        throw new Error("Session binding adapter failed to bind target conversation");
      }
      return bound;
    },
    listBySession: (targetSessionKey) => {
      const key = targetSessionKey.trim();
      if (!key) {
        return [];
      }
      const results: SessionBindingRecord[] = [];
      for (const adapter of ADAPTERS_BY_CHANNEL_ACCOUNT.values()) {
        const entries = adapter.listBySession(key);
        if (entries.length > 0) {
          results.push(...entries);
        }
      }
      return dedupeBindings(results);
    },
    resolveByConversation: (ref) => {
      const normalized = normalizeConversationRef(ref);
      if (!normalized.channel || !normalized.conversationId) {
        return null;
      }
      const adapter = resolveAdapterForConversation(normalized);
      if (!adapter) {
        return null;
      }
      return adapter.resolveByConversation(normalized);
    },
    touch: (bindingId, at) => {
      const normalizedBindingId = bindingId.trim();
      if (!normalizedBindingId) {
        return;
      }
      for (const adapter of ADAPTERS_BY_CHANNEL_ACCOUNT.values()) {
        adapter.touch?.(normalizedBindingId, at);
      }
    },
    unbind: async (input) => {
      const removed: SessionBindingRecord[] = [];
      for (const adapter of ADAPTERS_BY_CHANNEL_ACCOUNT.values()) {
        if (!adapter.unbind) {
          continue;
        }
        const entries = await adapter.unbind(input);
        if (entries.length > 0) {
          removed.push(...entries);
        }
      }
      return dedupeBindings(removed);
    },
  };
}

const DEFAULT_SESSION_BINDING_SERVICE = createDefaultSessionBindingService();

export function getSessionBindingService(): SessionBindingService {
  return DEFAULT_SESSION_BINDING_SERVICE;
}

export const __testing = {
  resetSessionBindingAdaptersForTests() {
    ADAPTERS_BY_CHANNEL_ACCOUNT.clear();
  },
  getRegisteredAdapterKeys() {
    return [...ADAPTERS_BY_CHANNEL_ACCOUNT.keys()];
  },
};
