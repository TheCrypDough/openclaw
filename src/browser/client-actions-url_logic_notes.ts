/*
 * AUTO ANNOTATION
 * File: src/browser/client-actions-url.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildProfileQuery(profile?: string): string {
  return profile ? `?profile=${encodeURIComponent(profile)}` : "";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function withBaseUrl(baseUrl: string | undefined, path: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = baseUrl?.trim();
  if (!trimmed) {
    return path;
  }
  return `${trimmed.replace(/\/$/, "")}${path}`;
}
