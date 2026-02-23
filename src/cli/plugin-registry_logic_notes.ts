/*
 * AUTO ANNOTATION
 * File: src/cli/plugin-registry.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../agents/agent-scope.js";
import { loadConfig } from "../config/config.js";
import { createSubsystemLogger } from "../logging.js";
import { loadOpenClawPlugins } from "../plugins/loader.js";
import { getActivePluginRegistry } from "../plugins/runtime.js";
import type { PluginLogger } from "../plugins/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("plugins");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let pluginRegistryLoaded = false;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function ensurePluginRegistryLoaded(): void {
  if (pluginRegistryLoaded) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const active = getActivePluginRegistry();
  // Tests (and callers) can pre-seed a registry (e.g. `test/setup.ts`); avoid
  // doing an expensive load when we already have plugins/channels/tools.
  if (
    active &&
    (active.plugins.length > 0 || active.channels.length > 0 || active.tools.length > 0)
  ) {
    pluginRegistryLoaded = true;
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const config = loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const workspaceDir = resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const logger: PluginLogger = {
    info: (msg) => log.info(msg),
    warn: (msg) => log.warn(msg),
    error: (msg) => log.error(msg),
    debug: (msg) => log.debug(msg),
  };
  loadOpenClawPlugins({
    config,
    workspaceDir,
    logger,
  });
  pluginRegistryLoaded = true;
}
