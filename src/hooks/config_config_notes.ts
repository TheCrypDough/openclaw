# AUTOPLACEHOLDER_ANNOTATION: src/hooks/config.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import type { OpenClawConfig, HookConfig } from "../config/config.js";
import {
  evaluateRuntimeRequires,
  hasBinary,
  isConfigPathTruthyWithDefaults,
  resolveConfigPath,
  resolveRuntimePlatform,
} from "../shared/config-eval.js";
import { resolveHookKey } from "./frontmatter.js";
import type { HookEligibilityContext, HookEntry } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_CONFIG_VALUES: Record<string, boolean> = {
  "browser.enabled": true,
  "browser.evaluateEnabled": true,
  "workspace.dir": true,
};

export { hasBinary, resolveConfigPath, resolveRuntimePlatform };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isConfigPathTruthy(config: OpenClawConfig | undefined, pathStr: string): boolean {
  return isConfigPathTruthyWithDefaults(config, pathStr, DEFAULT_CONFIG_VALUES);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveHookConfig(
  config: OpenClawConfig | undefined,
  hookKey: string,
): HookConfig | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hooks = config?.hooks?.internal?.entries;
  if (!hooks || typeof hooks !== "object") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entry = (hooks as Record<string, HookConfig | undefined>)[hookKey];
  if (!entry || typeof entry !== "object") {
    return undefined;
  }
  return entry;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function shouldIncludeHook(params: {
  entry: HookEntry;
  config?: OpenClawConfig;
  eligibility?: HookEligibilityContext;
}): boolean {
  const { entry, config, eligibility } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hookKey = resolveHookKey(entry.hook.name, entry);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hookConfig = resolveHookConfig(config, hookKey);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pluginManaged = entry.hook.source === "openclaw-plugin";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const osList = entry.metadata?.os ?? [];
  const remotePlatforms = eligibility?.remote?.platforms ?? [];

  // Check if explicitly disabled
  if (!pluginManaged && hookConfig?.enabled === false) {
    return false;
  }

  // Check OS requirement
  if (
    osList.length > 0 &&
    !osList.includes(resolveRuntimePlatform()) &&
    !remotePlatforms.some((platform) => osList.includes(platform))
  ) {
    return false;
  }

  // If marked as 'always', bypass all other checks
  if (entry.metadata?.always === true) {
    return true;
  }

  return evaluateRuntimeRequires({
    requires: entry.metadata?.requires,
    hasBin: hasBinary,
    hasRemoteBin: eligibility?.remote?.hasBin,
    hasAnyRemoteBin: eligibility?.remote?.hasAnyBin,
    hasEnv: (envName) => Boolean(process.env[envName] || hookConfig?.env?.[envName]),
    isConfigPathTruthy: (configPath) => isConfigPathTruthy(config, configPath),
  });
}
