/*
 * AUTO ANNOTATION
 * File: src/agents/workspace-dir.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { resolveUserPath } from "../utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeWorkspaceDir(workspaceDir?: string): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = workspaceDir?.trim();
  if (!trimmed) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const expanded = trimmed.startsWith("~") ? resolveUserPath(trimmed) : trimmed;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved = path.resolve(expanded);
  // Refuse filesystem roots as "workspace" (too broad; almost always a bug).
  if (resolved === path.parse(resolved).root) {
    return null;
  }
  return resolved;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveWorkspaceRoot(workspaceDir?: string): string {
  return normalizeWorkspaceDir(workspaceDir) ?? process.cwd();
}
