/*
 * AUTO ANNOTATION
 * File: src/agents/pi-extensions/compaction-safeguard-runtime.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createSessionManagerRuntimeRegistry } from "./session-manager-runtime-registry.js";

export type CompactionSafeguardRuntimeValue = {
  maxHistoryShare?: number;
  contextWindowTokens?: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const registry = createSessionManagerRuntimeRegistry<CompactionSafeguardRuntimeValue>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const setCompactionSafeguardRuntime = registry.set;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const getCompactionSafeguardRuntime = registry.get;
