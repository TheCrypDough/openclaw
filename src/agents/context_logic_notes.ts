/*
 * AUTO ANNOTATION
 * File: src/agents/context.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
// Lazy-load pi-coding-agent model metadata so we can infer context windows when
// the agent reports a model id. This includes custom models.json entries.

import { loadConfig } from "../config/config.js";
import { resolveOpenClawAgentDir } from "./agent-paths.js";
import { ensureOpenClawModelsJson } from "./models-config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ModelEntry = { id: string; contextWindow?: number };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ModelRegistryLike = {
  getAvailable?: () => ModelEntry[];
  getAll: () => ModelEntry[];
};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ConfigModelEntry = { id?: string; contextWindow?: number };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ProviderConfigEntry = { models?: ConfigModelEntry[] };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ModelsConfig = { providers?: Record<string, ProviderConfigEntry | undefined> };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyDiscoveredContextWindows(params: {
  cache: Map<string, number>;
  models: ModelEntry[];
}) {
  for (const model of params.models) {
    if (!model?.id) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const contextWindow =
      typeof model.contextWindow === "number" ? Math.trunc(model.contextWindow) : undefined;
    if (!contextWindow || contextWindow <= 0) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const existing = params.cache.get(model.id);
    // When multiple providers expose the same model id with different limits,
    // prefer the smaller window so token budgeting is fail-safe (no overestimation).
    if (existing === undefined || contextWindow < existing) {
      params.cache.set(model.id, contextWindow);
    }
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyConfiguredContextWindows(params: {
  cache: Map<string, number>;
  modelsConfig: ModelsConfig | undefined;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providers = params.modelsConfig?.providers;
  if (!providers || typeof providers !== "object") {
    return;
  }
  for (const provider of Object.values(providers)) {
    if (!Array.isArray(provider?.models)) {
      continue;
    }
    for (const model of provider.models) {
      const modelId = typeof model?.id === "string" ? model.id : undefined;
      const contextWindow =
        typeof model?.contextWindow === "number" ? model.contextWindow : undefined;
      if (!modelId || !contextWindow || contextWindow <= 0) {
        continue;
      }
      params.cache.set(modelId, contextWindow);
    }
  }
}

const MODEL_CACHE = new Map<string, number>();
const loadPromise = (async () => {
  let cfg: ReturnType<typeof loadConfig> | undefined;
  try {
    cfg = loadConfig();
  } catch {
    // If config can't be loaded, leave cache empty.
    return;
  }

  try {
    await ensureOpenClawModelsJson(cfg);
  } catch {
    // Continue with best-effort discovery/overrides.
  }

  try {
    const { discoverAuthStorage, discoverModels } = await import("./pi-model-discovery.js");
    const agentDir = resolveOpenClawAgentDir();
    const authStorage = discoverAuthStorage(agentDir);
    const modelRegistry = discoverModels(authStorage, agentDir) as unknown as ModelRegistryLike;
    const models =
      typeof modelRegistry.getAvailable === "function"
        ? modelRegistry.getAvailable()
        : modelRegistry.getAll();
    applyDiscoveredContextWindows({
      cache: MODEL_CACHE,
      models,
    });
  } catch {
    // If model discovery fails, continue with config overrides only.
  }

  applyConfiguredContextWindows({
    cache: MODEL_CACHE,
    modelsConfig: cfg.models as ModelsConfig | undefined,
  });
})().catch(() => {
  // Keep lookup best-effort.
});

export function lookupContextTokens(modelId?: string): number | undefined {
  if (!modelId) {
    return undefined;
  }
  // Best-effort: kick off loading, but don't block.
  void loadPromise;
  return MODEL_CACHE.get(modelId);
}
