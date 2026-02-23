/*
 * AUTO ANNOTATION
 * File: src/shared/process-scoped-map.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveProcessScopedMap<T>(key: symbol): Map<string, T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const proc = process as NodeJS.Process & {
    [symbolKey: symbol]: Map<string, T> | undefined;
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existing = proc[key];
  if (existing) {
    return existing;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const created = new Map<string, T>();
  proc[key] = created;
  return created;
}
