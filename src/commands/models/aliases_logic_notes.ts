/*
 * AUTO ANNOTATION
 * File: src/commands/models/aliases.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { loadConfig } from "../../config/config.js";
import { logConfigUpdated } from "../../config/logging.js";
import type { RuntimeEnv } from "../../runtime.js";
import {
  ensureFlagCompatibility,
  normalizeAlias,
  resolveModelTarget,
  updateConfig,
} from "./shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function modelsAliasesListCommand(
  opts: { json?: boolean; plain?: boolean },
  runtime: RuntimeEnv,
) {
  ensureFlagCompatibility(opts);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const models = cfg.agents?.defaults?.models ?? {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const aliases = Object.entries(models).reduce<Record<string, string>>(
    (acc, [modelKey, entry]) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const alias = entry?.alias?.trim();
      if (alias) {
        acc[alias] = modelKey;
      }
      return acc;
    },
    {},
  );

  if (opts.json) {
    runtime.log(JSON.stringify({ aliases }, null, 2));
    return;
  }
  if (opts.plain) {
    for (const [alias, target] of Object.entries(aliases)) {
      runtime.log(`${alias} ${target}`);
    }
    return;
  }

  runtime.log(`Aliases (${Object.keys(aliases).length}):`);
  if (Object.keys(aliases).length === 0) {
    runtime.log("- none");
    return;
  }
  for (const [alias, target] of Object.entries(aliases)) {
    runtime.log(`- ${alias} -> ${target}`);
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function modelsAliasesAddCommand(
  aliasRaw: string,
  modelRaw: string,
  runtime: RuntimeEnv,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const alias = normalizeAlias(aliasRaw);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved = resolveModelTarget({ raw: modelRaw, cfg: loadConfig() });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const _updated = await updateConfig((cfg) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const modelKey = `${resolved.provider}/${resolved.model}`;
    const nextModels = { ...cfg.agents?.defaults?.models };
    for (const [key, entry] of Object.entries(nextModels)) {
      const existing = entry?.alias?.trim();
      if (existing && existing === alias && key !== modelKey) {
        throw new Error(`Alias ${alias} already points to ${key}.`);
      }
    }
    const existing = nextModels[modelKey] ?? {};
    nextModels[modelKey] = { ...existing, alias };
    return {
      ...cfg,
      agents: {
        ...cfg.agents,
        defaults: {
          ...cfg.agents?.defaults,
          models: nextModels,
        },
      },
    };
  });

  logConfigUpdated(runtime);
  runtime.log(`Alias ${alias} -> ${resolved.provider}/${resolved.model}`);
}

export async function modelsAliasesRemoveCommand(aliasRaw: string, runtime: RuntimeEnv) {
  const alias = normalizeAlias(aliasRaw);
  const updated = await updateConfig((cfg) => {
    const nextModels = { ...cfg.agents?.defaults?.models };
    let found = false;
    for (const [key, entry] of Object.entries(nextModels)) {
      if (entry?.alias?.trim() === alias) {
        nextModels[key] = { ...entry, alias: undefined };
        found = true;
        break;
      }
    }
    if (!found) {
      throw new Error(`Alias not found: ${alias}`);
    }
    return {
      ...cfg,
      agents: {
        ...cfg.agents,
        defaults: {
          ...cfg.agents?.defaults,
          models: nextModels,
        },
      },
    };
  });

  logConfigUpdated(runtime);
  if (
    !updated.agents?.defaults?.models ||
    Object.values(updated.agents.defaults.models).every((entry) => !entry?.alias?.trim())
  ) {
    runtime.log("No aliases configured.");
  }
}
