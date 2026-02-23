/*
 * AUTO ANNOTATION
 * File: src/cli/respawn-policy.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { hasHelpOrVersion } from "./argv.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function shouldSkipRespawnForArgv(argv: string[]): boolean {
  return hasHelpOrVersion(argv);
}
