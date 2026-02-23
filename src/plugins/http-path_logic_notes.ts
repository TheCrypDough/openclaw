/*
 * AUTO ANNOTATION
 * File: src/plugins/http-path.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizePluginHttpPath(
  path?: string | null,
  fallback?: string | null,
): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = path?.trim();
  if (!trimmed) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fallbackTrimmed = fallback?.trim();
    if (!fallbackTrimmed) {
      return null;
    }
    return fallbackTrimmed.startsWith("/") ? fallbackTrimmed : `/${fallbackTrimmed}`;
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
