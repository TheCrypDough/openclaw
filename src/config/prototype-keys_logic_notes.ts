/*
 * AUTO ANNOTATION
 * File: src/config/prototype-keys.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const BLOCKED_OBJECT_KEYS = new Set(["__proto__", "prototype", "constructor"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isBlockedObjectKey(key: string): boolean {
  return BLOCKED_OBJECT_KEYS.has(key);
}
