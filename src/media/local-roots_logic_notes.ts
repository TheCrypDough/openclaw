/*
 * AUTO ANNOTATION
 * File: src/media/local-roots.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { resolveAgentWorkspaceDir } from "../agents/agent-scope.js";
import type { OpenClawConfig } from "../config/config.js";
import { resolveStateDir } from "../config/paths.js";
import { resolvePreferredOpenClawTmpDir } from "../infra/tmp-openclaw-dir.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function buildMediaLocalRoots(stateDir: string): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedStateDir = path.resolve(stateDir);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const preferredTmpDir = resolvePreferredOpenClawTmpDir();
  return [
    preferredTmpDir,
    path.join(resolvedStateDir, "media"),
    path.join(resolvedStateDir, "agents"),
    path.join(resolvedStateDir, "workspace"),
    path.join(resolvedStateDir, "sandboxes"),
  ];
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getDefaultMediaLocalRoots(): readonly string[] {
  return buildMediaLocalRoots(resolveStateDir());
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getAgentScopedMediaLocalRoots(
  cfg: OpenClawConfig,
  agentId?: string,
): readonly string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const roots = buildMediaLocalRoots(resolveStateDir());
  if (!agentId?.trim()) {
    return roots;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
  if (!workspaceDir) {
    return roots;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedWorkspaceDir = path.resolve(workspaceDir);
  if (!roots.includes(normalizedWorkspaceDir)) {
    roots.push(normalizedWorkspaceDir);
  }
  return roots;
}
