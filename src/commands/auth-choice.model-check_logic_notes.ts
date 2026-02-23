/*
 * AUTO ANNOTATION
 * File: src/commands/auth-choice.model-check.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveAgentModelPrimary } from "../agents/agent-scope.js";
import { ensureAuthProfileStore, listProfilesForProvider } from "../agents/auth-profiles.js";
import { DEFAULT_MODEL, DEFAULT_PROVIDER } from "../agents/defaults.js";
import { getCustomProviderApiKey, resolveEnvApiKey } from "../agents/model-auth.js";
import { loadModelCatalog } from "../agents/model-catalog.js";
import { resolveConfiguredModelRef } from "../agents/model-selection.js";
import type { OpenClawConfig } from "../config/config.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import { OPENAI_CODEX_DEFAULT_MODEL } from "./openai-codex-model-default.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function warnIfModelConfigLooksOff(
  config: OpenClawConfig,
  prompter: WizardPrompter,
  options?: { agentId?: string; agentDir?: string },
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentModelOverride = options?.agentId
    ? resolveAgentModelPrimary(config, options.agentId)
    : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configWithModel =
    agentModelOverride && agentModelOverride.length > 0
      ? {
          ...config,
          agents: {
            ...config.agents,
            defaults: {
              ...config.agents?.defaults,
              model: {
                ...(typeof config.agents?.defaults?.model === "object"
                  ? config.agents.defaults.model
                  : undefined),
                primary: agentModelOverride,
              },
            },
          },
        }
      : config;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ref = resolveConfiguredModelRef({
    cfg: configWithModel,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: DEFAULT_MODEL,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const warnings: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const catalog = await loadModelCatalog({
    config: configWithModel,
    useCache: false,
  });
  if (catalog.length > 0) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const known = catalog.some(
      (entry) => entry.provider === ref.provider && entry.id === ref.model,
    );
    if (!known) {
      warnings.push(
        `Model not found: ${ref.provider}/${ref.model}. Update agents.defaults.model or run /models list.`,
      );
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const store = ensureAuthProfileStore(options?.agentDir);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasProfile = listProfilesForProvider(store, ref.provider).length > 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const envKey = resolveEnvApiKey(ref.provider);
  const customKey = getCustomProviderApiKey(config, ref.provider);
  if (!hasProfile && !envKey && !customKey) {
    warnings.push(
      `No auth configured for provider "${ref.provider}". The agent may fail until credentials are added.`,
    );
  }

  if (ref.provider === "openai") {
    const hasCodex = listProfilesForProvider(store, "openai-codex").length > 0;
    if (hasCodex) {
      warnings.push(
        `Detected OpenAI Codex OAuth. Consider setting agents.defaults.model to ${OPENAI_CODEX_DEFAULT_MODEL}.`,
      );
    }
  }

  if (warnings.length > 0) {
    await prompter.note(warnings.join("\n"), "Model check");
  }
}
