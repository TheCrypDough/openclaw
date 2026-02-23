/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/agent-runner-helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { loadSessionStore } from "../../config/sessions.js";
import { isAudioFileName } from "../../media/mime.js";
import { normalizeVerboseLevel, type VerboseLevel } from "../thinking.js";
import type { ReplyPayload } from "../types.js";
import { scheduleFollowupDrain } from "./queue.js";
import type { TypingSignaler } from "./typing-mode.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const hasAudioMedia = (urls?: string[]): boolean =>
  Boolean(urls?.some((url) => isAudioFileName(url)));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const isAudioPayload = (payload: ReplyPayload): boolean =>
  hasAudioMedia(payload.mediaUrls ?? (payload.mediaUrl ? [payload.mediaUrl] : undefined));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type VerboseGateParams = {
  sessionKey?: string;
  storePath?: string;
  resolvedVerboseLevel: VerboseLevel;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveCurrentVerboseLevel(params: VerboseGateParams): VerboseLevel | undefined {
  if (!params.sessionKey || !params.storePath) {
    return undefined;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const store = loadSessionStore(params.storePath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const entry = store[params.sessionKey];
    return normalizeVerboseLevel(String(entry?.verboseLevel ?? ""));
  } catch {
    // ignore store read failures
    return undefined;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createVerboseGate(
  params: VerboseGateParams,
  shouldEmit: (level: VerboseLevel) => boolean,
): () => boolean {
  // Normalize verbose values from session store/config so false/"false" still means off.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fallbackVerbose = normalizeVerboseLevel(String(params.resolvedVerboseLevel ?? "")) ?? "off";
  return () => {
    return shouldEmit(resolveCurrentVerboseLevel(params) ?? fallbackVerbose);
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const createShouldEmitToolResult = (params: VerboseGateParams): (() => boolean) => {
  return createVerboseGate(params, (level) => level !== "off");
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const createShouldEmitToolOutput = (params: VerboseGateParams): (() => boolean) => {
  return createVerboseGate(params, (level) => level === "full");
};

export const finalizeWithFollowup = <T>(
  value: T,
  queueKey: string,
  runFollowupTurn: Parameters<typeof scheduleFollowupDrain>[1],
): T => {
  scheduleFollowupDrain(queueKey, runFollowupTurn);
  return value;
};

export const signalTypingIfNeeded = async (
  payloads: ReplyPayload[],
  typingSignals: TypingSignaler,
): Promise<void> => {
  const shouldSignalTyping = payloads.some((payload) => {
    const trimmed = payload.text?.trim();
    if (trimmed) {
      return true;
    }
    if (payload.mediaUrl) {
      return true;
    }
    if (payload.mediaUrls && payload.mediaUrls.length > 0) {
      return true;
    }
    return false;
  });
  if (shouldSignalTyping) {
    await typingSignals.signalRunStart();
  }
};
