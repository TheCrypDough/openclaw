/*
 * AUTO ANNOTATION
 * File: src/commands/auth-choice.apply.xai.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveEnvApiKey } from "../agents/model-auth.js";
import {
  formatApiKeyPreview,
  normalizeApiKeyInput,
  validateApiKeyInput,
} from "./auth-choice.api-key.js";
import { createAuthChoiceAgentModelNoter } from "./auth-choice.apply-helpers.js";
import type { ApplyAuthChoiceParams, ApplyAuthChoiceResult } from "./auth-choice.apply.js";
import { applyDefaultModelChoice } from "./auth-choice.default-model.js";
import {
  applyAuthProfileConfig,
  applyXaiConfig,
  applyXaiProviderConfig,
  setXaiApiKey,
  XAI_DEFAULT_MODEL_REF,
} from "./onboard-auth.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function applyAuthChoiceXAI(
  params: ApplyAuthChoiceParams,
): Promise<ApplyAuthChoiceResult | null> {
  if (params.authChoice !== "xai-api-key") {
    return null;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let nextConfig = params.config;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let agentModelOverride: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const noteAgentModel = createAuthChoiceAgentModelNoter(params);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let hasCredential = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const optsKey = params.opts?.xaiApiKey?.trim();
  if (optsKey) {
    setXaiApiKey(normalizeApiKeyInput(optsKey), params.agentDir);
    hasCredential = true;
  }

  if (!hasCredential) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const envKey = resolveEnvApiKey("xai");
    if (envKey) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const useExisting = await params.prompter.confirm({
        message: `Use existing XAI_API_KEY (${envKey.source}, ${formatApiKeyPreview(envKey.apiKey)})?`,
        initialValue: true,
      });
      if (useExisting) {
        setXaiApiKey(envKey.apiKey, params.agentDir);
        hasCredential = true;
      }
    }
  }

  if (!hasCredential) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const key = await params.prompter.text({
      message: "Enter xAI API key",
      validate: validateApiKeyInput,
    });
    setXaiApiKey(normalizeApiKeyInput(String(key)), params.agentDir);
  }

  nextConfig = applyAuthProfileConfig(nextConfig, {
    profileId: "xai:default",
    provider: "xai",
    mode: "api_key",
  });
  {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const applied = await applyDefaultModelChoice({
      config: nextConfig,
      setDefaultModel: params.setDefaultModel,
      defaultModel: XAI_DEFAULT_MODEL_REF,
      applyDefaultConfig: applyXaiConfig,
      applyProviderConfig: applyXaiProviderConfig,
      noteDefault: XAI_DEFAULT_MODEL_REF,
      noteAgentModel,
      prompter: params.prompter,
    });
    nextConfig = applied.config;
    agentModelOverride = applied.agentModelOverride ?? agentModelOverride;
  }

  return { config: nextConfig, agentModelOverride };
}
