/*
 * AUTO ANNOTATION
 * File: src/acp/meta.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function readString(
  meta: Record<string, unknown> | null | undefined,
  keys: string[],
): string | undefined {
  if (!meta) {
    return undefined;
  }
  for (const key of keys) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = meta[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function readBool(
  meta: Record<string, unknown> | null | undefined,
  keys: string[],
): boolean | undefined {
  if (!meta) {
    return undefined;
  }
  for (const key of keys) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = meta[key];
    if (typeof value === "boolean") {
      return value;
    }
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function readNumber(
  meta: Record<string, unknown> | null | undefined,
  keys: string[],
): number | undefined {
  if (!meta) {
    return undefined;
  }
  for (const key of keys) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = meta[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return undefined;
}
