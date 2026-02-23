/*
 * AUTO ANNOTATION
 * File: src/config/runtime-overrides.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { isPlainObject } from "../utils.js";
import { parseConfigPath, setConfigValueAtPath, unsetConfigValueAtPath } from "./config-paths.js";
import { isBlockedObjectKey } from "./prototype-keys.js";
import type { OpenClawConfig } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type OverrideTree = Record<string, unknown>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let overrides: OverrideTree = {};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function sanitizeOverrideValue(value: unknown, seen = new WeakSet<object>()): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeOverrideValue(entry, seen));
  }
  if (!isPlainObject(value)) {
    return value;
  }
  if (seen.has(value)) {
    return {};
  }
  seen.add(value);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sanitized: OverrideTree = {};
  for (const [key, entry] of Object.entries(value)) {
    if (entry === undefined || isBlockedObjectKey(key)) {
      continue;
    }
    sanitized[key] = sanitizeOverrideValue(entry, seen);
  }
  seen.delete(value);
  return sanitized;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function mergeOverrides(base: unknown, override: unknown): unknown {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const next: OverrideTree = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined || isBlockedObjectKey(key)) {
      continue;
    }
    next[key] = mergeOverrides((base as OverrideTree)[key], value);
  }
  return next;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getConfigOverrides(): OverrideTree {
  return overrides;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resetConfigOverrides(): void {
  overrides = {};
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setConfigOverride(
  pathRaw: string,
  value: unknown,
): {
  ok: boolean;
  error?: string;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = parseConfigPath(pathRaw);
  if (!parsed.ok || !parsed.path) {
    return { ok: false, error: parsed.error ?? "Invalid path." };
  }
  setConfigValueAtPath(overrides, parsed.path, sanitizeOverrideValue(value));
  return { ok: true };
}

export function unsetConfigOverride(pathRaw: string): {
  ok: boolean;
  removed: boolean;
  error?: string;
} {
  const parsed = parseConfigPath(pathRaw);
  if (!parsed.ok || !parsed.path) {
    return {
      ok: false,
      removed: false,
      error: parsed.error ?? "Invalid path.",
    };
  }
  const removed = unsetConfigValueAtPath(overrides, parsed.path);
  return { ok: true, removed };
}

export function applyConfigOverrides(cfg: OpenClawConfig): OpenClawConfig {
  if (!overrides || Object.keys(overrides).length === 0) {
    return cfg;
  }
  return mergeOverrides(cfg, overrides) as OpenClawConfig;
}
