/*
 * AUTO ANNOTATION
 * File: src/infra/exec-safety.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SHELL_METACHARS = /[;&|`$<>]/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CONTROL_CHARS = /[\r\n]/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const QUOTE_CHARS = /["']/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const BARE_NAME_PATTERN = /^[A-Za-z0-9._+-]+$/;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isLikelyPath(value: string): boolean {
  if (value.startsWith(".") || value.startsWith("~")) {
    return true;
  }
  if (value.includes("/") || value.includes("\\")) {
    return true;
  }
  return /^[A-Za-z]:[\\/]/.test(value);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isSafeExecutableValue(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  if (trimmed.includes("\0")) {
    return false;
  }
  if (CONTROL_CHARS.test(trimmed)) {
    return false;
  }
  if (SHELL_METACHARS.test(trimmed)) {
    return false;
  }
  if (QUOTE_CHARS.test(trimmed)) {
    return false;
  }

  if (isLikelyPath(trimmed)) {
    return true;
  }
  if (trimmed.startsWith("-")) {
    return false;
  }
  return BARE_NAME_PATTERN.test(trimmed);
}
