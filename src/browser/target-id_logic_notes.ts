/*
 * AUTO ANNOTATION
 * File: src/browser/target-id.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type TargetIdResolution =
  | { ok: true; targetId: string }
  | { ok: false; reason: "not_found" | "ambiguous"; matches?: string[] };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveTargetIdFromTabs(
  input: string,
  tabs: Array<{ targetId: string }>,
): TargetIdResolution {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const needle = input.trim();
  if (!needle) {
    return { ok: false, reason: "not_found" };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const exact = tabs.find((t) => t.targetId === needle);
  if (exact) {
    return { ok: true, targetId: exact.targetId };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lower = needle.toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matches = tabs.map((t) => t.targetId).filter((id) => id.toLowerCase().startsWith(lower));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const only = matches.length === 1 ? matches[0] : undefined;
  if (only) {
    return { ok: true, targetId: only };
  }
  if (matches.length === 0) {
    return { ok: false, reason: "not_found" };
  }
  return { ok: false, reason: "ambiguous", matches };
}
