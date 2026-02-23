/*
 * AUTO ANNOTATION
 * File: src/utils/normalize-secret-input.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Secret normalization for copy/pasted credentials.
 *
 * Common footgun: line breaks (especially `\r`) embedded in API keys/tokens.
 * We strip line breaks anywhere, then trim whitespace at the ends.
 *
 * Intentionally does NOT remove ordinary spaces inside the string to avoid
 * silently altering "Bearer <token>" style values.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeSecretInput(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/[\r\n\u2028\u2029]+/g, "").trim();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeOptionalSecretInput(value: unknown): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeSecretInput(value);
  return normalized ? normalized : undefined;
}
