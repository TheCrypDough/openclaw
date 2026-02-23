/*
 * AUTO ANNOTATION
 * File: src/commands/models/list.errors.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const MODEL_AVAILABILITY_UNAVAILABLE_CODE = "MODEL_AVAILABILITY_UNAVAILABLE";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatErrorWithStack(err: unknown): string {
  if (err instanceof Error) {
    return err.stack ?? `${err.name}: ${err.message}`;
  }
  return String(err);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function shouldFallbackToAuthHeuristics(err: unknown): boolean {
  if (!(err instanceof Error)) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const code = (err as { code?: unknown }).code;
  return code === MODEL_AVAILABILITY_UNAVAILABLE_CODE;
}
