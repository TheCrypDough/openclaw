/*
 * AUTO ANNOTATION
 * File: src/cli/program/preaction.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import { setVerbose } from "../../globals.js";
import { isTruthyEnvValue } from "../../infra/env.js";
import { defaultRuntime } from "../../runtime.js";
import { getCommandPath, getVerboseFlag, hasHelpOrVersion } from "../argv.js";
import { emitCliBanner } from "../banner.js";
import { resolveCliName } from "../cli-name.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function setProcessTitleForCommand(actionCommand: Command) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let current: Command = actionCommand;
  while (current.parent && current.parent.parent) {
    current = current.parent;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const name = current.name();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cliName = resolveCliName();
  if (!name || name === cliName) {
    return;
  }
  process.title = `${cliName}-${name}`;
}

// Commands that need channel plugins loaded
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const PLUGIN_REQUIRED_COMMANDS = new Set(["message", "channels", "directory"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerPreActionHooks(program: Command, programVersion: string) {
  program.hook("preAction", async (_thisCommand, actionCommand) => {
    setProcessTitleForCommand(actionCommand);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const argv = process.argv;
    if (hasHelpOrVersion(argv)) {
      return;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const commandPath = getCommandPath(argv, 2);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const hideBanner =
      isTruthyEnvValue(process.env.OPENCLAW_HIDE_BANNER) ||
      commandPath[0] === "update" ||
      commandPath[0] === "completion" ||
      (commandPath[0] === "plugins" && commandPath[1] === "update");
    if (!hideBanner) {
      emitCliBanner(programVersion);
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const verbose = getVerboseFlag(argv, { includeDebug: true });
    setVerbose(verbose);
    if (!verbose) {
      process.env.NODE_NO_WARNINGS ??= "1";
    }
    if (commandPath[0] === "doctor" || commandPath[0] === "completion") {
      return;
    }
    const { ensureConfigReady } = await import("./config-guard.js");
    await ensureConfigReady({ runtime: defaultRuntime, commandPath });
    // Load plugins for commands that need channel access
    if (PLUGIN_REQUIRED_COMMANDS.has(commandPath[0])) {
      const { ensurePluginRegistryLoaded } = await import("../plugin-registry.js");
      ensurePluginRegistryLoaded();
    }
  });
}
