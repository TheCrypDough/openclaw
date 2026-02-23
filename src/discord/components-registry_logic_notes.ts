/*
 * AUTO ANNOTATION
 * File: src/discord/components-registry.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { DiscordComponentEntry, DiscordModalEntry } from "./components.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_COMPONENT_TTL_MS = 30 * 60 * 1000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const componentEntries = new Map<string, DiscordComponentEntry>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const modalEntries = new Map<string, DiscordModalEntry>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isExpired(entry: { expiresAt?: number }, now: number) {
  return typeof entry.expiresAt === "number" && entry.expiresAt <= now;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeEntryTimestamps<T extends { createdAt?: number; expiresAt?: number }>(
  entry: T,
  now: number,
  ttlMs: number,
): T {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const createdAt = entry.createdAt ?? now;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const expiresAt = entry.expiresAt ?? createdAt + ttlMs;
  return { ...entry, createdAt, expiresAt };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerDiscordComponentEntries(params: {
  entries: DiscordComponentEntry[];
  modals: DiscordModalEntry[];
  ttlMs?: number;
  messageId?: string;
}): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ttlMs = params.ttlMs ?? DEFAULT_COMPONENT_TTL_MS;
  for (const entry of params.entries) {
    const normalized = normalizeEntryTimestamps(
      { ...entry, messageId: params.messageId ?? entry.messageId },
      now,
      ttlMs,
    );
    componentEntries.set(entry.id, normalized);
  }
  for (const modal of params.modals) {
    const normalized = normalizeEntryTimestamps(
      { ...modal, messageId: params.messageId ?? modal.messageId },
      now,
      ttlMs,
    );
    modalEntries.set(modal.id, normalized);
  }
}

export function resolveDiscordComponentEntry(params: {
  id: string;
  consume?: boolean;
}): DiscordComponentEntry | null {
  const entry = componentEntries.get(params.id);
  if (!entry) {
    return null;
  }
  const now = Date.now();
  if (isExpired(entry, now)) {
    componentEntries.delete(params.id);
    return null;
  }
  if (params.consume !== false) {
    componentEntries.delete(params.id);
  }
  return entry;
}

export function resolveDiscordModalEntry(params: {
  id: string;
  consume?: boolean;
}): DiscordModalEntry | null {
  const entry = modalEntries.get(params.id);
  if (!entry) {
    return null;
  }
  const now = Date.now();
  if (isExpired(entry, now)) {
    modalEntries.delete(params.id);
    return null;
  }
  if (params.consume !== false) {
    modalEntries.delete(params.id);
  }
  return entry;
}

export function clearDiscordComponentEntries(): void {
  componentEntries.clear();
  modalEntries.clear();
}
