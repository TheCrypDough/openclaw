/*
 * AUTO ANNOTATION
 * File: src/commands/cleanup-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { resolveDefaultAgentWorkspaceDir } from "../agents/workspace.js";
import type { OpenClawConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
import { resolveHomeDir, resolveUserPath, shortenHomeInString } from "../utils.js";

export type RemovalResult = {
  ok: boolean;
  skipped?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function collectWorkspaceDirs(cfg: OpenClawConfig | undefined): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dirs = new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const defaults = cfg?.agents?.defaults;
  if (typeof defaults?.workspace === "string" && defaults.workspace.trim()) {
    dirs.add(resolveUserPath(defaults.workspace));
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const list = Array.isArray(cfg?.agents?.list) ? cfg?.agents?.list : [];
  for (const agent of list) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const workspace = (agent as { workspace?: unknown }).workspace;
    if (typeof workspace === "string" && workspace.trim()) {
      dirs.add(resolveUserPath(workspace));
    }
  }
  if (dirs.size === 0) {
    dirs.add(resolveDefaultAgentWorkspaceDir());
  }
  return [...dirs];
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildCleanupPlan(params: {
  cfg: OpenClawConfig | undefined;
  stateDir: string;
  configPath: string;
  oauthDir: string;
}): {
  configInsideState: boolean;
  oauthInsideState: boolean;
  workspaceDirs: string[];
} {
  return {
    configInsideState: isPathWithin(params.configPath, params.stateDir),
    oauthInsideState: isPathWithin(params.oauthDir, params.stateDir),
    workspaceDirs: collectWorkspaceDirs(params.cfg),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isPathWithin(child: string, parent: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isUnsafeRemovalTarget(target: string): boolean {
  if (!target.trim()) {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved = path.resolve(target);
  const root = path.parse(resolved).root;
  if (resolved === root) {
    return true;
  }
  const home = resolveHomeDir();
  if (home && resolved === path.resolve(home)) {
    return true;
  }
  return false;
}

export async function removePath(
  target: string,
  runtime: RuntimeEnv,
  opts?: { dryRun?: boolean; label?: string },
): Promise<RemovalResult> {
  if (!target?.trim()) {
    return { ok: false, skipped: true };
  }
  const resolved = path.resolve(target);
  const label = opts?.label ?? resolved;
  const displayLabel = shortenHomeInString(label);
  if (isUnsafeRemovalTarget(resolved)) {
    runtime.error(`Refusing to remove unsafe path: ${displayLabel}`);
    return { ok: false };
  }
  if (opts?.dryRun) {
    runtime.log(`[dry-run] remove ${displayLabel}`);
    return { ok: true, skipped: true };
  }
  try {
    await fs.rm(resolved, { recursive: true, force: true });
    runtime.log(`Removed ${displayLabel}`);
    return { ok: true };
  } catch (err) {
    runtime.error(`Failed to remove ${displayLabel}: ${String(err)}`);
    return { ok: false };
  }
}

export async function listAgentSessionDirs(stateDir: string): Promise<string[]> {
  const root = path.join(stateDir, "agents");
  try {
    const entries = await fs.readdir(root, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(root, entry.name, "sessions"));
  } catch {
    return [];
  }
}
