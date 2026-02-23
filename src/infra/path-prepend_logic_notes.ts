/*
 * AUTO ANNOTATION
 * File: src/infra/path-prepend.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizePathPrepend(entries?: string[]) {
  if (!Array.isArray(entries)) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const seen = new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized: string[] = [];
  for (const entry of entries) {
    if (typeof entry !== "string") {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const trimmed = entry.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    normalized.push(trimmed);
  }
  return normalized;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function mergePathPrepend(existing: string | undefined, prepend: string[]) {
  if (prepend.length === 0) {
    return existing;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const partsExisting = (existing ?? "")
    .split(path.delimiter)
    .map((part) => part.trim())
    .filter(Boolean);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const merged: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const seen = new Set<string>();
  for (const part of [...prepend, ...partsExisting]) {
    if (seen.has(part)) {
      continue;
    }
    seen.add(part);
    merged.push(part);
  }
  return merged.join(path.delimiter);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyPathPrepend(
  env: Record<string, string>,
  prepend: string[] | undefined,
  options?: { requireExisting?: boolean },
) {
  if (!Array.isArray(prepend) || prepend.length === 0) {
    return;
  }
  if (options?.requireExisting && !env.PATH) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const merged = mergePathPrepend(env.PATH, prepend);
  if (merged) {
    env.PATH = merged;
  }
}
