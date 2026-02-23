/*
 * AUTO ANNOTATION
 * File: src/utils/boolean.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type BooleanParseOptions = {
  truthy?: string[];
  falsy?: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_TRUTHY = ["true", "1", "yes", "on"] as const;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_FALSY = ["false", "0", "no", "off"] as const;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_TRUTHY_SET = new Set<string>(DEFAULT_TRUTHY);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_FALSY_SET = new Set<string>(DEFAULT_FALSY);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseBooleanValue(
  value: unknown,
  options: BooleanParseOptions = {},
): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value !== "string") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const truthy = options.truthy ?? DEFAULT_TRUTHY;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const falsy = options.falsy ?? DEFAULT_FALSY;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const truthySet = truthy === DEFAULT_TRUTHY ? DEFAULT_TRUTHY_SET : new Set(truthy);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const falsySet = falsy === DEFAULT_FALSY ? DEFAULT_FALSY_SET : new Set(falsy);
  if (truthySet.has(normalized)) {
    return true;
  }
  if (falsySet.has(normalized)) {
    return false;
  }
  return undefined;
}
