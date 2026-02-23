/*
 * AUTO ANNOTATION
 * File: ui/src/ui/controllers/config/form-utils.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function cloneConfigObject<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function serializeConfigForm(form: Record<string, unknown>): string {
  return `${JSON.stringify(form, null, 2).trimEnd()}\n`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setPathValue(
  obj: Record<string, unknown> | unknown[],
  path: Array<string | number>,
  value: unknown,
) {
  if (path.length === 0) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let current: Record<string, unknown> | unknown[] = obj;
  for (let i = 0; i < path.length - 1; i += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const key = path[i];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const nextKey = path[i + 1];
    if (typeof key === "number") {
      if (!Array.isArray(current)) {
        return;
      }
      if (current[key] == null) {
        current[key] = typeof nextKey === "number" ? [] : ({} as Record<string, unknown>);
      }
      current = current[key] as Record<string, unknown> | unknown[];
    } else {
      if (typeof current !== "object" || current == null) {
        return;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const record = current as Record<string, unknown>;
      if (record[key] == null) {
        record[key] = typeof nextKey === "number" ? [] : ({} as Record<string, unknown>);
      }
      current = record[key] as Record<string, unknown> | unknown[];
    }
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lastKey = path[path.length - 1];
  if (typeof lastKey === "number") {
    if (Array.isArray(current)) {
      current[lastKey] = value;
    }
    return;
  }
  if (typeof current === "object" && current != null) {
    (current as Record<string, unknown>)[lastKey] = value;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function removePathValue(
  obj: Record<string, unknown> | unknown[],
  path: Array<string | number>,
) {
  if (path.length === 0) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let current: Record<string, unknown> | unknown[] = obj;
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i];
    if (typeof key === "number") {
      if (!Array.isArray(current)) {
        return;
      }
      current = current[key] as Record<string, unknown> | unknown[];
    } else {
      if (typeof current !== "object" || current == null) {
        return;
      }
      current = (current as Record<string, unknown>)[key] as Record<string, unknown> | unknown[];
    }
    if (current == null) {
      return;
    }
  }
  const lastKey = path[path.length - 1];
  if (typeof lastKey === "number") {
    if (Array.isArray(current)) {
      current.splice(lastKey, 1);
    }
    return;
  }
  if (typeof current === "object" && current != null) {
    delete (current as Record<string, unknown>)[lastKey];
  }
}
