/*
 * AUTO ANNOTATION
 * File: src/agents/tool-policy.conformance.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Conformance snapshot for tool policy.
 *
 * Security note:
 * - This is static, build-time information (no runtime I/O, no network exposure).
 * - Intended for CI/tools to detect drift between the implementation policy and
 *   the formal models/extractors.
 */

import { TOOL_GROUPS } from "./tool-policy.js";

// Tool name aliases are intentionally not exported from tool-policy today.
// Keep the conformance snapshot focused on exported policy constants.

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const TOOL_POLICY_CONFORMANCE = {
  toolGroups: TOOL_GROUPS,
} as const;
