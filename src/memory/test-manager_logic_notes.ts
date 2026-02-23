/*
 * AUTO ANNOTATION
 * File: src/memory/test-manager.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import { getMemorySearchManager, type MemoryIndexManager } from "./index.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function createMemoryManagerOrThrow(
  cfg: OpenClawConfig,
  agentId = "main",
): Promise<MemoryIndexManager> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = await getMemorySearchManager({ cfg, agentId });
  if (!result.manager) {
    throw new Error("manager missing");
  }
  return result.manager as unknown as MemoryIndexManager;
}
