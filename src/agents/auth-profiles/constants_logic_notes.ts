/*
 * AUTO ANNOTATION
 * File: src/agents/auth-profiles/constants.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createSubsystemLogger } from "../../logging/subsystem.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const AUTH_STORE_VERSION = 1;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const AUTH_PROFILE_FILENAME = "auth-profiles.json";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const LEGACY_AUTH_FILENAME = "auth.json";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CLAUDE_CLI_PROFILE_ID = "anthropic:claude-cli";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CODEX_CLI_PROFILE_ID = "openai-codex:codex-cli";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const QWEN_CLI_PROFILE_ID = "qwen-portal:qwen-cli";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const MINIMAX_CLI_PROFILE_ID = "minimax-portal:minimax-cli";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const AUTH_STORE_LOCK_OPTIONS = {
  retries: {
    retries: 10,
    factor: 2,
    minTimeout: 100,
    maxTimeout: 10_000,
    randomize: true,
  },
  stale: 30_000,
} as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const EXTERNAL_CLI_SYNC_TTL_MS = 15 * 60 * 1000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const EXTERNAL_CLI_NEAR_EXPIRY_MS = 10 * 60 * 1000;

export const log = createSubsystemLogger("agents/auth-profiles");
