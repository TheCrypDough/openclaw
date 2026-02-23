/*
 * AUTO ANNOTATION
 * File: src/cli/update-cli/suppress-deprecations.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Suppress Node.js deprecation warnings.
 *
 * On Node.js v23+ `process.noDeprecation` may be a read-only property
 * (defined via a getter on the prototype with no setter), so the
 * assignment can throw. We fall back to the environment variable which
 * achieves the same effect.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function suppressDeprecations(): void {
  try {
    process.noDeprecation = true;
  } catch {
    // read-only on Node v23+; NODE_NO_WARNINGS below covers this case
  }
  process.env.NODE_NO_WARNINGS = "1";
}
