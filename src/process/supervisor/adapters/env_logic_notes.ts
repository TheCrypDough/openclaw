/*
 * AUTO ANNOTATION
 * File: src/process/supervisor/adapters/env.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function toStringEnv(env?: NodeJS.ProcessEnv): Record<string, string> {
  if (!env) {
    return {};
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      continue;
    }
    out[key] = String(value);
  }
  return out;
}
