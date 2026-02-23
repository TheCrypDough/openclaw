/*
 * AUTO ANNOTATION
 * File: src/agents/system-prompt-params.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import type { OpenClawConfig } from "../config/config.js";
import { findGitRoot } from "../infra/git-root.js";
import {
  formatUserTime,
  resolveUserTimeFormat,
  resolveUserTimezone,
  type ResolvedTimeFormat,
} from "./date-time.js";

export type RuntimeInfoInput = {
  agentId?: string;
  host: string;
  os: string;
  arch: string;
  node: string;
  model: string;
  defaultModel?: string;
  shell?: string;
  channel?: string;
  capabilities?: string[];
  /** Supported message actions for the current channel (e.g., react, edit, unsend) */
  channelActions?: string[];
  repoRoot?: string;
};

export type SystemPromptRuntimeParams = {
  runtimeInfo: RuntimeInfoInput;
  userTimezone: string;
  userTime?: string;
  userTimeFormat?: ResolvedTimeFormat;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildSystemPromptParams(params: {
  config?: OpenClawConfig;
  agentId?: string;
  runtime: Omit<RuntimeInfoInput, "agentId">;
  workspaceDir?: string;
  cwd?: string;
}): SystemPromptRuntimeParams {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const repoRoot = resolveRepoRoot({
    config: params.config,
    workspaceDir: params.workspaceDir,
    cwd: params.cwd,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const userTimezone = resolveUserTimezone(params.config?.agents?.defaults?.userTimezone);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const userTimeFormat = resolveUserTimeFormat(params.config?.agents?.defaults?.timeFormat);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const userTime = formatUserTime(new Date(), userTimezone, userTimeFormat);
  return {
    runtimeInfo: {
      agentId: params.agentId,
      ...params.runtime,
      repoRoot,
    },
    userTimezone,
    userTime,
    userTimeFormat,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveRepoRoot(params: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  cwd?: string;
}): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configured = params.config?.agents?.defaults?.repoRoot?.trim();
  if (configured) {
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const resolved = path.resolve(configured);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const stat = fs.statSync(resolved);
      if (stat.isDirectory()) {
        return resolved;
      }
    } catch {
      // ignore invalid config path
    }
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const candidates = [params.workspaceDir, params.cwd]
    .map((value) => value?.trim())
    .filter(Boolean) as string[];
  const seen = new Set<string>();
  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (seen.has(resolved)) {
      continue;
    }
    seen.add(resolved);
    const root = findGitRoot(resolved);
    if (root) {
      return root;
    }
  }
  return undefined;
}
