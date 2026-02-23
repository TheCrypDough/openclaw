/*
 * AUTO ANNOTATION
 * File: src/commands/openai-model-default.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import { ensureModelAllowlistEntry } from "./model-allowlist.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const OPENAI_DEFAULT_MODEL = "openai/gpt-5.1-codex";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyOpenAIProviderConfig(cfg: OpenClawConfig): OpenClawConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const next = ensureModelAllowlistEntry({
    cfg,
    modelRef: OPENAI_DEFAULT_MODEL,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const models = { ...next.agents?.defaults?.models };
  models[OPENAI_DEFAULT_MODEL] = {
    ...models[OPENAI_DEFAULT_MODEL],
    alias: models[OPENAI_DEFAULT_MODEL]?.alias ?? "GPT",
  };

  return {
    ...next,
    agents: {
      ...next.agents,
      defaults: {
        ...next.agents?.defaults,
        models,
      },
    },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyOpenAIConfig(cfg: OpenClawConfig): OpenClawConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const next = applyOpenAIProviderConfig(cfg);
  return {
    ...next,
    agents: {
      ...next.agents,
      defaults: {
        ...next.agents?.defaults,
        model:
          next.agents?.defaults?.model && typeof next.agents.defaults.model === "object"
            ? {
                ...next.agents.defaults.model,
                primary: OPENAI_DEFAULT_MODEL,
              }
            : { primary: OPENAI_DEFAULT_MODEL },
      },
    },
  };
}
