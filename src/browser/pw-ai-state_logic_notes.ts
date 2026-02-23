/*
 * AUTO ANNOTATION
 * File: src/browser/pw-ai-state.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let pwAiLoaded = false;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function markPwAiLoaded(): void {
  pwAiLoaded = true;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isPwAiLoaded(): boolean {
  return pwAiLoaded;
}
