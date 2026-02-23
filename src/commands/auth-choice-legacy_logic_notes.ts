/*
 * AUTO ANNOTATION
 * File: src/commands/auth-choice-legacy.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AuthChoice } from "./onboard-types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const AUTH_CHOICE_LEGACY_ALIASES_FOR_CLI: ReadonlyArray<AuthChoice> = [
  "setup-token",
  "oauth",
  "claude-cli",
  "codex-cli",
  "minimax-cloud",
  "minimax",
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeLegacyOnboardAuthChoice(
  authChoice: AuthChoice | undefined,
): AuthChoice | undefined {
  if (authChoice === "oauth" || authChoice === "claude-cli") {
    return "setup-token";
  }
  if (authChoice === "codex-cli") {
    return "openai-codex";
  }
  return authChoice;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isDeprecatedAuthChoice(
  authChoice: AuthChoice | undefined,
): authChoice is "claude-cli" | "codex-cli" {
  return authChoice === "claude-cli" || authChoice === "codex-cli";
}
