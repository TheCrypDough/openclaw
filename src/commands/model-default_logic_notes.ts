/*
 * AUTO ANNOTATION
 * File: src/commands/model-default.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import type { AgentModelListConfig } from "../config/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolvePrimaryModel(model?: AgentModelListConfig | string): string | undefined {
  if (typeof model === "string") {
    return model;
  }
  if (model && typeof model === "object" && typeof model.primary === "string") {
    return model.primary;
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyAgentDefaultPrimaryModel(params: {
  cfg: OpenClawConfig;
  model: string;
  legacyModels?: Set<string>;
}): { next: OpenClawConfig; changed: boolean } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const current = resolvePrimaryModel(params.cfg.agents?.defaults?.model)?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedCurrent = current && params.legacyModels?.has(current) ? params.model : current;
  if (normalizedCurrent === params.model) {
    return { next: params.cfg, changed: false };
  }

  return {
    next: {
      ...params.cfg,
      agents: {
        ...params.cfg.agents,
        defaults: {
          ...params.cfg.agents?.defaults,
          model:
            params.cfg.agents?.defaults?.model &&
            typeof params.cfg.agents.defaults.model === "object"
              ? {
                  ...params.cfg.agents.defaults.model,
                  primary: params.model,
                }
              : { primary: params.model },
        },
      },
    },
    changed: true,
  };
}
