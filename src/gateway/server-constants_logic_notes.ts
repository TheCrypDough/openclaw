/*
 * AUTO ANNOTATION
 * File: src/gateway/server-constants.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
// Keep server maxPayload aligned with gateway client maxPayload so high-res canvas snapshots
// don't get disconnected mid-invoke with "Max payload size exceeded".
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const MAX_PAYLOAD_BYTES = 25 * 1024 * 1024;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const MAX_BUFFERED_BYTES = 50 * 1024 * 1024; // per-connection send buffer limit (2x max payload)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_MAX_CHAT_HISTORY_MESSAGES_BYTES = 6 * 1024 * 1024; // keep history responses comfortably under client WS limits
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let maxChatHistoryMessagesBytes = DEFAULT_MAX_CHAT_HISTORY_MESSAGES_BYTES;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const getMaxChatHistoryMessagesBytes = () => maxChatHistoryMessagesBytes;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const __setMaxChatHistoryMessagesBytesForTest = (value?: number) => {
  if (!process.env.VITEST && process.env.NODE_ENV !== "test") {
    return;
  }
  if (value === undefined) {
    maxChatHistoryMessagesBytes = DEFAULT_MAX_CHAT_HISTORY_MESSAGES_BYTES;
    return;
  }
  if (Number.isFinite(value) && value > 0) {
    maxChatHistoryMessagesBytes = value;
  }
};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_HANDSHAKE_TIMEOUT_MS = 10_000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const getHandshakeTimeoutMs = () => {
  if (process.env.VITEST && process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = Number(process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return DEFAULT_HANDSHAKE_TIMEOUT_MS;
};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const TICK_INTERVAL_MS = 30_000;
export const HEALTH_REFRESH_INTERVAL_MS = 60_000;
export const DEDUPE_TTL_MS = 5 * 60_000;
export const DEDUPE_MAX = 1000;
