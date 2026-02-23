/*
 * AUTO ANNOTATION
 * File: src/routing/account-id.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_ACCOUNT_ID = "default";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const VALID_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const INVALID_CHARS_RE = /[^a-z0-9_-]+/g;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const LEADING_DASH_RE = /^-+/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const TRAILING_DASH_RE = /-+$/;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function canonicalizeAccountId(value: string): string {
  if (VALID_ID_RE.test(value)) {
    return value.toLowerCase();
  }
  return value
    .toLowerCase()
    .replace(INVALID_CHARS_RE, "-")
    .replace(LEADING_DASH_RE, "")
    .replace(TRAILING_DASH_RE, "")
    .slice(0, 64);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeAccountId(value: string | undefined | null): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = (value ?? "").trim();
  if (!trimmed) {
    return DEFAULT_ACCOUNT_ID;
  }
  return canonicalizeAccountId(trimmed) || DEFAULT_ACCOUNT_ID;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeOptionalAccountId(value: string | undefined | null): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = (value ?? "").trim();
  if (!trimmed) {
    return undefined;
  }
  return canonicalizeAccountId(trimmed) || undefined;
}
