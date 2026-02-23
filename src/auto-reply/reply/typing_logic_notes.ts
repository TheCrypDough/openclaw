/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/typing.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { isSilentReplyText, SILENT_REPLY_TOKEN } from "../tokens.js";

export type TypingController = {
  onReplyStart: () => Promise<void>;
  startTypingLoop: () => Promise<void>;
  startTypingOnText: (text?: string) => Promise<void>;
  refreshTypingTtl: () => void;
  isActive: () => boolean;
  markRunComplete: () => void;
  markDispatchIdle: () => void;
  cleanup: () => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createTypingController(params: {
  onReplyStart?: () => Promise<void> | void;
  onCleanup?: () => void;
  typingIntervalSeconds?: number;
  typingTtlMs?: number;
  silentToken?: string;
  log?: (message: string) => void;
}): TypingController {
  const {
    onReplyStart,
    onCleanup,
    typingIntervalSeconds = 6,
    typingTtlMs = 2 * 60_000,
    silentToken = SILENT_REPLY_TOKEN,
    log,
  } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let started = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let active = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let runComplete = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let dispatchIdle = false;
  // Important: callbacks (tool/block streaming) can fire late (after the run completed),
  // especially when upstream event emitters don't await async listeners.
  // Once we stop typing, we "seal" the controller so late events can't restart typing forever.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let sealed = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let typingTimer: NodeJS.Timeout | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let typingTtlTimer: NodeJS.Timeout | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const typingIntervalMs = typingIntervalSeconds * 1000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const formatTypingTtl = (ms: number) => {
    if (ms % 60_000 === 0) {
      return `${ms / 60_000}m`;
    }
    return `${Math.round(ms / 1000)}s`;
  };

  const resetCycle = () => {
    started = false;
    active = false;
    runComplete = false;
    dispatchIdle = false;
  };

  const cleanup = () => {
    if (sealed) {
      return;
    }
    if (typingTtlTimer) {
      clearTimeout(typingTtlTimer);
      typingTtlTimer = undefined;
    }
    if (typingTimer) {
      clearInterval(typingTimer);
      typingTimer = undefined;
    }
    // Notify the channel to stop its typing indicator (e.g., on NO_REPLY).
    // This fires only once (sealed prevents re-entry).
    if (active) {
      onCleanup?.();
    }
    resetCycle();
    sealed = true;
  };

  const refreshTypingTtl = () => {
    if (sealed) {
      return;
    }
    if (!typingIntervalMs || typingIntervalMs <= 0) {
      return;
    }
    if (typingTtlMs <= 0) {
      return;
    }
    if (typingTtlTimer) {
      clearTimeout(typingTtlTimer);
    }
    typingTtlTimer = setTimeout(() => {
      if (!typingTimer) {
        return;
      }
      log?.(`typing TTL reached (${formatTypingTtl(typingTtlMs)}); stopping typing indicator`);
      cleanup();
    }, typingTtlMs);
  };

  const isActive = () => active && !sealed;

  const triggerTyping = async () => {
    if (sealed) {
      return;
    }
    await onReplyStart?.();
  };

  const ensureStart = async () => {
    if (sealed) {
      return;
    }
    // Late callbacks after a run completed should never restart typing.
    if (runComplete) {
      return;
    }
    if (!active) {
      active = true;
    }
    if (started) {
      return;
    }
    started = true;
    await triggerTyping();
  };

  const maybeStopOnIdle = () => {
    if (!active) {
      return;
    }
    // Stop only when the model run is done and the dispatcher queue is empty.
    if (runComplete && dispatchIdle) {
      cleanup();
    }
  };

  const startTypingLoop = async () => {
    if (sealed) {
      return;
    }
    if (runComplete) {
      return;
    }
    // Always refresh TTL when called, even if loop already running.
    // This keeps typing alive during long tool executions.
    refreshTypingTtl();
    if (!onReplyStart) {
      return;
    }
    if (typingIntervalMs <= 0) {
      return;
    }
    if (typingTimer) {
      return;
    }
    await ensureStart();
    typingTimer = setInterval(() => {
      void triggerTyping();
    }, typingIntervalMs);
  };

  const startTypingOnText = async (text?: string) => {
    if (sealed) {
      return;
    }
    const trimmed = text?.trim();
    if (!trimmed) {
      return;
    }
    if (silentToken && isSilentReplyText(trimmed, silentToken)) {
      return;
    }
    refreshTypingTtl();
    await startTypingLoop();
  };

  const markRunComplete = () => {
    runComplete = true;
    maybeStopOnIdle();
  };

  const markDispatchIdle = () => {
    dispatchIdle = true;
    maybeStopOnIdle();
  };

  return {
    onReplyStart: ensureStart,
    startTypingLoop,
    startTypingOnText,
    refreshTypingTtl,
    isActive,
    markRunComplete,
    markDispatchIdle,
    cleanup,
  };
}
