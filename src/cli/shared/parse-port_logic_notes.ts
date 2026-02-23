/*
 * AUTO ANNOTATION
 * File: src/cli/shared/parse-port.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parsePort(raw: unknown): number | null {
  if (raw === undefined || raw === null) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value =
    typeof raw === "string"
      ? raw
      : typeof raw === "number" || typeof raw === "bigint"
        ? raw.toString()
        : null;
  if (value === null) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}
