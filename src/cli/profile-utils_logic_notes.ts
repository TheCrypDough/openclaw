/*
 * AUTO ANNOTATION
 * File: src/cli/profile-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const PROFILE_NAME_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isValidProfileName(value: string): boolean {
  if (!value) {
    return false;
  }
  // Keep it path-safe + shell-friendly.
  return PROFILE_NAME_RE.test(value);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeProfileName(raw?: string | null): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const profile = raw?.trim();
  if (!profile) {
    return null;
  }
  if (profile.toLowerCase() === "default") {
    return null;
  }
  if (!isValidProfileName(profile)) {
    return null;
  }
  return profile;
}
