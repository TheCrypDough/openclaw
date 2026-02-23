/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner/compaction-safety-timeout.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { withTimeout } from "../../node-host/with-timeout.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const EMBEDDED_COMPACTION_TIMEOUT_MS = 300_000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function compactWithSafetyTimeout<T>(
  compact: () => Promise<T>,
  timeoutMs: number = EMBEDDED_COMPACTION_TIMEOUT_MS,
): Promise<T> {
  return await withTimeout(() => compact(), timeoutMs, "Compaction");
}
