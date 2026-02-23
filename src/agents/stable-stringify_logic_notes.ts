/*
 * AUTO ANNOTATION
 * File: src/agents/stable-stringify.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value) ?? "null";
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(",")}]`;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const record = value as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const keys = Object.keys(record).toSorted();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entries = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`);
  return `{${entries.join(",")}}`;
}
