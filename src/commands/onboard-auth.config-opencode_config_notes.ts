# AUTOPLACEHOLDER_ANNOTATION: src/commands/onboard-auth.config-opencode.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { OPENCODE_ZEN_DEFAULT_MODEL_REF } from "../agents/opencode-zen-models.js";
import type { OpenClawConfig } from "../config/config.js";
import { applyAgentDefaultModelPrimary } from "./onboard-auth.config-shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyOpencodeZenProviderConfig(cfg: OpenClawConfig): OpenClawConfig {
  // Use the built-in opencode provider from pi-ai; only seed the allowlist alias.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const models = { ...cfg.agents?.defaults?.models };
  models[OPENCODE_ZEN_DEFAULT_MODEL_REF] = {
    ...models[OPENCODE_ZEN_DEFAULT_MODEL_REF],
    alias: models[OPENCODE_ZEN_DEFAULT_MODEL_REF]?.alias ?? "Opus",
  };

  return {
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...cfg.agents?.defaults,
        models,
      },
    },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyOpencodeZenConfig(cfg: OpenClawConfig): OpenClawConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const next = applyOpencodeZenProviderConfig(cfg);
  return applyAgentDefaultModelPrimary(next, OPENCODE_ZEN_DEFAULT_MODEL_REF);
}
