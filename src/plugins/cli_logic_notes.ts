/*
 * AUTO ANNOTATION
 * File: src/plugins/cli.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../agents/agent-scope.js";
import type { OpenClawConfig } from "../config/config.js";
import { loadConfig } from "../config/config.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import { loadOpenClawPlugins } from "./loader.js";
import type { PluginLogger } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("plugins");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerPluginCliCommands(program: Command, cfg?: OpenClawConfig) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const config = cfg ?? loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const workspaceDir = resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const logger: PluginLogger = {
    info: (msg: string) => log.info(msg),
    warn: (msg: string) => log.warn(msg),
    error: (msg: string) => log.error(msg),
    debug: (msg: string) => log.debug(msg),
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const registry = loadOpenClawPlugins({
    config,
    workspaceDir,
    logger,
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existingCommands = new Set(program.commands.map((cmd) => cmd.name()));

  for (const entry of registry.cliRegistrars) {
    if (entry.commands.length > 0) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const overlaps = entry.commands.filter((command) => existingCommands.has(command));
      if (overlaps.length > 0) {
        log.debug(
          `plugin CLI register skipped (${entry.pluginId}): command already registered (${overlaps.join(
            ", ",
          )})`,
        );
        continue;
      }
    }
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = entry.register({
        program,
        config,
        workspaceDir,
        logger,
      });
      if (result && typeof result.then === "function") {
        void result.catch((err) => {
          log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
        });
      }
      for (const command of entry.commands) {
        existingCommands.add(command);
      }
    } catch (err) {
      log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
    }
  }
}
