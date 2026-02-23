/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/typing-mode.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { TypingMode } from "../../config/types.js";
import { isSilentReplyText, SILENT_REPLY_TOKEN } from "../tokens.js";
import type { TypingController } from "./typing.js";

export type TypingModeContext = {
  configured?: TypingMode;
  isGroupChat: boolean;
  wasMentioned: boolean;
  isHeartbeat: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_GROUP_TYPING_MODE: TypingMode = "message";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveTypingMode({
  configured,
  isGroupChat,
  wasMentioned,
  isHeartbeat,
}: TypingModeContext): TypingMode {
  if (isHeartbeat) {
    return "never";
  }
  if (configured) {
    return configured;
  }
  if (!isGroupChat || wasMentioned) {
    return "instant";
  }
  return DEFAULT_GROUP_TYPING_MODE;
}

export type TypingSignaler = {
  mode: TypingMode;
  shouldStartImmediately: boolean;
  shouldStartOnMessageStart: boolean;
  shouldStartOnText: boolean;
  shouldStartOnReasoning: boolean;
  signalRunStart: () => Promise<void>;
  signalMessageStart: () => Promise<void>;
  signalTextDelta: (text?: string) => Promise<void>;
  signalReasoningDelta: () => Promise<void>;
  signalToolStart: () => Promise<void>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createTypingSignaler(params: {
  typing: TypingController;
  mode: TypingMode;
  isHeartbeat: boolean;
}): TypingSignaler {
  const { typing, mode, isHeartbeat } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const shouldStartImmediately = mode === "instant";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const shouldStartOnMessageStart = mode === "message";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const shouldStartOnText = mode === "message" || mode === "instant";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const shouldStartOnReasoning = mode === "thinking";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const disabled = isHeartbeat || mode === "never";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let hasRenderableText = false;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isRenderableText = (text?: string): boolean => {
    const trimmed = text?.trim();
    if (!trimmed) {
      return false;
    }
    return !isSilentReplyText(trimmed, SILENT_REPLY_TOKEN);
  };

  const signalRunStart = async () => {
    if (disabled || !shouldStartImmediately) {
      return;
    }
    await typing.startTypingLoop();
  };

  const signalMessageStart = async () => {
    if (disabled || !shouldStartOnMessageStart) {
      return;
    }
    if (!hasRenderableText) {
      return;
    }
    await typing.startTypingLoop();
  };

  const signalTextDelta = async (text?: string) => {
    if (disabled) {
      return;
    }
    const renderable = isRenderableText(text);
    if (renderable) {
      hasRenderableText = true;
    } else if (text?.trim()) {
      return;
    }
    if (shouldStartOnText) {
      await typing.startTypingOnText(text);
      return;
    }
    if (shouldStartOnReasoning) {
      if (!typing.isActive()) {
        await typing.startTypingLoop();
      }
      typing.refreshTypingTtl();
    }
  };

  const signalReasoningDelta = async () => {
    if (disabled || !shouldStartOnReasoning) {
      return;
    }
    if (!hasRenderableText) {
      return;
    }
    await typing.startTypingLoop();
    typing.refreshTypingTtl();
  };

  const signalToolStart = async () => {
    if (disabled) {
      return;
    }
    // Start typing as soon as tools begin executing, even before the first text delta.
    if (!typing.isActive()) {
      await typing.startTypingLoop();
      typing.refreshTypingTtl();
      return;
    }
    // Keep typing indicator alive during tool execution.
    typing.refreshTypingTtl();
  };

  return {
    mode,
    shouldStartImmediately,
    shouldStartOnMessageStart,
    shouldStartOnText,
    shouldStartOnReasoning,
    signalRunStart,
    signalMessageStart,
    signalTextDelta,
    signalReasoningDelta,
    signalToolStart,
  };
}
