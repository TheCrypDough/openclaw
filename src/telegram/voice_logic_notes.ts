/*
 * AUTO ANNOTATION
 * File: src/telegram/voice.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { isTelegramVoiceCompatibleAudio } from "../media/audio.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveTelegramVoiceDecision(opts: {
  wantsVoice: boolean;
  contentType?: string | null;
  fileName?: string | null;
}): { useVoice: boolean; reason?: string } {
  if (!opts.wantsVoice) {
    return { useVoice: false };
  }
  if (isTelegramVoiceCompatibleAudio(opts)) {
    return { useVoice: true };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const contentType = opts.contentType ?? "unknown";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fileName = opts.fileName ?? "unknown";
  return {
    useVoice: false,
    reason: `media is ${contentType} (${fileName})`,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveTelegramVoiceSend(opts: {
  wantsVoice: boolean;
  contentType?: string | null;
  fileName?: string | null;
  logFallback?: (message: string) => void;
}): { useVoice: boolean } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const decision = resolveTelegramVoiceDecision(opts);
  if (decision.reason && opts.logFallback) {
    opts.logFallback(
      `Telegram voice requested but ${decision.reason}; sending as audio file instead.`,
    );
  }
  return { useVoice: decision.useVoice };
}
