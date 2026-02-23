/*
 * AUTO ANNOTATION
 * File: src/cron/webhook-url.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isAllowedWebhookProtocol(protocol: string) {
  return protocol === "http:" || protocol === "https:";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeHttpWebhookUrl(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = new URL(trimmed);
    if (!isAllowedWebhookProtocol(parsed.protocol)) {
      return null;
    }
    return trimmed;
  } catch {
    return null;
  }
}
