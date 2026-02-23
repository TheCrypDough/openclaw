/*
 * AUTO ANNOTATION
 * File: src/infra/bonjour-errors.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatBonjourError(err: unknown): string {
  if (err instanceof Error) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const msg = err.message || String(err);
    return err.name && err.name !== "Error" ? `${err.name}: ${msg}` : msg;
  }
  return String(err);
}
