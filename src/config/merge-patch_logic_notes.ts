/*
 * AUTO ANNOTATION
 * File: src/config/merge-patch.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { isPlainObject } from "../utils.js";
import { isBlockedObjectKey } from "./prototype-keys.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type PlainObject = Record<string, unknown>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MergePatchOptions = {
  mergeObjectArraysById?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isObjectWithStringId(value: unknown): value is Record<string, unknown> & { id: string } {
  if (!isPlainObject(value)) {
    return false;
  }
  return typeof value.id === "string" && value.id.length > 0;
}

/**
 * Merge arrays of object-like entries keyed by `id`.
 *
 * Contract:
 * - Base array must be fully id-keyed; otherwise return undefined (caller should replace).
 * - Patch entries with valid id merge by id (or append when the id is new).
 * - Patch entries without valid id append as-is, avoiding destructive full-array replacement.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function mergeObjectArraysById(
  base: unknown[],
  patch: unknown[],
  options: MergePatchOptions,
): unknown[] | undefined {
  if (!base.every(isObjectWithStringId)) {
    return undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const merged: unknown[] = [...base];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const indexById = new Map<string, number>();
  for (const [index, entry] of merged.entries()) {
    if (!isObjectWithStringId(entry)) {
      return undefined;
    }
    indexById.set(entry.id, index);
  }

  for (const patchEntry of patch) {
    if (!isObjectWithStringId(patchEntry)) {
      merged.push(structuredClone(patchEntry));
      continue;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const existingIndex = indexById.get(patchEntry.id);
    if (existingIndex === undefined) {
      merged.push(structuredClone(patchEntry));
      indexById.set(patchEntry.id, merged.length - 1);
      continue;
    }

    merged[existingIndex] = applyMergePatch(merged[existingIndex], patchEntry, options);
  }

  return merged;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyMergePatch(
  base: unknown,
  patch: unknown,
  options: MergePatchOptions = {},
): unknown {
  if (!isPlainObject(patch)) {
    return patch;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result: PlainObject = isPlainObject(base) ? { ...base } : {};

  for (const [key, value] of Object.entries(patch)) {
    if (isBlockedObjectKey(key)) {
      continue;
    }
    if (value === null) {
      delete result[key];
      continue;
    }
    if (options.mergeObjectArraysById && Array.isArray(result[key]) && Array.isArray(value)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const mergedArray = mergeObjectArraysById(result[key] as unknown[], value, options);
      if (mergedArray) {
        result[key] = mergedArray;
        continue;
      }
    }
    if (isPlainObject(value)) {
      const baseValue = result[key];
      result[key] = applyMergePatch(isPlainObject(baseValue) ? baseValue : {}, value, options);
      continue;
    }
    result[key] = value;
  }

  return result;
}
