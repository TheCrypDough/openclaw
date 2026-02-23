/*
 * AUTO ANNOTATION
 * File: src/memory/headers-fingerprint.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeHeaderName(name: string): string {
  return name.trim().toLowerCase();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function fingerprintHeaderNames(headers: Record<string, string> | undefined): string[] {
  if (!headers) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const out: string[] = [];
  for (const key of Object.keys(headers)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = normalizeHeaderName(key);
    if (!normalized) {
      continue;
    }
    out.push(normalized);
  }
  out.sort((a, b) => a.localeCompare(b));
  return out;
}
