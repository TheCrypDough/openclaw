/*
 * AUTO ANNOTATION
 * File: src/commands/openai-codex-model-default.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import type { AgentModelListConfig } from "../config/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const OPENAI_CODEX_DEFAULT_MODEL = "openai-codex/gpt-5.3-codex";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function shouldSetOpenAICodexModel(model?: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = model?.trim();
  if (!trimmed) {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = trimmed.toLowerCase();
  if (normalized.startsWith("openai-codex/")) {
    return false;
  }
  if (normalized.startsWith("openai/")) {
    return true;
  }
  return normalized === "gpt" || normalized === "gpt-mini";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolvePrimaryModel(model?: AgentModelListConfig | string): string | undefined {
  if (typeof model === "string") {
    return model;
  }
  if (model && typeof model === "object" && typeof model.primary === "string") {
    return model.primary;
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyOpenAICodexModelDefault(cfg: OpenClawConfig): {
  next: OpenClawConfig;
  changed: boolean;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const current = resolvePrimaryModel(cfg.agents?.defaults?.model);
  if (!shouldSetOpenAICodexModel(current)) {
    return { next: cfg, changed: false };
  }
  return {
    next: {
      ...cfg,
      agents: {
        ...cfg.agents,
        defaults: {
          ...cfg.agents?.defaults,
          model:
            cfg.agents?.defaults?.model && typeof cfg.agents.defaults.model === "object"
              ? {
                  ...cfg.agents.defaults.model,
                  primary: OPENAI_CODEX_DEFAULT_MODEL,
                }
              : { primary: OPENAI_CODEX_DEFAULT_MODEL },
        },
      },
    },
    changed: true,
  };
}
