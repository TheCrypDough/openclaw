/*
 * AUTO ANNOTATION
 * File: src/test-utils/chunk-test-helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function countLines(text: string): number {
  return text.split("\n").length;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function hasBalancedFences(chunk: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let open: { markerChar: string; markerLen: number } | null = null;
  for (const line of chunk.split("\n")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const match = line.match(/^( {0,3})(`{3,}|~{3,})(.*)$/);
    if (!match) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const marker = match[2];
    if (!open) {
      open = { markerChar: marker[0], markerLen: marker.length };
      continue;
    }
    if (open.markerChar === marker[0] && marker.length >= open.markerLen) {
      open = null;
    }
  }
  return open === null;
}
