/*
 * AUTO ANNOTATION
 * File: src/commands/auth-token.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeProviderId } from "../agents/model-selection.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const ANTHROPIC_SETUP_TOKEN_PREFIX = "sk-ant-oat01-";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const ANTHROPIC_SETUP_TOKEN_MIN_LENGTH = 80;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_TOKEN_PROFILE_NAME = "default";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeTokenProfileName(raw: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return DEFAULT_TOKEN_PROFILE_NAME;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const slug = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || DEFAULT_TOKEN_PROFILE_NAME;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildTokenProfileId(params: { provider: string; name: string }): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const provider = normalizeProviderId(params.provider);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const name = normalizeTokenProfileName(params.name);
  return `${provider}:${name}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function validateAnthropicSetupToken(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "Required";
  }
  if (!trimmed.startsWith(ANTHROPIC_SETUP_TOKEN_PREFIX)) {
    return `Expected token starting with ${ANTHROPIC_SETUP_TOKEN_PREFIX}`;
  }
  if (trimmed.length < ANTHROPIC_SETUP_TOKEN_MIN_LENGTH) {
    return "Token looks too short; paste the full setup-token";
  }
  return undefined;
}
