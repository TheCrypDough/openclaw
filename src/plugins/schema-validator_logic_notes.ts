/*
 * AUTO ANNOTATION
 * File: src/plugins/schema-validator.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AjvPkg, { type ErrorObject, type ValidateFunction } from "ajv";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ajv = new (AjvPkg as unknown as new (opts?: object) => import("ajv").default)({
  allErrors: true,
  strict: false,
  removeAdditional: false,
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type CachedValidator = {
  validate: ValidateFunction;
  schema: Record<string, unknown>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const schemaCache = new Map<string, CachedValidator>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function formatAjvErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors || errors.length === 0) {
    return ["invalid config"];
  }
  return errors.map((error) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const path = error.instancePath?.replace(/^\//, "").replace(/\//g, ".") || "<root>";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = error.message ?? "invalid";
    return `${path}: ${message}`;
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function validateJsonSchemaValue(params: {
  schema: Record<string, unknown>;
  cacheKey: string;
  value: unknown;
}): { ok: true } | { ok: false; errors: string[] } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let cached = schemaCache.get(params.cacheKey);
  if (!cached || cached.schema !== params.schema) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const validate = ajv.compile(params.schema);
    cached = { validate, schema: params.schema };
    schemaCache.set(params.cacheKey, cached);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ok = cached.validate(params.value);
  if (ok) {
    return { ok: true };
  }
  return { ok: false, errors: formatAjvErrors(cached.validate.errors) };
}
