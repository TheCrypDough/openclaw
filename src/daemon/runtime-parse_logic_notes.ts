/*
 * AUTO ANNOTATION
 * File: src/daemon/runtime-parse.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseKeyValueOutput(output: string, separator: string): Record<string, string> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entries: Record<string, string> = {};
  for (const rawLine of output.split(/\r?\n/)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const line = rawLine.trim();
    if (!line) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const idx = line.indexOf(separator);
    if (idx <= 0) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const key = line.slice(0, idx).trim().toLowerCase();
    if (!key) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = line.slice(idx + separator.length).trim();
    entries[key] = value;
  }
  return entries;
}
