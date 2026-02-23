/*
 * AUTO ANNOTATION
 * File: src/cli/route.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { isTruthyEnvValue } from "../infra/env.js";
import { defaultRuntime } from "../runtime.js";
import { VERSION } from "../version.js";
import { getCommandPath, hasHelpOrVersion } from "./argv.js";
import { emitCliBanner } from "./banner.js";
import { ensurePluginRegistryLoaded } from "./plugin-registry.js";
import { ensureConfigReady } from "./program/config-guard.js";
import { findRoutedCommand } from "./program/routes.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function prepareRoutedCommand(params: {
  argv: string[];
  commandPath: string[];
  loadPlugins?: boolean;
}) {
  emitCliBanner(VERSION, { argv: params.argv });
  await ensureConfigReady({ runtime: defaultRuntime, commandPath: params.commandPath });
  if (params.loadPlugins) {
    ensurePluginRegistryLoaded();
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function tryRouteCli(argv: string[]): Promise<boolean> {
  if (isTruthyEnvValue(process.env.OPENCLAW_DISABLE_ROUTE_FIRST)) {
    return false;
  }
  if (hasHelpOrVersion(argv)) {
    return false;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const path = getCommandPath(argv, 2);
  if (!path[0]) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const route = findRoutedCommand(path);
  if (!route) {
    return false;
  }
  await prepareRoutedCommand({ argv, commandPath: path, loadPlugins: route.loadPlugins });
  return route.run(argv);
}
