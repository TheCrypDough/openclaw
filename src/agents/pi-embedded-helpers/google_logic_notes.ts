/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-helpers/google.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { sanitizeGoogleTurnOrdering } from "./bootstrap.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isGoogleModelApi(api?: string | null): boolean {
  return (
    api === "google-gemini-cli" || api === "google-generative-ai" || api === "google-antigravity"
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isAntigravityClaude(params: {
  api?: string | null;
  provider?: string | null;
  modelId?: string;
}): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const provider = params.provider?.toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const api = params.api?.toLowerCase();
  if (provider !== "google-antigravity" && api !== "google-antigravity") {
    return false;
  }
  return params.modelId?.toLowerCase().includes("claude") ?? false;
}

export { sanitizeGoogleTurnOrdering };
