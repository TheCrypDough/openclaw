/*
 * AUTO ANNOTATION
 * File: src/cli/wait.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function waitForever() {
  // Keep event loop alive via an unref'ed interval plus a pending promise.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const interval = setInterval(() => {}, 1_000_000);
  interval.unref();
  return new Promise<void>(() => {
    /* never resolve */
  });
}
