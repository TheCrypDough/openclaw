/*
 * AUTO ANNOTATION
 * File: src/slack/token.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeSlackToken(raw?: string): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSlackBotToken(raw?: string): string | undefined {
  return normalizeSlackToken(raw);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSlackAppToken(raw?: string): string | undefined {
  return normalizeSlackToken(raw);
}
