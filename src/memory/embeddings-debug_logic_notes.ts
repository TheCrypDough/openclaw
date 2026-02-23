/*
 * AUTO ANNOTATION
 * File: src/memory/embeddings-debug.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { isTruthyEnvValue } from "../infra/env.js";
import { createSubsystemLogger } from "../logging/subsystem.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const debugEmbeddings = isTruthyEnvValue(process.env.OPENCLAW_DEBUG_MEMORY_EMBEDDINGS);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("memory/embeddings");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function debugEmbeddingsLog(message: string, meta?: Record<string, unknown>): void {
  if (!debugEmbeddings) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
  log.raw(`${message}${suffix}`);
}
