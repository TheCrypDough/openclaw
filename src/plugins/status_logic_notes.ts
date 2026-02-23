/*
 * AUTO ANNOTATION
 * File: src/plugins/status.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../agents/agent-scope.js";
import { resolveDefaultAgentWorkspaceDir } from "../agents/workspace.js";
import { loadConfig } from "../config/config.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import { loadOpenClawPlugins } from "./loader.js";
import { createPluginLoaderLogger } from "./logger.js";
import type { PluginRegistry } from "./registry.js";

export type PluginStatusReport = PluginRegistry & {
  workspaceDir?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("plugins");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildPluginStatusReport(params?: {
  config?: ReturnType<typeof loadConfig>;
  workspaceDir?: string;
}): PluginStatusReport {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const config = params?.config ?? loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const workspaceDir = params?.workspaceDir
    ? params.workspaceDir
    : (resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config)) ??
      resolveDefaultAgentWorkspaceDir());

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const registry = loadOpenClawPlugins({
    config,
    workspaceDir,
    logger: createPluginLoaderLogger(log),
  });

  return {
    workspaceDir,
    ...registry,
  };
}
