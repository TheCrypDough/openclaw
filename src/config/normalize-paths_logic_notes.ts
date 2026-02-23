/*
 * AUTO ANNOTATION
 * File: src/config/normalize-paths.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { isPlainObject, resolveUserPath } from "../utils.js";
import type { OpenClawConfig } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const PATH_VALUE_RE = /^~(?=$|[\\/])/;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const PATH_KEY_RE = /(dir|path|paths|file|root|workspace)$/i;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const PATH_LIST_KEYS = new Set(["paths", "pathPrepend"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeStringValue(key: string | undefined, value: string): string {
  if (!PATH_VALUE_RE.test(value.trim())) {
    return value;
  }
  if (!key) {
    return value;
  }
  if (PATH_KEY_RE.test(key) || PATH_LIST_KEYS.has(key)) {
    return resolveUserPath(value);
  }
  return value;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeAny(key: string | undefined, value: unknown): unknown {
  if (typeof value === "string") {
    return normalizeStringValue(key, value);
  }

  if (Array.isArray(value)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalizeChildren = Boolean(key && PATH_LIST_KEYS.has(key));
    return value.map((entry) => {
      if (typeof entry === "string") {
        return normalizeChildren ? normalizeStringValue(key, entry) : entry;
      }
      if (Array.isArray(entry)) {
        return normalizeAny(undefined, entry);
      }
      if (isPlainObject(entry)) {
        return normalizeAny(undefined, entry);
      }
      return entry;
    });
  }

  if (!isPlainObject(value)) {
    return value;
  }

  for (const [childKey, childValue] of Object.entries(value)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const next = normalizeAny(childKey, childValue);
    if (next !== childValue) {
      value[childKey] = next;
    }
  }

  return value;
}

/**
 * Normalize "~" paths in path-ish config fields.
 *
 * Goal: accept `~/...` consistently across config file + env overrides, while
 * keeping the surface area small and predictable.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeConfigPaths(cfg: OpenClawConfig): OpenClawConfig {
  if (!cfg || typeof cfg !== "object") {
    return cfg;
  }
  normalizeAny(undefined, cfg);
  return cfg;
}
