/*
 * AUTO ANNOTATION
 * File: src/infra/tls/fingerprint.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeFingerprint(input: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = input.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const withoutPrefix = trimmed.replace(/^sha-?256\s*:?\s*/i, "");
  return withoutPrefix.replace(/[^a-fA-F0-9]/g, "").toLowerCase();
}
