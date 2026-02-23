/*
 * AUTO ANNOTATION
 * File: src/agents/defaults.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
// Defaults for agent metadata when upstream does not supply them.
// Model id uses pi-ai's built-in Anthropic catalog.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_PROVIDER = "anthropic";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_MODEL = "claude-opus-4-6";
// Conservative fallback used when model metadata is unavailable.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_CONTEXT_TOKENS = 200_000;
