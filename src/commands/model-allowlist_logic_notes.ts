/*
 * AUTO ANNOTATION
 * File: src/commands/model-allowlist.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { DEFAULT_PROVIDER } from "../agents/defaults.js";
import { resolveAllowlistModelKey } from "../agents/model-selection.js";
import type { OpenClawConfig } from "../config/config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function ensureModelAllowlistEntry(params: {
  cfg: OpenClawConfig;
  modelRef: string;
  defaultProvider?: string;
}): OpenClawConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rawModelRef = params.modelRef.trim();
  if (!rawModelRef) {
    return params.cfg;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const models = { ...params.cfg.agents?.defaults?.models };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const keySet = new Set<string>([rawModelRef]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const canonicalKey = resolveAllowlistModelKey(
    rawModelRef,
    params.defaultProvider ?? DEFAULT_PROVIDER,
  );
  if (canonicalKey) {
    keySet.add(canonicalKey);
  }

  for (const key of keySet) {
    models[key] = {
      ...models[key],
    };
  }

  return {
    ...params.cfg,
    agents: {
      ...params.cfg.agents,
      defaults: {
        ...params.cfg.agents?.defaults,
        models,
      },
    },
  };
}
