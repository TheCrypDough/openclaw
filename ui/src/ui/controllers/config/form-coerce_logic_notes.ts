/*
 * AUTO ANNOTATION
 * File: ui/src/ui/controllers/config/form-coerce.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { schemaType, type JsonSchema } from "../../views/config-form.shared.ts";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function coerceNumberString(value: string, integer: boolean): number | undefined | string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return value;
  }
  if (integer && !Number.isInteger(parsed)) {
    return value;
  }
  return parsed;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function coerceBooleanString(value: string): boolean | string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
  if (trimmed === "true") {
    return true;
  }
  if (trimmed === "false") {
    return false;
  }
  return value;
}

/**
 * Walk a form value tree alongside its JSON Schema and coerce string values
 * to their schema-defined types (number, boolean).
 *
 * HTML `<input>` elements always produce string `.value` properties.  Even
 * though the form rendering code converts values correctly for most paths,
 * some interactions (map-field repopulation, re-renders, paste, etc.) can
 * leak raw strings into the config form state.  This utility acts as a
 * safety net before serialization so that `config.set` always receives
 * correctly typed JSON.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function coerceFormValues(value: unknown, schema: JsonSchema): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (schema.allOf && schema.allOf.length > 0) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let next: unknown = value;
    for (const segment of schema.allOf) {
      next = coerceFormValues(next, segment);
    }
    return next;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const type = schemaType(schema);

  // Handle anyOf/oneOf — try to match the value against a variant
  if (schema.anyOf || schema.oneOf) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const variants = (schema.anyOf ?? schema.oneOf ?? []).filter(
      (v) => !(v.type === "null" || (Array.isArray(v.type) && v.type.includes("null"))),
    );

    if (variants.length === 1) {
      return coerceFormValues(value, variants[0]);
    }

    // Try number/boolean coercion for string values
    if (typeof value === "string") {
      for (const variant of variants) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const variantType = schemaType(variant);
        if (variantType === "number" || variantType === "integer") {
          const coerced = coerceNumberString(value, variantType === "integer");
          if (coerced === undefined || typeof coerced === "number") {
            return coerced;
          }
        }
        if (variantType === "boolean") {
          const coerced = coerceBooleanString(value);
          if (typeof coerced === "boolean") {
            return coerced;
          }
        }
      }
    }

    // For non-string values (objects, arrays), try to recurse into matching variant
    for (const variant of variants) {
      const variantType = schemaType(variant);
      if (variantType === "object" && typeof value === "object" && !Array.isArray(value)) {
        return coerceFormValues(value, variant);
      }
      if (variantType === "array" && Array.isArray(value)) {
        return coerceFormValues(value, variant);
      }
    }

    return value;
  }

  if (type === "number" || type === "integer") {
    if (typeof value === "string") {
      const coerced = coerceNumberString(value, type === "integer");
      if (coerced === undefined || typeof coerced === "number") {
        return coerced;
      }
    }
    return value;
  }

  if (type === "boolean") {
    if (typeof value === "string") {
      const coerced = coerceBooleanString(value);
      if (typeof coerced === "boolean") {
        return coerced;
      }
    }
    return value;
  }

  if (type === "object") {
    if (typeof value !== "object" || Array.isArray(value)) {
      return value;
    }
    const obj = value as Record<string, unknown>;
    const props = schema.properties ?? {};
    const additional =
      schema.additionalProperties && typeof schema.additionalProperties === "object"
        ? schema.additionalProperties
        : null;
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      const propSchema = props[key] ?? additional;
      const coerced = propSchema ? coerceFormValues(val, propSchema) : val;
      // Omit undefined — "clear field = unset" for optional properties
      if (coerced !== undefined) {
        result[key] = coerced;
      }
    }
    return result;
  }

  if (type === "array") {
    if (!Array.isArray(value)) {
      return value;
    }
    if (Array.isArray(schema.items)) {
      // Tuple form: each index has its own schema
      const tuple = schema.items;
      return value.map((item, i) => {
        const s = i < tuple.length ? tuple[i] : undefined;
        return s ? coerceFormValues(item, s) : item;
      });
    }
    const itemsSchema = schema.items;
    if (!itemsSchema) {
      return value;
    }
    return value.map((item) => coerceFormValues(item, itemsSchema)).filter((v) => v !== undefined);
  }

  return value;
}
