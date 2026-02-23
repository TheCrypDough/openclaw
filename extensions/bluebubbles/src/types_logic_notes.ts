/*
 * AUTO ANNOTATION
 * File: extensions/bluebubbles/src/types.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { DmPolicy, GroupPolicy } from "openclaw/plugin-sdk";

export type { DmPolicy, GroupPolicy } from "openclaw/plugin-sdk";

export type BlueBubblesGroupConfig = {
  /** If true, only respond in this group when mentioned. */
  requireMention?: boolean;
  /** Optional tool policy overrides for this group. */
  tools?: { allow?: string[]; deny?: string[] };
};

export type BlueBubblesAccountConfig = {
  /** Optional display name for this account (used in CLI/UI lists). */
  name?: string;
  /** Optional provider capability tags used for agent/runtime guidance. */
  capabilities?: string[];
  /** Allow channel-initiated config writes (default: true). */
  configWrites?: boolean;
  /** If false, do not start this BlueBubbles account. Default: true. */
  enabled?: boolean;
  /** Base URL for the BlueBubbles API. */
  serverUrl?: string;
  /** Password for BlueBubbles API authentication. */
  password?: string;
  /** Webhook path for the gateway HTTP server. */
  webhookPath?: string;
  /** Direct message access policy (default: pairing). */
  dmPolicy?: DmPolicy;
  allowFrom?: Array<string | number>;
  /** Optional allowlist for group senders. */
  groupAllowFrom?: Array<string | number>;
  /** Group message handling policy. */
  groupPolicy?: GroupPolicy;
  /** Max group messages to keep as history context (0 disables). */
  historyLimit?: number;
  /** Max DM turns to keep as history context. */
  dmHistoryLimit?: number;
  /** Per-DM config overrides keyed by user ID. */
  dms?: Record<string, unknown>;
  /** Outbound text chunk size (chars). Default: 4000. */
  textChunkLimit?: number;
  /** Chunking mode: "newline" (default) splits on every newline; "length" splits by size. */
  chunkMode?: "length" | "newline";
  blockStreaming?: boolean;
  /** Merge streamed block replies before sending. */
  blockStreamingCoalesce?: Record<string, unknown>;
  /** Max outbound media size in MB. */
  mediaMaxMb?: number;
  /**
   * Explicit allowlist of local directory roots permitted for outbound media paths.
   * Local paths are rejected unless they resolve under one of these roots.
   */
  mediaLocalRoots?: string[];
  /** Send read receipts for incoming messages (default: true). */
  sendReadReceipts?: boolean;
  /** Per-group configuration keyed by chat GUID or identifier. */
  groups?: Record<string, BlueBubblesGroupConfig>;
};

export type BlueBubblesActionConfig = {
  reactions?: boolean;
  edit?: boolean;
  unsend?: boolean;
  reply?: boolean;
  sendWithEffect?: boolean;
  renameGroup?: boolean;
  addParticipant?: boolean;
  removeParticipant?: boolean;
  leaveGroup?: boolean;
  sendAttachment?: boolean;
};

export type BlueBubblesConfig = {
  /** Optional per-account BlueBubbles configuration (multi-account). */
  accounts?: Record<string, BlueBubblesAccountConfig>;
  /** Per-action tool gating (default: true for all). */
  actions?: BlueBubblesActionConfig;
} & BlueBubblesAccountConfig;

export type BlueBubblesSendTarget =
  | { kind: "chat_id"; chatId: number }
  | { kind: "chat_guid"; chatGuid: string }
  | { kind: "chat_identifier"; chatIdentifier: string }
  | { kind: "handle"; address: string; service?: "imessage" | "sms" | "auto" };

export type BlueBubblesAttachment = {
  guid?: string;
  uti?: string;
  mimeType?: string;
  transferName?: string;
  totalBytes?: number;
  height?: number;
  width?: number;
  originalROWID?: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_TIMEOUT_MS = 10_000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeBlueBubblesServerUrl(raw: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("BlueBubbles serverUrl is required");
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
  return withScheme.replace(/\/+$/, "");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildBlueBubblesApiUrl(params: {
  baseUrl: string;
  path: string;
  password?: string;
}): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeBlueBubblesServerUrl(params.baseUrl);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const url = new URL(params.path, `${normalized}/`);
  if (params.password) {
    url.searchParams.set("password", params.password);
  }
  return url.toString();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function blueBubblesFetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const controller = new AbortController();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
