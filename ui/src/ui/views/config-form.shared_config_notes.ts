# AUTOPLACEHOLDER_ANNOTATION: ui/src/ui/views/config-form.shared.ts
# Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
# Area: Web UI package and frontend runtime
# System effect: Changes impact interaction layer and operator experience.
import type { ConfigUiHints } from "../types.ts";

export type JsonSchema = {
  type?: string | string[];
  title?: string;
  description?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema | JsonSchema[];
  additionalProperties?: JsonSchema | boolean;
  enum?: unknown[];
  const?: unknown;
  default?: unknown;
  anyOf?: JsonSchema[];
  oneOf?: JsonSchema[];
  allOf?: JsonSchema[];
  nullable?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function schemaType(schema: JsonSchema): string | undefined {
  if (!schema) {
    return undefined;
  }
  if (Array.isArray(schema.type)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const filtered = schema.type.filter((t) => t !== "null");
    return filtered[0] ?? schema.type[0];
  }
  return schema.type;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function defaultValue(schema?: JsonSchema): unknown {
  if (!schema) {
    return "";
  }
  if (schema.default !== undefined) {
    return schema.default;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const type = schemaType(schema);
  switch (type) {
    case "object":
      return {};
    case "array":
      return [];
    case "boolean":
      return false;
    case "number":
    case "integer":
      return 0;
    case "string":
      return "";
    default:
      return "";
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function pathKey(path: Array<string | number>): string {
  return path.filter((segment) => typeof segment === "string").join(".");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function hintForPath(path: Array<string | number>, hints: ConfigUiHints) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = pathKey(path);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const direct = hints[key];
  if (direct) {
    return direct;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const segments = key.split(".");
  for (const [hintKey, hint] of Object.entries(hints)) {
    if (!hintKey.includes("*")) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const hintSegments = hintKey.split(".");
    if (hintSegments.length !== segments.length) {
      continue;
    }
    let match = true;
    for (let i = 0; i < segments.length; i += 1) {
      if (hintSegments[i] !== "*" && hintSegments[i] !== segments[i]) {
        match = false;
        break;
      }
    }
    if (match) {
      return hint;
    }
  }
  return undefined;
}

export function humanize(raw: string) {
  return raw
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .replace(/^./, (m) => m.toUpperCase());
}
