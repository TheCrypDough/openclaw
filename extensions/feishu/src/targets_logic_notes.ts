/*
 * AUTO ANNOTATION
 * File: extensions/feishu/src/targets.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { FeishuIdType } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CHAT_ID_PREFIX = "oc_";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OPEN_ID_PREFIX = "ou_";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const USER_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function detectIdType(id: string): FeishuIdType | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = id.trim();
  if (trimmed.startsWith(CHAT_ID_PREFIX)) {
    return "chat_id";
  }
  if (trimmed.startsWith(OPEN_ID_PREFIX)) {
    return "open_id";
  }
  if (USER_ID_REGEX.test(trimmed)) {
    return "user_id";
  }
  return null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeFeishuTarget(raw: string): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lowered = trimmed.toLowerCase();
  if (lowered.startsWith("chat:")) {
    return trimmed.slice("chat:".length).trim() || null;
  }
  if (lowered.startsWith("user:")) {
    return trimmed.slice("user:".length).trim() || null;
  }
  if (lowered.startsWith("open_id:")) {
    return trimmed.slice("open_id:".length).trim() || null;
  }

  return trimmed;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatFeishuTarget(id: string, type?: FeishuIdType): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = id.trim();
  if (type === "chat_id" || trimmed.startsWith(CHAT_ID_PREFIX)) {
    return `chat:${trimmed}`;
  }
  if (type === "open_id" || trimmed.startsWith(OPEN_ID_PREFIX)) {
    return `user:${trimmed}`;
  }
  return trimmed;
}

export function resolveReceiveIdType(id: string): "chat_id" | "open_id" | "user_id" {
  const trimmed = id.trim();
  if (trimmed.startsWith(CHAT_ID_PREFIX)) {
    return "chat_id";
  }
  if (trimmed.startsWith(OPEN_ID_PREFIX)) {
    return "open_id";
  }
  return "user_id";
}

export function looksLikeFeishuId(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) {
    return false;
  }
  if (/^(chat|user|open_id):/i.test(trimmed)) {
    return true;
  }
  if (trimmed.startsWith(CHAT_ID_PREFIX)) {
    return true;
  }
  if (trimmed.startsWith(OPEN_ID_PREFIX)) {
    return true;
  }
  return false;
}
