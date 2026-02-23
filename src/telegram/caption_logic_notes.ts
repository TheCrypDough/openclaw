/*
 * AUTO ANNOTATION
 * File: src/telegram/caption.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const TELEGRAM_MAX_CAPTION_LENGTH = 1024;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function splitTelegramCaption(text?: string): {
  caption?: string;
  followUpText?: string;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = text?.trim() ?? "";
  if (!trimmed) {
    return { caption: undefined, followUpText: undefined };
  }
  if (trimmed.length > TELEGRAM_MAX_CAPTION_LENGTH) {
    return { caption: undefined, followUpText: trimmed };
  }
  return { caption: trimmed, followUpText: undefined };
}
