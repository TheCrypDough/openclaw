# AUTOPLACEHOLDER_ANNOTATION: src/config/config-paths.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { isPlainObject } from "../utils.js";
import { isBlockedObjectKey } from "./prototype-keys.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type PathNode = Record<string, unknown>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseConfigPath(raw: string): {
  ok: boolean;
  path?: string[];
  error?: string;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      ok: false,
      error: "Invalid path. Use dot notation (e.g. foo.bar).",
    };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parts = trimmed.split(".").map((part) => part.trim());
  if (parts.some((part) => !part)) {
    return {
      ok: false,
      error: "Invalid path. Use dot notation (e.g. foo.bar).",
    };
  }
  if (parts.some((part) => isBlockedObjectKey(part))) {
    return { ok: false, error: "Invalid path segment." };
  }
  return { ok: true, path: parts };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setConfigValueAtPath(root: PathNode, path: string[], value: unknown): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let cursor: PathNode = root;
  for (let idx = 0; idx < path.length - 1; idx += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const key = path[idx];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const next = cursor[key];
    if (!isPlainObject(next)) {
      cursor[key] = {};
    }
    cursor = cursor[key] as PathNode;
  }
  cursor[path[path.length - 1]] = value;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function unsetConfigValueAtPath(root: PathNode, path: string[]): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stack: Array<{ node: PathNode; key: string }> = [];
  let cursor: PathNode = root;
  for (let idx = 0; idx < path.length - 1; idx += 1) {
    const key = path[idx];
    const next = cursor[key];
    if (!isPlainObject(next)) {
      return false;
    }
    stack.push({ node: cursor, key });
    cursor = next;
  }
  const leafKey = path[path.length - 1];
  if (!(leafKey in cursor)) {
    return false;
  }
  delete cursor[leafKey];
  for (let idx = stack.length - 1; idx >= 0; idx -= 1) {
    const { node, key } = stack[idx];
    const child = node[key];
    if (isPlainObject(child) && Object.keys(child).length === 0) {
      delete node[key];
    } else {
      break;
    }
  }
  return true;
}

export function getConfigValueAtPath(root: PathNode, path: string[]): unknown {
  let cursor: unknown = root;
  for (const key of path) {
    if (!isPlainObject(cursor)) {
      return undefined;
    }
    cursor = cursor[key];
  }
  return cursor;
}
