/*
 * AUTO ANNOTATION
 * File: src/sessions/level-overrides.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeVerboseLevel, type VerboseLevel } from "../auto-reply/thinking.js";
import type { SessionEntry } from "../config/sessions.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseVerboseOverride(
  raw: unknown,
): { ok: true; value: VerboseLevel | null | undefined } | { ok: false; error: string } {
  if (raw === null) {
    return { ok: true, value: null };
  }
  if (raw === undefined) {
    return { ok: true, value: undefined };
  }
  if (typeof raw !== "string") {
    return { ok: false, error: 'invalid verboseLevel (use "on"|"off")' };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeVerboseLevel(raw);
  if (!normalized) {
    return { ok: false, error: 'invalid verboseLevel (use "on"|"off")' };
  }
  return { ok: true, value: normalized };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyVerboseOverride(entry: SessionEntry, level: VerboseLevel | null | undefined) {
  if (level === undefined) {
    return;
  }
  if (level === null) {
    delete entry.verboseLevel;
    return;
  }
  entry.verboseLevel = level;
}
