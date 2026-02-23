/*
 * AUTO ANNOTATION
 * File: src/agents/workspace-dirs.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "./agent-scope.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function listAgentWorkspaceDirs(cfg: OpenClawConfig): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dirs = new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const list = cfg.agents?.list;
  if (Array.isArray(list)) {
    for (const entry of list) {
      if (entry && typeof entry === "object" && typeof entry.id === "string") {
        dirs.add(resolveAgentWorkspaceDir(cfg, entry.id));
      }
    }
  }
  dirs.add(resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg)));
  return [...dirs];
}
